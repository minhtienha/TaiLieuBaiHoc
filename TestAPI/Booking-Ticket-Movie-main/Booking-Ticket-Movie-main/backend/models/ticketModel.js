const { Date } = require('mssql');
const { sql } = require('../config/db'); // Import kết nối SQL từ db.js
const moment = require('moment'); // Import thư viện moment để xử lý thời gian

const createTicket = async (masuat, makh, giave, maghe, giobatdau, gioketthuc, ngay, madichvu, ngaymua) => {
    const ngaymuaFormatted = moment(ngaymua).add(7, 'hours').format('YYYY-MM-DD HH:mm:ss.SSS');
    console.log('Ngày mua:', ngaymuaFormatted);
    try {
        // Thực hiện chèn vào bảng VE và lấy mã vé (MAVE)
        let mave;
        const queryInsertVE = `
            SET DATEFORMAT DMY;
            INSERT INTO VE (MASUAT, MAKH, NGAYMUA, GIAVE) 
            VALUES (@MASUAT, @MAKH, @NGAYMUA, @GIAVE);
            
            SELECT MAVE FROM VE 
            WHERE MASUAT = @MASUAT AND MAKH = @MAKH 
              AND NGAYMUA = @NGAYMUA AND GIAVE = @GIAVE;
        `;

        const request1 = new sql.Request();
        const result = await request1
            .input('MASUAT', sql.NVarChar, masuat)
            .input('MAKH', sql.NVarChar, makh)
            .input('GIAVE', sql.Int, giave)
            .input('NGAYMUA', sql.DateTime, ngaymuaFormatted)
            .query(queryInsertVE);

        mave = result.recordset[0]?.MAVE;
        if (!mave) throw new Error("Không tìm thấy mã vé sau khi chèn.");

        console.log("Mã vé:", mave);
        console.log("ngày:", ngay);

        // Tách các mã ghế thành một mảng
        const magheArray = maghe.split(', ');

        // Thực hiện chèn từng mã ghế vào bảng CHITIETGHE
        for (const ghe of magheArray) {
            const request2 = new sql.Request();
            await request2
                .input('MAGHE', sql.NVarChar, ghe)
                .input('MAVE', sql.NVarChar, mave)
                .input('GIOBATDAU', sql.Time, giobatdau)
                .input('GIOKETTHUC', sql.Time, gioketthuc)
                .input('NGAYCHIEU', sql.Date, ngay)
                .query(`
                    INSERT INTO CHITIETGHE (MAGHE, MAVE, TRANGTHAI, GIOBATDAU, GIOKETTHUC, NGAY) 
                    VALUES (@MAGHE, @MAVE, N'Đã đặt', @GIOBATDAU, @GIOKETTHUC, @NGAYCHIEU);
                `);
        }

        // Nếu có nhiều mã dịch vụ, tách chúng và chèn từng mã vào CHITIETDICHVU
        if (madichvu) {
            let madichvuArray;
            try {
                madichvuArray = JSON.parse(madichvu); // Chuyển đổi chuỗi JSON thành mảng đối tượng
                madichvuArrayFinal = JSON.parse(madichvuArray);
            } catch (error) {
                throw new Error("Invalid JSON format for madichvu");
            }

            for (const dichvu of madichvuArrayFinal) {
                const request3 = new sql.Request();
                await request3
                    .input('MAVE', sql.NVarChar, mave)
                    .input('MADICHVU', sql.NVarChar, dichvu.madv) // Loại bỏ khoảng trắng dư thừa nếu có
                    .input('SOLUONG', sql.Int, dichvu.soluong)
                    .query(`
                        INSERT INTO CHITIETDICHVU (MAVE, MADICHVU, SOLUONG) 
                        VALUES (@MAVE, @MADICHVU, @SOLUONG);
                    `);
            }
        }

        return { success: true, message: "Tạo vé thành công" };
    } catch (error) {
        console.error("Lỗi khi tạo vé:", error.message);
        throw new Error("Error creating ticket: " + error.message);
    }
};


