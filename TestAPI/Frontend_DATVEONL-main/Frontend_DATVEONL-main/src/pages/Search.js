import React, { useState, useEffect } from 'react';
import '../assets/styles/home.css';
import { useLocation, useNavigate } from 'react-router-dom';
// import YouTube from 'react-youtube';
import BookingModal from '../components/BookingModal';
import { getMovieByName } from '../services/api';


const SearchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMovie, setSelectedMovie] = useState('');

  
  const [movies, setMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  // const [trailer, setTrailer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const searchResults = location?.state?.movies || [];
        setMovies(searchResults);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [location]);

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

  // Tìm kiếm phim
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyPress = async (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      try {
        setLoading(true);
        const result = await getMovieByName(searchQuery);
        if (result && result.length > 0) {
          setMovies(result);
          navigate('/search', { state: { movies: result } });
        } else {
          alert('Không tìm thấy phim.');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setLoading(false);
        alert('Có lỗi xảy ra khi tìm kiếm.');
      }
    }
  };

  const handleBuyTicketClick = (movieName) => {
    setSelectedMovie(movieName);
    setIsModalOpen(true);
  };

  return (
    <div>
      <section>
        <div className="filter-search-box">
          <div className="search-filters">
            <input
              id="searchInput"
              type="text"
              placeholder="Tìm theo tên..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onKeyPress={handleSearchKeyPress}
              aria-label="Search movies"
            />
            <i className="fa fa-search"></i>
          </div>
          <div className="search-bar">
            <div className="bar"></div>
          </div>
        </div>
        <div className="movie-card-section">
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : (
            movies.length > 0 ? (
              movies.map(movie => (
                <div className="card" key={movie.MAPHIM}>
                  <img onClick={handleButtonClick}
                    src={`${movie.POSTER}`}
                    alt="Movie Poster"
                    // style={{ width: '250px', height: '350px' }}
                  />
                  <div className="card-content">
                    <p onClick={handleButtonClick} className="movie-name">{movie.TENPHIM}</p>
                    <button onClick={() => handleBuyTicketClick(movie.TENPHIM)} className="buy-ticket-button">Mua vé</button>
                  </div>
                </div>
              ))
            ) : (
              <p>Không tìm thấy phim phù hợp.</p>
            )
          )}
        </div>
      </section>

      {/* {trailer && (
        <div className="slide_trailer">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
            <YouTube videoId={trailer} opts={{ width: '800', height: '450' }} />
          </div>
        </div>
      )} */}

      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} movieTitle={selectedMovie} />
    </div>
  );
};

export default SearchPage;
