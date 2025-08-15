import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Webcam from './components/WebcamCap';
import Contact from './components/Contact';
import About from './components/About';
import Camera from './components/Camera';
import SpotifyCard from './components/SpotifyCard';
import PolaroidStrip from './components/PolaroidStrip';

const App = () => {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#D9A299' }}>
        <div className="container">
          <Link className="navbar-brand" to="/">Photo Booth</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/">Camera</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/home">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/webcam">Webcam</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/webcam" element={<Webcam />} />
          <Route path="/spotify-card" element={<SpotifyCard />} />
          <Route path="/" element={<Camera />} />
          <Route path="/polaroid-strip" element={<PolaroidStrip />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;