const getNameCustumer = async (makh) => {
    try {
        const request = new sql.Request();
        const result = await request
            .input('MAKH', sql.NVarChar, makh)
            .query('SELECT TENKH FROM KHACHHANG WHERE MAKH=@MAKH');
        return result.recordset;
    } catch (error) {
        throw new Error('Error getting name customer: ' + error.message);
    }
};

const getCodeTicket = async (makh, ngaymua) => {
    try {
        console.log('MAKH:', makh); // Thêm log để kiểm tra giá trị makh
        console.log('NGAYMUA:', ngaymua); // Thêm log để kiểm tra giá trị ngaymua
        const request = new sql.Request();
        const result = await request
            .input('MAKH', sql.VarChar, makh)
            .input('NGAYMUA', sql.VarChar, ngaymua)
            .query('SELECT MAVE FROM VE WHERE MAKH = @MAKH AND CONVERT(VARCHAR, NGAYMUA, 120) = @NGAYMUA');
        return result.recordset;
    } catch (err) {
        throw new Error('Error getting code ticket: ' + err.message);
    }
};

const CheckTicketBooked = async (makh) => {
    try {
        const request = new sql.Request();
        const result = await request
            .input('MAKH', sql.NVarChar, makh)
            .query('SELECT MAVE FROM VE WHERE MAKH = @MAKH');
        return result.recordset;
    } catch (error) {
        throw new Error('Error checking ticket booked: ' + error.message);
    }
}

// Lấy ra mã vé, mã suất, giờ bắt đầu, giờ kết thúc của xuất đó
const getPartTicketInfo = async (makh, mave) => {
    try {
        const request = new sql.Request();
        const result = await request
            .input('MAKH', sql.NVarChar, makh)
            .input('MAVE', sql.NVarChar, mave)
            .query(`
                DECLARE @mavetemp VARCHAR(255), @masuattemp VARCHAR(255), @giobatdautemp time, @gioketthuc time
                SELECT @mavetemp = VE.MAVE, @masuattemp = MASUAT, @giobatdautemp = GIOBATDAU, @gioketthuc = GIOKETTHUC FROM VE JOIN CHITIETGHE ON VE.MAVE=CHITIETGHE.MAVE
                GROUP BY VE.MAVE, MASUAT, GIOBATDAU, GIOKETTHUC, MAKH
                HAVING MAKH = @MAKH AND VE.MAVE = @MAVE
                print @mavetemp + @masuattemp
                select VE.MAVE, NGAYCHIEU, TENPHONG, TENPHIM, POSTER, TENKH, GIOBATDAU, GIOKETTHUC, GIAVE, TENRAP, TINHTHANH
                from VE join CHITIETSUAT on ve.MASUAT= CHITIETSUAT.MASUAT
                join SUATCHIEU on CHITIETSUAT.MASUAT = SUATCHIEU.MASUAT join PHIM on CHITIETSUAT.MAPHIM=PHIM.MAPHIM join PHONGCHIEU on SUATCHIEU.MAPHONG=PHONGCHIEU.MAPHONG
                join RAP on PHONGCHIEU.MARAP=RAP.MARAP join KHACHHANG on VE.MAKH=KHACHHANG.MAKH
                WHERE ve.MAKH = @MAKH
                AND CHITIETSUAT.MASUAT=@masuattemp AND GIOBATDAU=@giobatdautemp AND GIOKETTHUC=@gioketthuc
            `);
        return result.recordset;
    } catch (error) {
        throw new Error('Error getting ticket info: ' + error.message);
    }
}

// Lấy ra ghế của vé
const getSeatTicket = async (mave) => {
    try {
        const request = new sql.Request();
        const result = await request
            .input('MAVE', sql.NVarChar, mave)
            .query('SELECT MAGHE FROM CHITIETGHE WHERE MAVE = @MAVE');
        return result.recordset;
    } catch (error) {
        throw new Error('Error getting seat ticket: ' + error.message);
    }
}

module.exports = {
  createTicket,
  getNameCustumer,
  getCodeTicket,
  CheckTicketBooked,
  getPartTicketInfo,
  getSeatTicket
};