import {useEffect, useState} from 'react';
import '../assets/styles/ticketfinal.css';
import { useLocation } from 'react-router-dom';
import moment from 'moment';
import { getCodeTicket } from '../services/api';

const TicketBooked = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const ngaymua = query.get('ngaymua');
  const app_user = query.get('name');
  // const masuat = query.get('masuat');
  const makh = query.get('makh');
  const giave = query.get('giave');
  const maghe = query.get('maghe');
  const giobatdau = query.get('giobatdau');
  const gioketthuc = query.get('gioketthuc');
  const ngay = query.get('ngay');
  // const madichvu = query.get('madichvu');
  const tinhThanh = query.get('tinhThanh');
  const nameRoom = query.get('nameRoom');
  const nameCinema = query.get('nameCinema');
  const nameMovie = query.get('nameMovie');
  const posterMovie = query.get('posterMovie');

  const [mave, setMave] = useState('');

  useEffect(() => {
    const fetchCodeTicket = async () => {
      try {
        const ngaymuaFormat = ngaymua.split(".")[0];
        const codeResult = await getCodeTicket(makh, ngaymuaFormat);
        setMave(codeResult[0].MAVE);
      } catch (error) {
        console.error('Error fetching code ticket:', error);
      }
    };

    fetchCodeTicket();
  }, [makh, ngaymua]);

  const formatTime = (timeString) => {
    return moment.utc(timeString).format('HH:mm:ss');
  };

  // Chuyển đổi định dạng ngay
  const formatDate = (dateString) => {
    return moment(dateString).format('DD/MM/YYYY');
  };

  // Bỏ 11 ký tự đầu của maghe
  const formatSeat = (seatString) => {
    return seatString.substring(11);
  };

  const formatRoom = (roomString) => {
    return roomString.substring(5);
  }

  const magheArray = maghe.split(', ');

  return (
    <div className='w-4/5 mx-auto my-10'>
      <h1 className='font-semibold text-5xl text-center text-red-400 mb-10'>Detail Ticket</h1>
      <div className="ticket created-by-anniedotexe border-dashed">
        <div className="left">
          <div className="left w-2/4">
            <img src={posterMovie} alt="Movie Poster" />
            <p className="admit-one">
              <span className="my-3" >Ticket</span>
              <span className="my-3" >Ticket</span>
              <span className="my-3" >Ticket</span>
            </p>
          </div>
          <div className="ticket-info">
            <p className="date">
              <span>{formatDate(ngay)}</span>
              <span>{formatRoom(nameRoom)}</span>
              {/* <span>Ghế <span>{formatSeat(maghe)}</span></span> */}
            </p>
            <div className="time">
              <p className='text-3xl m-5'>{nameMovie}</p>
              <p className='text-xl'>{app_user}</p>
              <p>Bắt đầu <span>{formatTime(giobatdau)}</span> Kết thúc <span>{formatTime(gioketthuc)}</span></p>
              <p>MAVE: <span>{mave}</span> Tổng tiền: <span>{parseFloat(giave).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></p>
              <p>Ghế: {magheArray.map((ghe, index) => (
                <span key={index}>{formatSeat(ghe)}{index < magheArray.length - 1 ? ', ' : ''}</span>
              ))}</p>
            </div>
            <p className="location">
              <span>{nameCinema}</span>
              <span className="separator"><i className="far fa-smile"></i></span>
              <span>{tinhThanh}</span>
            </p>
          </div>
        </div>
        <div className="left right">
          <div className="left">
            <p className="admit-one">
              <span className="my-3" >Ticket</span>
              <span className="my-3" >Ticket</span>
              <span className="my-3" >Ticket</span>
            </p>
          </div>
          <div className="right-info-container flex flex-col items-center justify-center">
            <div className="show-name">
              <p className='text-sm text-center text-gray-700'>Vui lòng quét QR này tại quầy để check in</p>
            </div>
            <div className="barcode">
              <img src="https://external-preview.redd.it/cg8k976AV52mDvDb5jDVJABPrSZ3tpi1aXhPjgcDTbw.png?auto=webp&s=1c205ba303c1fa0370b813ea83b9e1bddb7215eb" alt="QR code" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketBooked;