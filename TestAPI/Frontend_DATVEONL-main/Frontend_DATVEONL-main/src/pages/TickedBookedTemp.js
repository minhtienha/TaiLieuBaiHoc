import React from 'react';
import '../assets/styles/ticketfinal.css';
import moment from 'moment';

const TicketBooked = ({
  tenkh,
  giave,
  maghe,
  giobatdau,
  gioketthuc,
  ngaychieu,
  tinhThanh,
  tenphong,
  tenrap,
  tenphim,
  poster,
  mave
}) => 
  {
  const formatTime = (timeString) => {
    return moment.utc(timeString).format('HH:mm:ss');
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('DD/MM/YYYY');
  };

  const formatSeat = (seatString) => {
    return seatString ? seatString.substring(11) : '';
  };

  const formatRoom = (roomString) => {
    return roomString ? roomString.substring(5) : '';
  };

  const magheArray = maghe ? maghe.split(', ') : [];
  console.log('posterMovie:', poster);
  console.log('app_user:', tenkh);
  console.log('giave:', giave);
  console.log('maghe:', magheArray);
  console.log('giobatdau:', giobatdau);
  console.log('gioketthuc:', gioketthuc);
  console.log('ngay:', ngaychieu);
  console.log('tinhThanh:', tinhThanh);
  console.log('nameRoom:', tenphong);
  console.log('nameCinema:', tenrap);
  console.log('nameMovie:', tenphim);
  console.log('mave:', mave);

  return (
    <div className='w-full mx-auto my-10'>
      <div className="ticket created-by-anniedotexe border-dashed">
        <div className="left">
          <div className="left w-2/4">
            <img src={poster} alt="Movie Poster" />
            <p className="admit-one">
              <span className="my-3" >Ticket</span>
              <span className="my-3" >Ticket</span>
              <span className="my-3" >Ticket</span>
            </p>
          </div>
          <div className="ticket-info">
            <p className="date">
              <span>{formatDate(ngaychieu)}</span>
              <span>{formatRoom(tenphong)}</span>
            </p>
            <div className="time">
              <p className='text-3xl m-5'>{tenphim}</p>
              <p className='text-xl'>{tenkh}</p>
              <p>Bắt đầu <span>{formatTime(giobatdau)}</span> Kết thúc <span>{formatTime(gioketthuc)}</span></p>
              <p>MAVE: <span>{mave}</span> Tổng tiền: <span>{parseFloat(giave).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></p>
              <p>Ghế: {magheArray.map((ghe, index) => (
                <span key={index}>{formatSeat(ghe)}{index < magheArray.length - 1 ? ', ' : ''}</span>
              ))}</p>
            </div>
            <p className="location">
              <span>{tenrap}</span>
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