import React, { useState, useEffect, useContext } from 'react';
import '../assets/styles/chooseChart.css';
import manhinhImage from '../assets/images/manhinh.png'; // Hình ảnh màn hình
import { useLocation } from 'react-router-dom';
import { getAllChairs, getService, createTicket, getSeatBooked } from '../services/api'; // Import hàm API
import { AuthContext } from '../context/AuthContext'; // Import AuthContext


const ChooseChart = () => {
  const location = useLocation();
  const { movieTitle, poster, selectedCinema, maphong, codeschedule, tenPhong, soLuongGhe, selectedTime, gioKetThuc, selectedDate, selectedCity } = location.state || {};

  const { account } = useContext(AuthContext); // Sử dụng context để lấy thông tin tài khoản

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showService, setShowService] = useState(false); // State để quản lý việc hiển thị phần dịch vụ
  const [showPayMethod, setShowPayMethod] = useState(false); // State để quản lý việc hiển thị modal thanh toán
  const [services, setServices] = useState([]); // State để lưu trữ danh sách dịch vụ
  const [serviceQuantities, setServiceQuantities] = useState({}); // State để lưu trữ số lượng dịch vụ
  const [bookedSeats, setBookedSeats] = useState([]);

  const handleSeatClick = (seatId) => {
    setSelectedSeats(prevSelectedSeats =>
      prevSelectedSeats.includes(seatId)
        ? prevSelectedSeats.filter(id => id !== seatId) // Bỏ chọn ghế
        : [...prevSelectedSeats, seatId] // Chọn ghế
    );
  };

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const data = await getAllChairs(maphong);
        setSeats(data);
      } catch (error) {
        console.error('Error fetching seats:', error);
      }
    };

    if (maphong) {
      fetchSeats();
    } else {
      console.error('Không có mã phòng ()');
    }
  }, [maphong]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getService();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    if (showService) {
      fetchServices();
    }
  }, [showService]);

  const getSeatStyle = (type) => {
    switch (type) {
      case 'Ghế thường':
        return 'border-green-500'; // Ghế thường với viền xanh lá
      case 'Ghế VIP':
        return 'border-yellow-500'; // Ghế VIP với viền vàng
      case 'Ghế Đôi':
        return 'border-pink-500 flex space-x-1'; // Ghế đôi với viền hồng và xếp ngang
      default:
        return '';
    }
  };

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const seat = seats.find(s => s.MAGHE === seatId);
    return total + (seat ? seat.GIAGHE : 0);
  }, 0) + services.reduce((total, service) => {
    const quantity = serviceQuantities[service.MADICHVU] || 0;
    return total + (service.GIA * quantity);
  }, 0);

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toISOString().split('T')[1].slice(0, 8); // Lấy giờ và phút
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN'); // Định dạng ngày theo định dạng Việt Nam
  };

  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const bookedSeatsData = await getSeatBooked(formatTime(selectedTime), formatTime(gioKetThuc), selectedDate, maphong);
        setBookedSeats(bookedSeatsData.map(seat => seat.MAGHE));
      } catch (error) {
        console.error('Error fetching booked seats:', error);
      }
    };

    fetchBookedSeats();
  }, [formatTime(selectedTime), formatTime(gioKetThuc), selectedDate, maphong]);

  const handleNextClick = () => {
    if (showService) {
      setShowPayMethod(true);
    } else {
      setShowService(true);
    }
  };

  const handleBackClick = () => {
    if (showPayMethod) {
      setShowPayMethod(false);
    } else {
      setShowService(false);
    }
  };

  const handlePaymentClick = async () => {
    try {
      //const today = new Date();
      const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').id;
      if (paymentMethod === 'zalopay') {
        const app_user = account.TENKH; // Lấy tên người dùng từ context
        const description = `Thanh toán cho phim ${movieTitle} tại rạp ${selectedCinema} với số hóa đơn: `;
        const masuat = codeschedule;
        const tinhThanh = selectedCity;
        const makh = account.MAKH; // Lấy mã khách hàng từ context
        const amount = totalPrice;
        const maghe = selectedSeats.join(', ');
        const giobatdau = formatTime(selectedTime);
        const gioketthuc = formatTime(gioKetThuc);
        const ngay = formatDate(selectedDate);
        const madichvu = Object.entries(serviceQuantities).filter
        (([serviceId, quantity]) => quantity > 0).map(([serviceId, quantity]) => ({ madv: serviceId, soluong: quantity }));
        const nameRoom = tenPhong;
        const nameCinema = selectedCinema;
        const nameMovie = movieTitle;
        //const ngaymua = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0') + " " + String(today.getHours()).padStart(2, '0') + ':' + String(today.getMinutes()).padStart(2, '0') + ':' + String(today.getSeconds()).padStart(2, '0') + '.' + String(today.getMilliseconds()).padStart(3, '0');
        const posterMovie = poster

        const response = await createTicket(app_user, description, masuat, makh, amount, maghe, giobatdau, gioketthuc, ngay, JSON.stringify(madichvu), tinhThanh, nameRoom, nameCinema, nameMovie, posterMovie);
        console.log('Response:', response);
        window.location.href = response.order_url;
      } else {
        alert('Vui lòng chọn phương thức thanh toán Zalopay.');
      }
    } catch (error) {
      console.error('Error during payment:', error);
      alert('Error during payment:', error);
    }
  };

  const handleIncreaseQuantity = (serviceId) => {
    setServiceQuantities(prevQuantities => ({
      ...prevQuantities,
      [serviceId]: (prevQuantities[serviceId] || 0) + 1
    }));
  };

  const handleDecreaseQuantity = (serviceId) => {
    setServiceQuantities(prevQuantities => ({
      ...prevQuantities,
      [serviceId]: Math.max((prevQuantities[serviceId] || 0) - 1, 0)
    }));
  };

  return (
    <div className="grid grid-cols-10 gap-4 my-10 mx-4">
      {/* Phần bên trái (7 cột) */}
      <div className="col-span-7 p-4 border border-gray-300 rounded-lg flex flex-col items-center justify-center">
        <hr className="my-10 w-4/5 border-b-8" />
        <div className="mb-4 w-4/5">
          <h1 className="text-2xl text-center font-bold mb-4">BOOKING ONLINE</h1>
          <div className="flex flex-wrap justify-between mb-2">
            <div className="w-1/2">
              <strong>Tên Rạp: </strong> {selectedCinema}
            </div>
            <div className="w-1/3">
              <strong>Tên Phòng: </strong> {tenPhong}
            </div>
            <div className="w-1/2">
              <strong>Số Ghế: </strong> {soLuongGhe}
            </div>
            <div className="w-1/3">
              <strong>Giờ Bắt Đầu: </strong> {formatTime(selectedTime)}
            </div>
            <div className="w-1/3">
              <strong>Giờ Kết Thúc: </strong> {formatTime(gioKetThuc)}
            </div>
            <div className="w-1/3">
              <strong>Ngày: </strong> {formatDate(selectedDate)}
            </div>
          </div>
        </div>

        <hr className="my-10 w-4/5 border-b-8" />

        {!showService && !showPayMethod && (
          <div className="mb-4 flex justify-center w-4/5">
            <div className='w-3/4'>
              <img src={manhinhImage} alt="Màn hình" className="w-full mb-10 mx-auto" />
              <div className="grid grid-cols-10 gap-2 mb-4">
                {/* Ghế Thường và VIP */}
                {seats.filter(seat => seat.TENLOAIGHE !== 'Ghế Đôi').map((seat) => (
                  <div
                    key={seat.MAGHE}
                    onClick={() => !bookedSeats.includes(seat.MAGHE) && handleSeatClick(seat.MAGHE)}
                    className={`cursor-pointer border-2 ${getSeatStyle(seat.TENLOAIGHE)} ${selectedSeats.includes(seat.MAGHE) ? 'bg-red-500 text-white' : bookedSeats.includes(seat.MAGHE) ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-white'}`}
                    style={{
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span className="text-xs font-semibold">{seat.MAGHE.substring(11)}</span>
                  </div>
                ))}
              </div>

              {/* Ghế Đôi */}
              <div className="grid grid-cols-5 gap-2">
                {seats.filter(seat => seat.TENLOAIGHE === 'Ghế Đôi').map((seat) => (
                  <div
                    key={seat.MAGHE}
                    onClick={() => !bookedSeats.includes(seat.MAGHE) && handleSeatClick(seat.MAGHE)}
                    className={`cursor-pointer border-2 ${getSeatStyle(seat.TENLOAIGHE)} ${selectedSeats.includes(seat.MAGHE) ? 'bg-red-500 text-white' : bookedSeats.includes(seat.MAGHE) ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-white'}`}
                    style={{
                      width: '80px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span className="text-xs font-semibold">{seat.MAGHE.substring(11)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <h3 className="text-lg mb-4">Tổng tiền: {totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</h3>
              </div>
            </div>
          </div>
        )}

        {showService && !showPayMethod && (
          <div className="mb-4 flex justify-center w-full">
            <div className='w-full'>
              <h2 className="text-xl font-bold mb-4">Chọn Dịch Vụ</h2>
              <div className="grid grid-cols-2 gap-4">
                {services.map((service) => (
                  <div key={service.MADICHVU} className="border p-4 rounded-lg flex ">
                    <img src={service.POSTER} alt={service.TENDICHVU} className="w-1/3 h-auto object-cover rounded-lg mr-4" />
                    <div className="w-2/3">
                      <h3 className="text-lg font-semibold">{service.TENDICHVU}</h3>
                      <p className='text-xs'>{service.MOTA}</p>
                      <p>Giá: {service.GIA.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                      <div className="flex items-center mt-2">
                        <button className="bg-gray-300 px-2 py-1 rounded-l" onClick={() => handleDecreaseQuantity(service.MADICHVU)}>-</button>
                        <span className="px-4">{serviceQuantities[service.MADICHVU] || 0}</span>
                        <button className="bg-gray-300 px-2 py-1 rounded-r" onClick={() => handleIncreaseQuantity(service.MADICHVU)}>+</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {showPayMethod && (
          <div className="mt-16 flex flex-col items-center justify-center">
            <h1 className="text-2xl text-center text-red-500 font-bold mb-4">Vui lòng chọn phương thức thanh toán</h1>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Phương thức thanh toán</h2>
              <div className=" gap-4 sm:grid-cols-2 mt-4">
                <div className="flex items-center mb-4">
                  <input type="radio" name="paymentMethod" className="w-5 h-5 cursor-pointer" id="vnpay" checked />
                  <label htmlFor="card" className="ml-4 mr-4 flex gap-2 cursor-pointer">
                    <img src="https://i.gyazo.com/4914b35ab9381a3b5a1e7e998ee9550c.png" className="w-10" alt="card1" />
                  </label>
                  <label className='text-lg font-bold text-gray-800'>Ví điện tử VNPAY</label>
                </div>
                <div className="flex items-center mb-4">
                  <input type="radio" name="paymentMethod" className="w-5 h-5 cursor-pointer" id="zalopay" />
                  <label htmlFor="paypal" className="ml-4 mr-4 flex gap-2 cursor-pointer">
                    <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay.png" className="w-10" alt="paypalCard" />
                  </label>
                  <label className='text-lg font-bold text-gray-800'>Ví điện tử Zalopay</label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Phần bên phải (3 cột) */}
      <div className="col-span-3 p-4 border border-gray-300 rounded-lg">
        <div className="mb-4">
          <img src={poster} alt="Hình Phim" className="w-full h-auto object-cover rounded-lg mb-4" />
        </div>
        <div className="mb-4">
          <strong>Tên Phim: </strong> {movieTitle}
        </div>
        <div className="mb-4">
          <strong>Tên Rạp: </strong> {selectedCinema}
        </div>
        <div className="mb-4">
          <strong>Giờ Chiếu: </strong> {formatTime(selectedTime)}
        </div>
        <div className="mb-4">
          <strong>Ngày Chiếu: </strong> {formatDate(selectedDate)}
        </div>
        <div className="mb-4">
          <strong>Ghế: </strong> {selectedSeats.map(seatId => seats.find(seat => seat.MAGHE === seatId)?.MAGHE.substring(11)).join(', ')}
        </div>
        <div className="mb-4">
          <strong>Dịch Vụ: </strong> {Object.entries(serviceQuantities).filter(([serviceId, quantity]) => quantity > 0).map(([serviceId, quantity]) => serviceId).join(', ')}
        </div>
        <div className="mb-4">
          <strong>Tổng Tiền: </strong> {totalPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </div>
        {!showPayMethod ? (
          <>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full" onClick={handleNextClick}>
              Tiếp theo
            </button>
            {(showService || showPayMethod) && (
              <button className="bg-gray-300 mt-2 text-white px-4 py-2 rounded-lg hover:bg-gray-400 w-full" onClick={handleBackClick}>
                Quay lại
              </button>
            )}
          </>
        ) : (
          <>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 w-full" onClick={handlePaymentClick}>
              Thanh toán
            </button>
            <button className="bg-gray-300 mt-2 text-white px-4 py-2 rounded-lg hover:bg-gray-400 w-full" onClick={handleBackClick}>
              Quay lại
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ChooseChart;