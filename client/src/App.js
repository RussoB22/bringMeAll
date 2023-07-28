import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Leaderboard from './pages/Leaderboard';
import Footer from './components/Footer';
import Nav from './components/Nav';
import News from './pages/News';
import ProfilePage from './pages/ProfilePage';


function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="content-container">
            <Nav />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/news" element={<News />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
