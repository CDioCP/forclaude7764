import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Pricing, Privacy, Terms, Refund } from './LegalPages';
import MovieCard from './components/MovieCard';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const MovieApp = () => {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState(['', '', '']);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const addInput = () => {
    if (favorites.length < 5) setFavorites(prev => [...prev, '']);
  };

  const removeInput = (index) => {
    if (favorites.length > 1) setFavorites(prev => prev.filter((_, i) => i !== index));
  };

  const generateRecommendations = async () => {
    setLoading(true);
    setProgress(0);
    setMovies([]);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 95 ? prev : prev + Math.floor(Math.random() * 5 + 2)));
    }, 150);

    try {
      const response = await fetch(`${API_URL}/generate-dna`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite_movies: favorites.filter(m => m.trim() !== '') }),
      });
      const data = await response.json();
      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setMovies(data.results || []);
        setLoading(false);
      }, 500);
    } catch (error) {
      clearInterval(progressInterval);
      setLoading(false);
      alert('SYSTEM ERROR: Neural Link Offline. Please start main.py');
    }
  };

  return (
    <div className="cyber-page">
      <header className="hero-section">
        <div className="galaxy-logo">🌌</div>
        <h1 className="main-title">CINEHELIX</h1>
        <p className="tagline">MOVIE DNA GENOME ENGINE</p>
      </header>

      <div className="search-box">
        {favorites.map((movie, index) => (
          <div key={index} className="input-row">
            <input
              type="text"
              placeholder={`DNA COMPONENT #${index + 1}`}
              value={movie}
              onChange={(e) => {
                const newFavs = [...favorites];
                newFavs[index] = e.target.value;
                setFavorites(newFavs);
              }}
            />
            {favorites.length > 1 && (
              <button className="remove-btn" onClick={() => removeInput(index)} aria-label="Remove">✕</button>
            )}
          </div>
        ))}

        {favorites.length < 5 && (
          <button className="add-btn" onClick={addInput}>+ ADD DNA COMPONENT</button>
        )}

        {loading && (
          <div className="progress-container">
            <div className="progress-bar-outline">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="progress-text">SEQUENCING GENOME: {Math.round(progress)}%</span>
          </div>
        )}

        <button onClick={generateRecommendations} disabled={loading} className="cyber-btn">
          {loading ? 'ANALYZING DNA...' : 'GENERATE DNA MATCH'}
        </button>
      </div>

      <div className="results-grid">
        {movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <div className="layout-wrapper">
      <Routes>
        <Route path="/" element={<MovieApp />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
      </Routes>
      <footer className="cyber-footer">
        <p>© 2026 CineHelix Protocol</p>
        <div className="legal-links">
          <Link to="/pricing">Pricing</Link>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/refund">Refund</Link>
        </div>
      </footer>
    </div>
  </Router>
);

export default App;
