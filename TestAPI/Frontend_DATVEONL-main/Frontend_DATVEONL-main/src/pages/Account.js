import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext
import TicketBooked from './TickedBookedTemp';
import { CheckTicketBooked, getPartTicketInfo, getSeatTicket } from '../services/api';

const Account = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { account, logout } = useContext(AuthContext); // Sử dụng context
  const [activeSection, setActiveSection] = useState('general'); // State để quản lý phần nội dung đang hiển thị
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!account) {
      navigate('/login');
    }
  }, [account, navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const section = queryParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [location.search]);

  const handleLogout = () => {
    logout(); // Gọi hàm logout từ context
    navigate('/login'); // Điều hướng đến trang đăng nhập
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const result = await CheckTicketBooked(account.MAKH);
        console.log('CheckTicketBooked:', result);
        if (result.length === 0) {
          setTickets([]);
        } else {
          const maveArray = result.map(ticket => ticket.MAVE);
          const ticketDetails = await Promise.all(maveArray.map(async (mave) => {
            const partTicketInfo = await getPartTicketInfo(account.MAKH, mave);
            console.log('getPartTicketInfo result for', mave, ':', partTicketInfo);
            const seatTicket = await getSeatTicket(mave);
            console.log('getSeatTicket result for', mave, ':', seatTicket); // Log kết quả từ getSeatTicket

            // Chuyển đổi dữ liệu từ partTicketInfo thành các biến riêng lẻ
            const {
              NGAYCHIEU: ngaychieu,
              TENPHONG: tenphong,
              TENPHIM: tenphim,
              POSTER: poster,
              TENKH: tenkh,
              GIOBATDAU: giobatdau,
              GIOKETTHUC: gioketthuc,
              GIAVE: giave,
              TENRAP: tenrap,
              TINHTHANH: tinhThanh
            } = partTicketInfo[0];

            // Hợp nhất các thuộc tính từ partTicketInfo và seatTicket
            const ticketProps = {
              ngaychieu,
              tenphong,
              tenphim,
              poster,
              tenkh,
              giobatdau,
              gioketthuc,
              giave,
              tenrap,
              tinhThanh,
              maghe: seatTicket.map(seat => seat.MAGHE).join(', '), // Hợp nhất các mã ghế thành một chuỗi
              mave
            };
            console.log('ticketProps:', ticketProps); // Log các props sẽ truyền xuống TickedBookedTemp.js
            return ticketProps;
          }));
          setTickets(ticketDetails);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    if (activeSection === 'tickets') {
      fetchTickets();
    }
  }, [activeSection, account.MAKH]);

  if (!account) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 flex">
      <div className="w-1/4 p-4">
        <ul className="space-y-2">
          <li
            className={`text-center p-2 cursor-pointer ${activeSection === 'general' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveSection('general')}
          >
            Thông tin chung
          </li>
          <li
            className={`text-center p-2 cursor-pointer ${activeSection === 'account' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveSection('account')}
          >
            Thông tin tài khoản
          </li>
          <li
            className={`text-center p-2 cursor-pointer ${activeSection === 'history' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveSection('history')}
          >
            Lịch sử giao dịch
          </li>
          <li
            className={`text-center p-2 cursor-pointer ${activeSection === 'tickets' ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveSection('tickets')}
          >
            Vé đã đặt
          </li>
        </ul>
      </div>
      <div className="w-full py-4">
        {activeSection === 'general' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Thông tin chung</h1>
            <p>Chào mừng bạn đến với trang thông tin tài khoản của bạn.</p>
            <div className="flex justify-center mt-10">
              <button className='bg-red-500 text-white p-3 rounded-lg' onClick={handleLogout}>Đăng xuất</button>
            </div>
          </div>
        )}
        {activeSection === 'account' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Thông tin tài khoản</h1>
            <p><strong>Email:</strong> {account.EMAIL}</p>
            <p><strong>Tên:</strong> {account.TENKH}</p>
            <p><strong>Số điện thoại:</strong> {account.SDT}</p>
            <p><strong>Mã khách hàng:</strong> {account.MAKH}</p>
          </div>
        )}
        {activeSection === 'history' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Lịch sử giao dịch</h1>
            <p>Hiển thị lịch sử giao dịch của bạn ở đây.</p>
          </div>
        )}
        {activeSection === 'tickets' && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Vé đã đặt</h1>
            {loading ? (
              <div>Loading...</div>
            ) : tickets.length === 0 ? (
              <div>Hiện chưa có vé nào được đặt</div>
            ) : (
              <div>
                {tickets.map((ticket, index) => (
                  <TicketBooked key={index} {...ticket} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;