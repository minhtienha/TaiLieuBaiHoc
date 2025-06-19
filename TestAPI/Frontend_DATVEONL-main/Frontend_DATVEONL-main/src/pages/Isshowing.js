import React, { useEffect, useState } from 'react';
import '../assets/styles/home.css';
import { useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import BookingModal from '../components/BookingModal';
import { getIsShowing, getMovieByName } from '../services/api';

const Isshowing = () => {
  const navigate = useNavigate();
  const [trailer, setTrailer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getIsShowing();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

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

    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
      let isDown = false;
      let startX;
      let scrollLeft;

      carousel.addEventListener('mousedown', (e) => {
        isDown = true;
        carousel.classList.add('active');
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
      });

      carousel.addEventListener('mouseleave', () => {
        isDown = false;
        carousel.classList.remove('active');
      });

      carousel.addEventListener('mouseup', () => {
        isDown = false;
        carousel.classList.remove('active');
      });

      carousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 3; //scroll-fast
        carousel.scrollLeft = scrollLeft - walk;
      });

      // Autoplay
      let autoPlayInterval;
      const startAutoPlay = () => {
        autoPlayInterval = setInterval(() => {
          carousel.scrollLeft += carousel.offsetWidth;
          if (carousel.scrollLeft >= carousel.scrollWidth - carousel.offsetWidth) {
            carousel.scrollLeft = 0;
          }
        }, 5000);
      };

      const stopAutoPlay = () => {
        clearInterval(autoPlayInterval);
      };

      carousel.addEventListener('mouseenter', stopAutoPlay);
      carousel.addEventListener('mouseleave', startAutoPlay);

      startAutoPlay();
    });

    return () => {
      items.forEach(link => {
        link.removeEventListener("click", indicator);
      });
      window.removeEventListener("scroll", () => {});
      menu.removeEventListener("click", () => {});
    };
  }, []);

  const handleDetailClick = async (movieName) => {
    try {
      const data = await getMovieByName(movieName);
      if (data && data.length > 0) {
        const maphim = data[0].MAPHIM;
        const id = maphim.slice(12);
        navigate(`/movie-detail?id=${id}`);
      } else {
        alert('Không tìm thấy phim.');
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const handleButtonClick = (event) => {
    const movieName = event.target.closest('.card').querySelector('.movie-name').textContent;
    handleDetailClick(movieName);
  };

  const handleOutsideClick = (event) => {
    const slideTrailer = document.querySelector('.slide_trailer');
    const videoTrailer = document.querySelector('.video_trailer');
    if (videoTrailer && !videoTrailer.contains(event.target)) {
      slideTrailer.style.display = 'none';
      setTrailer(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  // Hàm xử lý thay đổi giá trị trong input tìm kiếm
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Hàm xử lý khi người dùng nhấn phím Enter để tìm kiếm
  const handleSearchKeyPress = async (event) => {
    if (event.key === 'Enter') {
      try {
        const result = await getMovieByName(searchQuery);
        if (result && result.length > 0) {
          // Cập nhật kết quả tìm kiếm vào state
          setMovies(result);
          // Điều hướng đến trang tìm kiếm và truyền kết quả tìm kiếm
          navigate('/search', { state: { movies: result } });
        } else {
          alert('Không tìm thấy phim.');
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
        alert('Có lỗi xảy ra khi tìm kiếm.');
      }
    }
  };

  const handleBuyTicketClick = (movieName) => {
    setSelectedMovie(movieName);
    setIsModalOpen(true);
  };

  const handleUpcomingClick = () => {
    navigate('/upcoming-movie');
  };

  const handleIsShowingClick = () => {
    navigate('/isshowing-movie');
  }

  return (
    <div>
      <section>
        <div className="filter-search-box">
          <div className="filters-box">
            <div className="all-filters filters" onClick={handleIsShowingClick}>
              Đang chiếu <i className="fa fa-angle-down"></i>
            </div>
            <div className="date-filters filters" onClick={handleUpcomingClick}>
              Sắp chiếu <i className="fa fa-angle-down"></i>
            </div>
          </div>
          <div className="search-filters">
            <input
              type="text"
              placeholder="Tìm theo tên..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={handleSearchKeyPress}
            />
            <i className="fa fa-search"></i>
          </div>
          <div className="search-bar">
            <div className="bar"></div>
          </div>
        </div>
        <div className="movie-card-section">
          {movies.map(movie => (
            <div className="card" key={movie.MAPHIM}>
              <img onClick={handleButtonClick} src={`${movie.POSTER}`} alt="Movie Poster" />
              <div className="card-content">
                <p onClick={handleButtonClick} className="movie-name">{movie.TENPHIM}</p>
                <button onClick={() => handleBuyTicketClick(movie.TENPHIM)} className="buy-ticket-button">Mua vé</button>
              </div>
            </div>
          ))}
        </div>
        <div className="show">
          <div className="show-bar">
            <div className="bar"></div>
          </div>
          <button>Show more</button>
        </div>
      </section>
      <div className="slide_trailer" style={{ display: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
          {trailer && <YouTube className="video_trailer" videoId={trailer} opts={{ height: '390', width: '640', playerVars: { autoplay: 1 } }} />}
        </div>
      </div>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} movieTitle={selectedMovie} />
    </div>
  );
};

export default Isshowing;