import React from 'react';
import { Home, RefreshCcw, Trophy, Target, Zap } from 'lucide-react';

const ResultScreen = ({ stats, onHome, onRetry, stars }) => {
  const accuracy = stats && (stats.score + stats.misses) > 0
    ? Math.round((stats.score / (stats.score + stats.misses)) * 100)
    : 0;

  const isWin = stats?.score > 0;
  const perfectRound = stats?.misses === 0;

  const getGrade = () => {
    if (accuracy >= 90) return { label: 'S', color: '#FCD34D', glow: 'rgba(252,211,77,0.6)', desc: 'Perfect!' };
    if (accuracy >= 70) return { label: 'A', color: '#00FF88', glow: 'rgba(0,255,136,0.5)', desc: 'Great job!' };
    if (accuracy >= 50) return { label: 'B', color: '#8B5CF6', glow: 'rgba(139,92,246,0.5)', desc: 'Good effort!' };
    return { label: 'C', color: '#EC4899', glow: 'rgba(236,72,153,0.5)', desc: 'Keep going!' };
  };

  const grade = getGrade();

  return (
    <div className="screen" style={{ paddingTop: '2rem', animation: 'fadeIn 0.4s ease' }}>

      {/* Grade */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{
          width: 88, height: 88, borderRadius: '50%',
          background: `radial-gradient(circle, ${grade.color}22, transparent)`,
          border: `3px solid ${grade.color}`,
          boxShadow: `0 0 30px ${grade.glow}, 0 0 60px ${grade.glow}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 0.75rem',
          animation: 'pulse-glow 2s ease infinite'
        }}>
          <span style={{
            fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '2.5rem',
            color: grade.color, textShadow: `0 0 20px ${grade.glow}`
          }}>{grade.label}</span>
        </div>

        <h2 style={{
          fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 900,
          margin: '0 0 0.25rem',
          background: 'linear-gradient(135deg, var(--purple-bright), var(--pink-hot))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
        }}>
          {perfectRound ? 'Flawless!' : isWin ? 'Round Complete!' : 'Game Over'}
        </h2>
        <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>{grade.desc}</p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.65rem', marginBottom: '1.25rem' }}>
        <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--correct)', fontFamily: 'var(--font-heading)', textShadow: '0 0 12px rgba(0,255,136,0.4)' }}>
            {stats?.score ?? 0}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
            <Target size={11} /> Matches
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--wrong)', fontFamily: 'var(--font-heading)', textShadow: '0 0 12px rgba(255,51,102,0.4)' }}>
            {stats?.misses ?? 0}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
            <Zap size={11} /> Misses
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--purple-bright)', fontFamily: 'var(--font-heading)', textShadow: '0 0 12px rgba(167,139,250,0.4)' }}>
            {accuracy}%
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
            <Trophy size={11} /> Accuracy
          </div>
        </div>
      </div>

      {/* Stars earned */}
      <div className="glass-panel" style={{
        padding: '0.9rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        borderColor: 'rgba(252,211,77,0.25)'
      }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>Total Stars</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--gold-vivid)', fontSize: '1.1rem', textShadow: '0 0 10px var(--gold-glow)' }}>
          ⭐ {stars}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <button
          className="btn-primary"
          onClick={onRetry}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem' }}
        >
          <RefreshCcw size={18} /> Play Again
        </button>
        <button
          className="btn-secondary"
          onClick={onHome}
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.95rem' }}
        >
          <Home size={16} /> Back to Home
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
