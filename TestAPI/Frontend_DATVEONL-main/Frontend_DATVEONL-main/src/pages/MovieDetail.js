import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import YouTube from 'react-youtube';
import '../assets/styles/detail.css';
import BookingModal from '../components/BookingModal';
import { getOneMovie } from '../services/api';

const MovieDetail = () => {
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [credits, setCredits] = useState({ director: '', cast: '' });
  const [trailerVisible, setTrailerVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý modal
  const [selectedMovie, setSelectedMovie] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const movieId = params.get('id');

    if (movieId) {
      // Lấy phim bằng getOneMovie
      getOneMovie(movieId).then((data) => {
        setMovie(data);
        setCredits({ 
          director: data.DAODIEN, 
          cast: data.DIENVIEN 
        });
      });
    }
  }, [location.search]);

  const toggleTrailer = () => {
    setTrailerVisible(!trailerVisible);
  };

  const handleBuyTicketClick = (movieName) => {
    setSelectedMovie(movieName);
    setIsModalOpen(true);
  };

  const opts = {
    height: '300',
    width: '620',
    playerVars: {
      autoplay: 1,
    },
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap lg:flex-nowrap">
        <div className="w-full lg:w-1/3 p-2">
          <img src={movie.POSTER} alt="Movie Poster" className="movie-banner" />
        </div>
        <div className="w-full lg:w-2/3 p-2 movie-info">
          <h2 className="text-2xl font-bold mb-2">{movie.TENPHIM}</h2>
          <p><strong>Đạo diễn:</strong> {credits.director}</p>
          <p><strong>Diễn viên:</strong> {credits.cast}</p>
          <p><strong>Thể loại:</strong> {movie.THELOAI}</p>
          <p><strong>Thời lượng:</strong> {movie.THOILUONG} phút</p>
          <p><strong>Khởi chiếu:</strong> {new Date(movie.NGAYKHOICHIEU).toLocaleDateString()}</p>
          <div className="flex space-x-2 mt-4">
            <button className="btn-red" onClick={() => handleBuyTicketClick(movie.TENPHIM)}>Đặt vé</button>
            <button className="btn-outline-dark" onClick={toggleTrailer}>
              {trailerVisible ? 'Hide Trailer' : 'Show Trailer'}
            </button>
          </div>

          {trailerVisible && movie.TRAILER && (
            <div className="mt-4">
              <YouTube videoId={movie.TRAILER} opts={opts} />
            </div>
          )}

          <div className="mt-4">
            <h4 className="text-xl font-bold mb-2">Mô Tả</h4>
            <p>{movie.MOTA}</p>
          </div>
        </div>
      </div>
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} movieTitle={selectedMovie} /> {/* Sử dụng BookingModal */}
    </div>
  );
};

export default MovieDetail;