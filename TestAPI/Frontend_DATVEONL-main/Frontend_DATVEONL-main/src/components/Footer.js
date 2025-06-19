import React from 'react';
import 'tailwindcss/tailwind.css';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
        <div className="logo-box">
          <p className="logo text-xl font-bold">
            Cine<span className="text-yellow-500">MaBox</span>
          </p>
          <p className="mt-2"><i className="fa fa-copyright"></i> 2001-2017, SIA Multiflex</p>
          <p className="mt-2">Giới thiệu</p>
          <p className="mt-2">Tiện ích</p>
          <p className="mt-2">Thẻ quà tặng</p>
          <p className="mt-2">Tuyển dụng</p>
        </div>
        <div className="logo-box">
          <p className="logo text-xl font-bold">
            Điều khoản sử dụng
          </p>
          <p className="mt-2">Điều khoản chung</p>
          <p className="mt-2">Điều khoản giao dịch</p>
          <p className="mt-2">Chính sách thanh toán</p>
          <p className="mt-2">Chính sách bảo mật</p>
          <p className="mt-2">Câu hỏi thường gặp</p>
        </div>
        <div className="logo-box">
          <p className="logo text-xl font-bold">
            Chăm sóc khách hàng
          </p>
          <p className="mt-2">Hotline: 1800 6600</p>
          <p className="mt-2">Email hỗ trợ: hoidap@cinimabox.vn</p>
          <div className="social-box flex space-x-4 mt-4">
            <i className="fa fa-facebook-f"></i>
            <i className="fa fa-twitter"></i>
            <i className="fa fa-instagram"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;