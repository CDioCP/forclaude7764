import React, { useState, useEffect } from 'react';
import { defaultWordBank } from './utils/defaultWordBank';
import { auth } from './utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { fetchHistory, saveHistory, updateHistory, selectWordsForGame, getInitialHistory } from './utils/wordManager';
import GameBoard from './components/GameBoard';
import StartScreen from './components/StartScreen';
import ResultScreen from './components/ResultScreen';
import LoginScreen from './components/LoginScreen';
import PremiumModal from './components/PremiumModal';
import { signOut } from 'firebase/auth';
import Papa from 'papaparse';
import './index.css';

const PADDLE_CLIENT_TOKEN = "live_6a7134e7f2a32051a85e01f6cd0";
// TODO: Replace with the $1.99/month + 30-day trial price ID from your Paddle dashboard
const PADDLE_PRICE_ID = "pri_01kh21daw37htz0tbrbvpdg67h";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState('start');
  const [gameWords, setGameWords] = useState([]);
  const [history, setHistory] = useState(getInitialHistory());
  const [customBank, setCustomBank] = useState(null);
  const [lastGameStats, setLastGameStats] = useState(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const unlockPremiumRef = React.useRef(null);

  const unlockPremium = () => {
    const newHistory = { ...history, isPremium: true };
    setHistory(newHistory);
    if (user) saveHistory(user.uid, newHistory);
    setShowPremiumModal(false);
    alert("Subscription successful! Premium Unlocked.");
  };

  useEffect(() => { unlockPremiumRef.current = unlockPremium; });

  useEffect(() => {
    if (window.Paddle) {
      window.Paddle.Initialize({
        token: PADDLE_CLIENT_TOKEN,
        eventCallback: (data) => {
          if (data.name === 'checkout.completed') {
            if (unlockPremiumRef.current) unlockPremiumRef.current();
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const savedHistory = await fetchHistory(currentUser.uid);
          setHistory(savedHistory || getInitialHistory());
        } catch (e) {
          console.error("Error loading history:", e);
          setHistory(getInitialHistory());
        }
      } else {
        setHistory(getInitialHistory());
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    setUser(null);
    setHistory(getInitialHistory());
    setView('start');
  };

  if (authLoading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: 'var(--purple-vivid)',
          borderRightColor: 'var(--pink-vivid)',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  const level = Math.ceil((history.totalGamesPlayed + 1) / 5) || 1;
  const stars = history.totalGamesPlayed * 100;

  const handleStartGame = () => {
    const bank = customBank || defaultWordBank;
    const words = selectWordsForGame(bank, history);
    setGameWords(words);
    setView('game');
  };

  const handleGameEnd = (results) => {
    const newHistory = updateHistory(history, results.wordDetails, gameWords);
    if (user) saveHistory(user.uid, newHistory);
    setHistory(newHistory);
    setLastGameStats({
      score: results.matches,
      misses: results.misses,
      total: gameWords.length
    });
    setView('result');
  };

  const handleUpload = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const validData = results.data
          .filter(row => row.spanish && row.english)
          .map((row, idx) => ({
            id: `custom-${idx}`,
            spanish: row.spanish,
            english: row.english,
            tier: 'A1'
          }));
        if (validData.length >= 20) {
          setCustomBank(validData);
          alert(`Loaded ${validData.length} words successfully!`);
        } else {
          alert('File must contain at least 20 valid pairs.');
        }
      },
      error: (err) => alert('Error parsing CSV: ' + err.message)
    });
  };

  const handleClearCustomBank = () => {
    setCustomBank(null);
  };

  const handleSubscribe = () => {
    if (window.Paddle) {
      window.Paddle.Checkout.open({
        items: [{ priceId: PADDLE_PRICE_ID }],
        settings: { displayMode: "overlay", theme: "light", locale: "en" }
      });
    } else {
      if (confirm("Paddle Overlay Placeholder\n\nConfirm Payment?")) {
        unlockPremium();
      }
    }
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {view === 'start' && (
        <StartScreen
          onStart={handleStartGame}
          onUpload={handleUpload}
          hasCustomBank={!!customBank}
          customWordCount={customBank?.length ?? 0}
          onClearCustomBank={handleClearCustomBank}
          totalGames={history.totalGamesPlayed}
          user={user}
          authLoading={authLoading}
          history={history}
          onShowPremium={() => setShowPremiumModal(true)}
          onLogout={handleLogout}
          level={level}
          stars={stars}
        />
      )}
      {view === 'game' && (
        <GameBoard
          words={gameWords}
          onGameEnd={handleGameEnd}
          onHome={() => setView('start')}
          isPremium={history.isPremium}
          level={level}
          stars={stars}
        />
      )}
      {view === 'result' && (
        <ResultScreen
          stats={lastGameStats}
          onHome={() => setView('start')}
          onRetry={handleStartGame}
          stars={stars}
        />
      )}

      {showPremiumModal && (
        <PremiumModal
          onClose={() => setShowPremiumModal(false)}
          onSubscribe={handleSubscribe}
        />
      )}
    </div>
  );
}

export default App;
