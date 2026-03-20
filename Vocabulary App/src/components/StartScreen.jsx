import React, { useRef, useState } from 'react';
import { Upload, Lock, CheckCircle, Zap, Clock, ChevronRight, BookOpen, X, FileText } from 'lucide-react';
import { signInWithGoogle } from '../utils/auth';
import { TIERS, isTierUnlocked } from '../utils/wordManager';
import { defaultWordBank } from '../utils/defaultWordBank';

const LEVEL_NAMES = ['Beginner', 'Learner', 'Intermediate', 'Advanced', 'Expert', 'Master'];
const LEVEL_COLORS = [
  ['#10B981', '#059669'],
  ['#3B82F6', '#2563EB'],
  ['#8B5CF6', '#7C3AED'],
  ['#F59E0B', '#D97706'],
  ['#EF4444', '#DC2626'],
  ['#EC4899', '#BE185D'],
];

const StartScreen = ({ onStart, onUpload, hasCustomBank, customWordCount, onClearCustomBank, totalGames, user, authLoading, history, onShowPremium, onLogout, level, stars }) => {
  const fileInputRef = useRef(null);
  const [showFormatHint, setShowFormatHint] = useState(false);

  const levelName = LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)] || 'Master';
  const levelColors = LEVEL_COLORS[Math.min(level - 1, LEVEL_COLORS.length - 1)];
  const gamesUntilNextLevel = 5 - (totalGames % 5);
  const progressPct = ((totalGames % 5) / 5) * 100;

  return (
    <div className="screen" style={{ paddingTop: '1.5rem' }}>

      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1
            className="neon-text"
            style={{ fontSize: '2.1rem', fontFamily: 'var(--font-heading)', fontWeight: 900, margin: 0, lineHeight: 1 }}
          >
            Vocab Memory Quest
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '0.35rem 0 0' }}>
            Master English · Train Your Memory
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
          <div className="stat-badge">⭐ {stars}</div>
          {history?.isPremium && (
            <span style={{
              fontSize: '0.7rem', fontWeight: 700, letterSpacing: '1px',
              color: 'var(--gold-vivid)', border: '1px solid var(--gold-vivid)',
              padding: '0.15rem 0.5rem', borderRadius: '4px',
              textShadow: '0 0 8px var(--gold-glow)'
            }}>PRO</span>
          )}
        </div>
      </div>

      {/* User row */}
      {user && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          marginBottom: '1.2rem', padding: '0.5rem 0.8rem',
          background: 'rgba(139, 92, 246, 0.08)',
          borderRadius: '10px', border: '1px solid rgba(139, 92, 246, 0.15)'
        }}>
          {user.photoURL && (
            <img src={user.photoURL} alt="Profile"
              style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid var(--purple-vivid)' }}
            />
          )}
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flex: 1 }}>{user.displayName}</span>
          <button onClick={onLogout} style={{
            background: 'none', border: 'none', color: 'var(--text-muted)',
            fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer', padding: 0
          }}>Sign Out</button>
        </div>
      )}

      {/* Word List card — prominent, above play buttons */}
      <div className="glass-panel" style={{
        padding: '1.25rem', marginBottom: '1rem',
        borderColor: hasCustomBank ? 'rgba(34, 211, 238, 0.35)' : 'rgba(139, 92, 246, 0.2)',
        boxShadow: hasCustomBank
          ? '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(34,211,238,0.1)'
          : '0 8px 32px rgba(0,0,0,0.4)'
      }}>
        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BookOpen size={16} color={hasCustomBank ? 'var(--cyan-electric)' : 'var(--purple-vivid)'} />
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>
              Word List
            </span>
          </div>
          <button
            onClick={() => setShowFormatHint(v => !v)}
            style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              fontSize: '0.72rem', cursor: 'pointer', textDecoration: 'underline', padding: 0
            }}
          >
            {showFormatHint ? 'Hide format' : 'CSV format?'}
          </button>
        </div>

        {/* Active source indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.9rem' }}>
          {/* Default option */}
          <div
            onClick={() => hasCustomBank && onClearCustomBank()}
            style={{
              flex: 1, padding: '0.65rem 0.75rem', borderRadius: '10px', cursor: hasCustomBank ? 'pointer' : 'default',
              background: !hasCustomBank ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${!hasCustomBank ? 'var(--purple-vivid)' : 'rgba(255,255,255,0.08)'}`,
              transition: 'all 0.2s'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '0.82rem', color: !hasCustomBank ? '#fff' : 'var(--text-muted)' }}>
                Default Bank
              </span>
              {!hasCustomBank && (
                <span style={{ fontSize: '0.65rem', background: 'var(--purple-vivid)', color: '#fff', borderRadius: '4px', padding: '1px 6px', fontWeight: 700 }}>
                  ACTIVE
                </span>
              )}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {defaultWordBank.length} words · 5 tiers (A1–C1)
            </div>
          </div>

          {/* Custom option */}
          <div style={{
            flex: 1, padding: '0.65rem 0.75rem', borderRadius: '10px',
            background: hasCustomBank ? 'rgba(34,211,238,0.12)' : 'rgba(255,255,255,0.03)',
            border: `1.5px solid ${hasCustomBank ? 'var(--cyan-electric)' : 'rgba(255,255,255,0.08)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '0.82rem', color: hasCustomBank ? '#fff' : 'var(--text-muted)' }}>
                Custom List
              </span>
              {hasCustomBank && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.65rem', background: 'var(--cyan-electric)', color: '#000', borderRadius: '4px', padding: '1px 6px', fontWeight: 700 }}>
                    ACTIVE
                  </span>
                  <button
                    onClick={onClearCustomBank}
                    title="Remove custom list"
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex' }}
                  >
                    <X size={13} />
                  </button>
                </div>
              )}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {hasCustomBank ? `${customWordCount} words loaded` : 'No file uploaded'}
            </div>
          </div>
        </div>

        {/* Upload button */}
        <button
          onClick={() => fileInputRef.current.click()}
          style={{
            width: '100%', padding: '0.7rem',
            background: 'rgba(34, 211, 238, 0.08)',
            border: '1.5px dashed rgba(34, 211, 238, 0.4)',
            borderRadius: '10px',
            color: 'var(--cyan-electric)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(34,211,238,0.14)'}
          onMouseOut={e => e.currentTarget.style.background = 'rgba(34,211,238,0.08)'}
        >
          <Upload size={15} />
          {hasCustomBank ? 'Replace Word List (CSV)' : 'Upload Word List (CSV)'}
        </button>

        {/* Format hint */}
        {showFormatHint && (
          <div style={{
            marginTop: '0.85rem', padding: '0.85rem',
            background: 'rgba(0,0,0,0.3)', borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.07)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              <FileText size={13} color="var(--gold-vivid)" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-vivid)' }}>CSV Format</span>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#a0e0ff', lineHeight: 1.7 }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '0.15rem' }}>spanish,english</div>
              <div>hola,hello</div>
              <div>gato,cat</div>
              <div>escuela,school</div>
              <div style={{ color: 'rgba(255,255,255,0.3)', marginTop: '0.15rem' }}>… (min. 20 pairs)</div>
            </div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              First row must be the header: <code style={{ color: 'var(--cyan-electric)' }}>spanish,english</code>
            </div>
          </div>
        )}

        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
        />
      </div>

      {/* Ready to Play card */}
      <div className="glass-panel" style={{
        padding: '1.5rem', marginBottom: '1rem',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(139, 92, 246, 0.15), inset 0 0 40px rgba(139, 92, 246, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.75rem' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '12px', flexShrink: 0,
            background: 'linear-gradient(135deg, #7C3AED, #5B21B6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(124, 58, 237, 0.5)'
          }}>
            <Zap size={22} color="#fff" fill="#fff" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.15rem' }}>
              Ready to Play?
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 2 }}>
              {hasCustomBank
                ? `Playing with your custom list (${customWordCount} words)`
                : 'Match Spanish words with their English translations'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <button
            className="btn-primary"
            onClick={onStart}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '1rem' }}
          >
            Start Game <ChevronRight size={18} />
          </button>
          <button
            className="btn-secondary"
            onClick={onStart}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.95rem' }}
          >
            <Clock size={16} /> Timed Challenge
          </button>

          {!history?.isPremium && (
            <button
              onClick={onShowPremium}
              style={{
                width: '100%', padding: '0.7rem',
                background: 'rgba(252,211,77,0.08)',
                border: '1.5px solid rgba(252,211,77,0.35)',
                borderRadius: '12px',
                color: 'var(--gold-vivid)',
                fontWeight: 700, fontSize: '0.85rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              ⭐ Start Free Trial — 30 days free · then $1.99/mo
            </button>
          )}
        </div>
      </div>

      {/* Current Level card */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.9rem' }}>
          <div
            className="level-badge"
            style={{ background: `linear-gradient(135deg, ${levelColors[0]}, ${levelColors[1]})`, boxShadow: `0 4px 16px ${levelColors[0]}55` }}
          >
            {level}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Level</div>
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.1rem' }}>{levelName}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Games</div>
            <div style={{ fontWeight: 700, color: 'var(--purple-bright)', fontSize: '1.1rem' }}>{totalGames}</div>
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            <span>Progress to Level {level + 1}</span>
            <span>{gamesUntilNextLevel} games to go</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Tier progression */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem' }}>
          Vocabulary Tiers
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {TIERS.map(tier => {
            const isUnlocked = isTierUnlocked(tier, defaultWordBank, history || { wordStats: {}, isPremium: false });
            const isPremiumLocked = !history?.isPremium && ['B1', 'B2', 'C1'].includes(tier);
            return (
              <button
                key={tier}
                className={`tier-pill ${isUnlocked ? 'unlocked' : 'locked'}`}
                onClick={() => {
                  if (isPremiumLocked) onShowPremium();
                  else if (!isUnlocked) alert(`Master 90% of the previous tier to unlock ${tier}!`);
                  else onStart();
                }}
              >
                <span>{tier}</span>
                {isPremiumLocked ? (
                  <Lock size={12} color="var(--gold-vivid)" />
                ) : !isUnlocked ? (
                  <Lock size={12} />
                ) : (
                  <CheckCircle size={12} color="var(--green-neon)" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StartScreen;
