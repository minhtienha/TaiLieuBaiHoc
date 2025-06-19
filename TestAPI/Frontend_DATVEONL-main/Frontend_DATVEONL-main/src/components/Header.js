import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../assets/styles/home.css';

const Header = () => {
  const navigate = useNavigate();
  const { account } = useContext(AuthContext);

  useEffect(() => {
    const marker = document.querySelector('.marker');
    const items = document.querySelectorAll('nav ul li');

    function indicator(e) {
      marker.style.left = e.offsetLeft + "px";
      marker.style.width = e.offsetWidth + "px";
    }

    items.forEach(link => {
      link.addEventListener("click", (e) => {
        indicator(e.target);
      });
    });

    const nav = document.querySelector('nav');
    window.addEventListener("scroll", () => {
      if (window.pageYOffset >= 20) {
        nav.classList.add('nav');
      } else {
        nav.classList.remove('nav');
      }

      if (window.pageYOffset >= 700) {
        nav.classList.add('navBlack');
      } else {
        nav.classList.remove('navBlack');
      }
    });

    const menu = document.querySelector('#menu');
    const menuBx = document.querySelector('#menu-box');
    let a = true;

    menu.addEventListener("click", () => {
      if (a) {
        menuBx.style.display = "block";
        menu.classList.replace("fa-bars", "fa-remove");
        a = false;
      } else {
        menuBx.style.display = "none";
        menu.classList.replace("fa-remove", "fa-bars");
        a = true;
      }
    });

    return () => {
      items.forEach(link => {
        link.removeEventListener("click", indicator);
      });
      window.removeEventListener("scroll", () => {});
      menu.removeEventListener("click", () => {});
    };
  }, []);

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleAccountClick = () => {
    navigate('/account');
  };

  return (
    <header>
      <nav>
        <p className="logo" onClick={handleHomeClick}>
          CG<span>VBox</span>
        </p>
        <i className="fa fa-bars" id="menu"></i>
        <ul id="menu-box">
          <div className="marker"></div>
          <li onClick={handleHomeClick}>Trang Chủ</li>
          <li className="relative group">
            <span className="cursor-pointer px-4 py-2 menu-header">Phim</span>
            <ul className="absolute left-0 hidden group-hover:block bg-white shadow-lg mt-3 w-48">
              <li
                className="px-4 py-2 text-white bg-black hover:bg-red-600 cursor-pointer transition-colors duration-300 ease-in-out w-full text-left"
                onClick={() => navigate('/isshowing-movie')}
              >
                PHIM ĐANG CHIẾU
              </li>
              <li
                className="px-4 py-2 text-white bg-black hover:bg-red-600 cursor-pointer transition-colors duration-300 ease-in-out w-full text-left"
                onClick={() => navigate('/upcoming-movie')}
              >
                PHIM SẮP CHIẾU
              </li>
            </ul>
          </li>
          <li>Tin mới</li>
          {account ? (
            <li onClick={handleAccountClick}>
              <b>{account.TENKH}</b>
            </li>
          ) : (
            <>
              <li onClick={() => navigate('/login')}>
                <b>Đăng nhập</b>
              </li>
              <li onClick={() => navigate('/register')}>
                <b>Đăng ký</b>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;