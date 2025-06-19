const axios = require('axios').default; // npm install axios
const CryptoJS = require('crypto-js'); // npm install crypto-js
const moment = require('moment'); // npm install moment
const { createTicket, getCodeTicket } = require('../models/ticketModel');
const qs = require('qs');


const config = {
  app_id: "2554",
    key1: "sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn",
    key2: "trMrHtvjo6myautxDUiAcYsVtaeQ8nhf",
    endpoint: "https://sb-openapi.zalopay.vn/v2/create"
};

const convertTimeToISO = (timeString) =>{
    return `1970-01-01T${timeString}.000Z`;
}

const convertDateToISO = (dateString) => {
    return moment(dateString, "DD/MM/YYYY").format('YYYY-MM-DD');
}

exports.createOrderZalopay = async (req, res) => {
    const {app_user, description, masuat, makh, amount, maghe, giobatdau, gioketthuc, ngay, madichvu, tinhThanh, nameRoom, nameCinema, nameMovie, posterMovie} = req.body;
    const today = new Date();
    const ngaymua = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0') + " " + String(today.getHours()).padStart(2, '0') + ':' + String(today.getMinutes()).padStart(2, '0') + ':' + String(today.getSeconds()).padStart(2, '0') + '.' + String(today.getMilliseconds()).padStart(3, '0');


    const embed_data = {
        //redirecturl: `http://localhost:3000/ticket-booked?name=${app_user}&masuat=${masuat}&makh=${makh}&giave=${amount}&maghe=${maghe}&giobatdau=${convertTimeToISO(giobatdau)}&gioketthuc=${convertTimeToISO(gioketthuc)}&ngay=${convertDateToISO(ngay)}&madichvu=${madichvu}&tinhThanh=${tinhThanh}&nameRoom=${nameRoom}&nameCinema=${nameCinema}&nameMovie=${nameMovie}&posterMovie=${posterMovie}&ngaymua=${ngaymua}`,
        redirecturl: 'http://localhost:3000/account?section=tickets',
        merchantinfo: {
            masuat: masuat,
            makh: makh,
            giave: amount,
            maghe: maghe,
            giobatdau: giobatdau,
            gioketthuc: gioketthuc,
            ngay: ngay,
            madichvu: madichvu,
            tinhThanh: tinhThanh,
            ngaymua: ngaymua
        }
    };

    const items = [{}];
    const transID = Math.floor(Math.random() * 1000000);
    const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
        app_user: app_user, //"user123"
        app_time: Date.now(), // miliseconds
        expire_duration_seconds: 300, // 5 minutes
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: amount, //50000
        callback_url: "https://3f34-2402-800-6311-61e9-8d4-96b2-a089-724b.ngrok-free.app/api/zalopay/callback",
        description: description + transID, //`Lazada - Payment for the order #${transID}`
        bank_code: "",
    };
    const trans_id = order.app_trans_id;
    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data = config.app_id + "|" + order.app_trans_id + "|" + order.app_user + "|" + order.amount + "|" + order.app_time + "|" + order.embed_data + "|" + order.item;
    order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();
    
    try{
        console.log(embed_data);
        const result = await axios.post(config.endpoint, null, { params: order });
        return res.status(200).json(result.data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.callback = async (req, res) => {
    let result = {};

    try {
        let dataStr = req.body.data;
        let reqMac = req.body.mac;

        let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
        console.log("mac =", mac);


        // kiểm tra callback hợp lệ (đến từ ZaloPay server)
        if (reqMac !== mac) {
        // callback không hợp lệ
        result.return_code = -1;
        result.return_message = "mac not equal";
        }
        else {
        // thanh toán thành công
        // merchant cập nhật trạng thái cho đơn hàng
        let dataJson = JSON.parse(dataStr, config.key2);
        console.log("update order's status = success where app_trans_id =", dataJson["app_trans_id"]);

        const embedData = JSON.parse(dataJson.embed_data);
        const { masuat, makh, giave, maghe, giobatdau, gioketthuc, ngay, madichvu, tinhThanh, ngaymua } = embedData.merchantinfo;

        try {
            const savedTicket = await createTicket(masuat, makh, giave, maghe, convertTimeToISO(giobatdau), convertTimeToISO(gioketthuc), convertDateToISO(ngay), madichvu, ngaymua);
            console.log("saved ticket: ", savedTicket);
            
            // const ngaymuaFormat = ngaymua.split(".")[0];
            // const codeResult = await getCodeTicket(makh, ngaymuaFormat);
            // console.log("code ticket: ", codeResult);
            // codeTicket = codeResult[0].MAVE;
        } catch (error) {
            console.log("error: ", error);
        }
        
        result.return_code = 1;
        result.return_message = "success";
        }
    } catch (ex) {
        result.return_code = 0; // ZaloPay server sẽ callback lại (tối đa 3 lần)
        result.return_message = ex.message;
    }

    // thông báo kết quả cho ZaloPay server
    res.json(result);
};


exports.order_status = async (req, res) => {
    const app_trans_id = req.params.app_trans_id;
    let postData = {
        app_id: config.app_id,
        app_trans_id: app_trans_id, 
    }

    let data = postData.app_id + "|" + postData.app_trans_id + "|" + config.key1; // appid|app_trans_id|key1
    postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();


    let postConfig = {
        method: 'post',
        url: "https://sb-openapi.zalopay.vn/v2/query",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(postData)
    };

    try{
        const result = await axios(postConfig);
        console.log(result.data);
        return res.status(200).json(result.data);
    } catch (err) {
        console.log(err.message);
    }
};