import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSchedule, getMaPhongChieu, getNameRoom, getCountChair, getCodeSchedule } from '../services/api';

const BookingModal = ({ isOpen, onClose, movieTitle }) => {
  const navigate = useNavigate();

  const [schedule, setSchedule] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState('');
  const [times, setTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [poster, setPoster] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await getSchedule(movieTitle);
        setSchedule(data.showtimes);
        setPoster(data.POSTER);

        // Lấy danh sách ngày chiếu
        const uniqueDates = [...new Set(data.showtimes.map(item => item.NGAYCHIEU))];
        setDates(uniqueDates);

      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    if (isOpen) {
      fetchSchedule();
    }
  }, [isOpen, movieTitle]);

  useEffect(() => {
    // Khi selectedDate thay đổi, cập nhật danh sách thành phố
    const filteredData = schedule.filter(item => item.NGAYCHIEU === selectedDate);
    const uniqueCities = [...new Set(filteredData.map(item => item.TINHTHANH))];
    setCities(uniqueCities);
    setSelectedCity('');
    setSelectedCinema('');
    setSelectedTime('');
    setCinemas([]);
    setTimes([]);
  }, [selectedDate, schedule]);

  useEffect(() => {
    // Khi selectedCity thay đổi, cập nhật danh sách rạp
    const filteredData = schedule.filter(item => item.NGAYCHIEU === selectedDate && item.TINHTHANH === selectedCity);
    const rapLists = filteredData.flatMap(item => item.rapList);
    const uniqueCinemas = [...new Set(rapLists.map(rap => rap.TENRAP))];
    setCinemas(uniqueCinemas);
    setSelectedCinema('');
    setSelectedTime('');
    setTimes([]);
  }, [selectedCity, selectedDate, schedule]);

  useEffect(() => {
    // Khi selectedCinema thay đổi, cập nhật danh sách thời gian chiếu
    const filteredData = schedule.filter(item => item.NGAYCHIEU === selectedDate && item.TINHTHANH === selectedCity);
    const rapLists = filteredData.flatMap(item => item.rapList);
    const selectedRap = rapLists.find(rap => rap.TENRAP === selectedCinema);
    if (selectedRap) {
      const timesList = selectedRap.suatChieu.map(suat => suat.GIOBATDAU);
      setTimes(timesList);
    } else {
      setTimes([]);
    }
    setSelectedTime('');
  }, [selectedCinema, selectedCity, selectedDate, schedule]);

  const handleSubmit = async () => {
    onClose();

    const maphongResult = await getMaPhongChieu(movieTitle, selectedDate, selectedCity, selectedCinema, selectedTime);
    const maphong = maphongResult[0]?.MAPHONG || 'Không tìm thấy mã phòng';
    const codescheduleResult = await getCodeSchedule(movieTitle, selectedDate, selectedCity, selectedCinema, selectedTime);
    const codeschedule = codescheduleResult[0]?.MASUAT || 'Không tìm thấy mã lịch chiếu';
    const tenPhongResult = await getNameRoom(movieTitle, selectedDate, selectedCity, selectedCinema, selectedTime);
    const tenPhong = tenPhongResult[0]?.TENPHONG || 'Không tìm thấy tên phòng';
    try {
      const soLuongGheResult = await getCountChair(maphong);
      const soLuongGhe = soLuongGheResult[0]?.[''] || 'Không tìm thấy số lượng ghế';

      if (maphong) {
        const selectedShow = schedule.find(item => 
          item.NGAYCHIEU === selectedDate && 
          item.TINHTHANH === selectedCity &&
          item.rapList.some(rap => rap.TENRAP === selectedCinema && rap.suatChieu.some(suat => suat.GIOBATDAU === selectedTime))
        );
        const selectedRap = selectedShow.rapList.find(rap => rap.TENRAP === selectedCinema);
        const selectedSuat = selectedRap.suatChieu.find(suat => suat.GIOBATDAU === selectedTime);
        const gioKetThuc = selectedSuat.GIOKETTHUC;

        //tenphim, poster, rap, tenphong, maphong, codeschedule, soluongghe, giodatve, gioKetThuc, ngaychieu, tinhthanh

        navigate('/choose-chart', { 
          state: { 
            movieTitle,
            poster,
            selectedCinema,
            tenPhong,
            maphong,
            codeschedule,
            soLuongGhe,
            selectedTime,
            gioKetThuc,
            selectedDate,
            selectedCity
          } 
        });
      } else {
        alert('Không tìm thấy mã phòng chiếu.');
      }
    } catch (error) {
      console.error('Error getting maphong:', error);
      alert('Error getting maphong:', error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-11/12 lg:w-4/5 xl:w-3/5 p-4 md:p-6 relative max-h-[90%] overflow-y-auto">
          <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>X</button>

          {/* Ngày chiếu */}
          <div className="flex justify-between overflow-x-auto py-2 md:py-2">
            {dates.map((date, index) => (
              <button
                key={index}
                className={`mx-1 md:mx-2 px-3 py-2 md:px-4 md:py-2 border rounded-lg whitespace-nowrap ${selectedDate === date ? 'bg-black text-white' : 'bg-gray-200'}`}
                onClick={() => setSelectedDate(date)}
              >
                {date}
              </button>
            ))}
          </div>

          {/* Thành phố */}
          {selectedDate && (
            <div className="flex overflow-x-auto py-2 md:py-4">
              {cities.map((city, index) => (
                <button
                  key={index}
                  className={`mx-1 md:mx-2 px-2 py-1 md:px-3 md:py-2 border rounded-lg whitespace-nowrap ${selectedCity === city ? 'bg-black text-white' : 'bg-gray-200'}`}
                  onClick={() => setSelectedCity(city)}
                >
                  {city}
                </button>
              ))}
            </div>
          )}

          {/* Danh sách rạp */}
          {selectedCity && (
            <div className="flex flex-wrap justify-center py-2 md:py-3">
              {cinemas.map((cinema, index) => (
                <button
                  key={index}
                  className={`m-1 md:m-2 px-2 py-1 md:px-3 md:py-2 border rounded-lg ${selectedCinema === cinema ? 'bg-black text-white' : 'bg-gray-200'}`}
                  onClick={() => setSelectedCinema(cinema)}
                >
                  {cinema}
                </button>
              ))}
            </div>
          )}

          {/* Thời gian chiếu */}
          {selectedCinema && (
            <div className="flex flex-wrap justify-center py-2 md:py-3">
              {times.map((time, index) => (
                <button
                  key={index}
                  className={`m-1 md:m-2 px-2 py-1 md:px-3 md:py-2 border rounded-lg ${selectedTime === time ? 'bg-black text-white' : 'bg-gray-200'}`}
                  onClick={() => setSelectedTime(time)}
                >
                  {time.substring(11, 16)} {/* Hiển thị giờ và phút */}
                </button>
              ))}
            </div>
          )}

          <button
            disabled={!selectedDate || !selectedCity || !selectedCinema || !selectedTime}
            onClick={handleSubmit}
            className={`mt-4 px-4 py-2 rounded-md text-white ${!selectedDate || !selectedCity || !selectedCinema || !selectedTime ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500'}`}
          >
            Tiếp theo
          </button>
        </div>
      </div>
    )
  );
};

export default BookingModal;