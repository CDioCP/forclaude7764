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
  const [count, setCount] = useState(10);
  const [minScore, setMinScore] = useState(0);
  const [selected, setSelected] = useState([]);
  const [excluded, setExcluded] = useState([]);
  const [lastSeeds, setLastSeeds] = useState([]);

  const addInput = () => {
    if (favorites.length < 5) setFavorites(prev => [...prev, '']);
  };

  const removeInput = (index) => {
    if (favorites.length > 1) setFavorites(prev => prev.filter((_, i) => i !== index));
  };

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelected(selected.length === movies.length ? [] : movies.map(m => m.id));
  };

  const fetchMovies = async (seeds, requestCount, excludeIds) => {
    setLoading(true);
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev >= 95 ? prev : prev + Math.floor(Math.random() * 5 + 2)));
    }, 150);

    try {
      const response = await fetch(`${API_URL}/generate-dna`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          favorite_movies: seeds,
          count: requestCount,
          min_score: minScore,
          exclude_ids: excludeIds,
        }),
      });
      const data = await response.json();
      clearInterval(progressInterval);
      setProgress(100);
      await new Promise(r => setTimeout(r, 500));
      return data.results || [];
    } catch (error) {
      clearInterval(progressInterval);
      alert('SYSTEM ERROR: Neural Link Offline. Please start main.py');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = async () => {
    const seeds = favorites.filter(m => m.trim() !== '');
    setLastSeeds(seeds);
    setExcluded([]);
    setSelected([]);
    setMovies([]);
    const results = await fetchMovies(seeds, count, []);
    if (results) setMovies(results);
  };

  const replaceSelected = async () => {
    if (selected.length === 0) return;
    const newExcluded = [...excluded, ...selected];
    setExcluded(newExcluded);
    const kept = movies.filter(m => !selected.includes(m.id));
    const needed = count - kept.length;
    setSelected([]);
    if (needed <= 0) { setMovies(kept); return; }
    const results = await fetchMovies(lastSeeds, needed, newExcluded);
    if (results) setMovies([...kept, ...results]);
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

        <div className="filter-row">
          <div className="filter-group">
            <label>SUGGESTIONS: {count}</label>
            <input
              type="range"
              min="1"
              max="20"
              value={count}
              onChange={e => setCount(Number(e.target.value))}
            />
          </div>
          <div className="filter-group">
            <label>MIN IMDB: {minScore.toFixed(1)}</label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={minScore}
              onChange={e => setMinScore(Number(e.target.value))}
            />
          </div>
        </div>

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

      {movies.length > 0 && (
        <div className="results-controls">
          <label className="select-all-label">
            <input
              type="checkbox"
              checked={selected.length === movies.length && movies.length > 0}
              onChange={toggleSelectAll}
            />
            SELECT ALL
          </label>
          {selected.length > 0 && (
            <button className="replace-btn" onClick={replaceSelected} disabled={loading}>
              REPLACE SELECTED ({selected.length})
            </button>
          )}
        </div>
      )}

      <div className="results-grid">
        {movies.map((movie, index) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            number={index + 1}
            selected={selected.includes(movie.id)}
            onToggle={() => toggleSelect(movie.id)}
          />
        ))}
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
