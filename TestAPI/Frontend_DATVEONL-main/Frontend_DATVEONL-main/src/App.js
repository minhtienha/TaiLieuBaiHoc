import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import MovieDetail from './pages/MovieDetail';
import Upcoming from './pages/Upcoming';
import Isshowing from './pages/Isshowing';
import ChooseChart from './pages/ChooseChart';
import Search from './pages/Search';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import TicketBooked from './pages/TicketBooked';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie-detail" element={<MovieDetail />} />
            <Route path="/upcoming-movie" element={<Upcoming />} />
            <Route path="/isshowing-movie" element={<Isshowing />} />
            <Route path="/search" element={<Search />} />
            <Route path="/choose-chart" element={<ChooseChart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/ticket-booked" element={<TicketBooked />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;