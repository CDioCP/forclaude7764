import React, { useState, useEffect, useRef } from 'react';
import Card from './Card';
import { Home, XCircle, Heart, Pause } from 'lucide-react';

const shuffle = (array) => {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const GameBoard = ({ words, onGameEnd, onHome, isPremium, level, stars }) => {
  const [cards, setCards] = useState([]);
  const [gameState, setGameState] = useState('peek');
  const [hearts, setHearts] = useState(3);
  const [selection, setSelection] = useState([]);
  const [matches, setMatches] = useState(new Set());
  const [mistakes, setMistakes] = useState(new Set());
  const idMap = useRef(new Map());
  const [score, setScore] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [wordResults, setWordResults] = useState({});

  useEffect(() => {
    idMap.current.clear();
    const deck = [];
    words.forEach(w => {
      const hashS = `c_${Math.random().toString(36).substr(2, 5)}`;
      const hashE = `c_${Math.random().toString(36).substr(2, 5)}`;
      idMap.current.set(hashS, { id: w.id, type: 'spanish' });
      idMap.current.set(hashE, { id: w.id, type: 'english' });
      deck.push({ instanceId: hashS, text: w.spanish, type: 'spanish' });
      deck.push({ instanceId: hashE, text: w.english, type: 'english' });
    });
    setCards(shuffle(deck));
    setHearts(3);
    const timer = setTimeout(() => setGameState('playing'), 2000);
    return () => clearTimeout(timer);
  }, [words]);

  useEffect(() => {
    if (selection.length === 2) {
      const [hash1, hash2] = selection;
      const data1 = idMap.current.get(hash1);
      const data2 = idMap.current.get(hash2);
      if (!data1 || !data2) return;

      const isMatch = data1.id === data2.id;
      const wordId = data1.id;

      if (isMatch) {
        setScore(s => s + 1);
        setMatches(prev => new Set(prev).add(wordId));
        setWordResults(prev => ({ ...prev, [wordId]: prev[wordId] === 'missed' ? 'missed' : 'matched' }));
        setSelection([]);

        if (matches.size + 1 >= words.length) {
          setTimeout(() => {
            onGameEnd({
              matches: score + 1,
              misses: missCount,
              wordDetails: { ...wordResults, [wordId]: wordResults[wordId] || 'matched' }
            });
          }, 1000);
        }
      } else {
        setMissCount(c => c + 1);
        setMistakes(new Set([hash1, hash2]));
        setWordResults(prev => ({ ...prev, [data1.id]: 'missed', [data2.id]: 'missed' }));

        if (!isPremium) {
          setHearts(h => {
            const next = h - 1;
            if (next <= 0) {
              setGameState('ended');
              setTimeout(() => {
                onGameEnd({ matches: 0, misses: missCount + 1, wordDetails: wordResults });
              }, 1000);
            }
            return next;
          });
        }

        setTimeout(() => {
          setMistakes(new Set());
          setSelection([]);
        }, 1000);
      }
    }
  }, [selection]);

  const handleCardClick = (instanceId) => {
    if (gameState !== 'playing') return;
    if (selection.includes(instanceId)) return;
    if (selection.length >= 2) return;
    const data = idMap.current.get(instanceId);
    if (matches.has(data.id)) return;
    setSelection(prev => [...prev, instanceId]);
  };

  const pairsLeft = words.length - matches.size;

  return (
    <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', padding: '1rem 0.9rem 2rem' }}>

      {/* Top Nav */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '1rem'
      }}>
        <button
          onClick={() => onGameEnd({ matches: score, misses: missCount, wordDetails: wordResults })}
          style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px',
            color: 'var(--text-muted)',
            padding: '0.45rem 0.9rem',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.85rem', fontWeight: 600
          }}
        >
          <Home size={16} /> Home
        </button>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Stars */}
          <div className="hud-chip" style={{ color: 'var(--gold-vivid)' }}>
            ⭐ <span>{stars}</span>
          </div>
          {/* Hearts */}
          <div className="hud-chip" style={{ color: isPremium ? 'var(--gold-vivid)' : 'var(--pink-vivid)' }}>
            {isPremium ? (
              <span style={{ textShadow: '0 0 8px var(--gold-glow)' }}>∞</span>
            ) : (
              <>
                {Array(3).fill(0).map((_, i) => (
                  <Heart
                    key={i}
                    size={16}
                    fill={i < hearts ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    style={{
                      opacity: i < hearts ? 1 : 0.25,
                      filter: i < hearts ? 'drop-shadow(0 0 4px var(--pink-vivid))' : 'none'
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{
        textAlign: 'center',
        marginBottom: '1rem',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        fontWeight: 600,
        letterSpacing: '0.5px'
      }}>
        <span>Level&nbsp;
          <span style={{ color: 'var(--green-neon)', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem' }}>{level}</span>
        </span>
        <span style={{ margin: '0 0.6rem', opacity: 0.4 }}>|</span>
        <span>Score&nbsp;
          <span style={{ color: 'var(--purple-bright)', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem' }}>{score}</span>
        </span>
        <span style={{ margin: '0 0.6rem', opacity: 0.4 }}>|</span>
        <span>Pairs left&nbsp;
          <span style={{ color: 'var(--pink-hot)', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem' }}>{pairsLeft}</span>
        </span>
      </div>

      {/* Peek overlay */}
      {gameState === 'peek' && (
        <div style={{
          textAlign: 'center', marginBottom: '0.75rem',
          color: 'var(--cyan-electric)',
          fontWeight: 700, fontSize: '0.85rem',
          textShadow: '0 0 10px var(--cyan-glow)',
          animation: 'heartbeat 0.8s ease infinite'
        }}>
          👁 Memorize the pairs!
        </div>
      )}

      {/* Card Grid */}
      <div className="card-grid" style={{ marginBottom: '1.25rem' }}>
        {cards.map(card => {
          const data = idMap.current.get(card.instanceId);
          const isMatched = matches.has(data.id);
          const isMistake = mistakes.has(card.instanceId);

          return (
            <Card
              key={card.instanceId}
              content={card.text}
              type={card.type}
              isFlipped={gameState === 'peek' || isMatched || selection.includes(card.instanceId) || isMistake}
              isMatched={isMatched}
              isMistake={isMistake}
              disabled={gameState !== 'playing' || isMatched}
              onClick={() => handleCardClick(card.instanceId)}
            />
          );
        })}
      </div>

      {/* Legend + End Game */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div style={{
              width: 14, height: 14, borderRadius: 4,
              background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
              boxShadow: '0 0 6px rgba(124,58,237,0.6)'
            }} />
            Español
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <div style={{
              width: 14, height: 14, borderRadius: 4,
              background: 'linear-gradient(135deg, #BE185D, #881337)',
              boxShadow: '0 0 6px rgba(190,24,93,0.6)'
            }} />
            English
          </div>
        </div>

        <button
          onClick={() => onGameEnd({ matches: score, misses: missCount, wordDetails: wordResults })}
          style={{
            background: 'rgba(255, 51, 102, 0.1)',
            border: '1.5px solid var(--wrong)',
            color: 'var(--wrong)',
            borderRadius: '10px',
            padding: '0.5rem 1rem',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            fontSize: '0.82rem', fontWeight: 700,
            boxShadow: '0 0 12px rgba(255,51,102,0.2)'
          }}
        >
          <XCircle size={15} /> End Game
        </button>
      </div>
    </div>
  );
};

export default GameBoard;
