import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../utils/firebaseConfig';
import LegalPages from './LegalPages';

export default function LoginScreen() {
  const [currentView, setCurrentView] = useState('login');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      alert("Failed to sign in: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (currentView !== 'login') {
    return <LegalPages page={currentView} onBack={() => setCurrentView('login')} />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      animation: 'fadeIn 0.4s ease',
      textAlign: 'center'
    }}>

      {/* Logo */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          className="neon-text"
          style={{
            fontSize: '2.8rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 900,
            margin: '0 0 0.4rem',
            lineHeight: 1.1
          }}
        >
          Vocab Memory Quest
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
          Master English · Train Your Memory
        </p>
      </div>

      {/* Login card */}
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: 380,
        padding: '2rem',
        marginBottom: '1.25rem',
        borderColor: 'rgba(139, 92, 246, 0.3)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(139,92,246,0.15)'
      }}>
        {/* Brain icon */}
        <div style={{
          width: 68, height: 68, borderRadius: '18px', margin: '0 auto 1.25rem',
          background: 'linear-gradient(135deg, #7C3AED, #BE185D)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(124,58,237,0.5)',
          fontSize: '2rem'
        }}>
          🧠
        </div>

        <h2 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 800,
          fontSize: '1.25rem', margin: '0 0 0.35rem', color: '#fff'
        }}>
          Sign in to play
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '0 0 1.75rem' }}>
          Save your progress and unlock your vocabulary bank.
        </p>

        {/* Google sign-in button — prominent */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            borderRadius: '14px',
            background: loading ? '#e0e0e0' : '#ffffff',
            color: '#1a1a2e',
            fontWeight: 800,
            fontSize: '1rem',
            fontFamily: 'var(--font-heading)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.85rem',
            border: '2px solid rgba(255,255,255,0.9)',
            boxShadow: '0 6px 24px rgba(0,0,0,0.4), 0 0 0 2px rgba(139,92,246,0.3)',
            cursor: loading ? 'wait' : 'pointer',
            transition: 'all 0.2s ease',
            letterSpacing: '0.2px'
          }}
          onMouseOver={e => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 10px 32px rgba(0,0,0,0.5), 0 0 0 2px rgba(139,92,246,0.6)';
            }
          }}
          onMouseOut={e => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.4), 0 0 0 2px rgba(139,92,246,0.3)';
          }}
        >
          {/* Google G logo */}
          <svg width="22" height="22" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {loading ? 'Signing in…' : 'Continue with Google'}
        </button>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '1rem 0 0' }}>
          Creating an account is free — no credit card required.
        </p>
      </div>

      {/* Pricing summary */}
      <div style={{
        width: '100%', maxWidth: 380,
        background: 'rgba(139, 92, 246, 0.07)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        borderRadius: '14px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>🆓 Free</span>
            <span style={{ color: '#fff', fontWeight: 600 }}>A1 & A2 · 3 Hearts</span>
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--gold-vivid)', fontWeight: 700 }}>⭐ Pro — 30-day free trial</span>
            <span style={{ color: 'var(--text-muted)' }}>then $1.99/mo</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            B1, B2, C1 · Unlimited Hearts
          </div>
        </div>
      </div>

      {/* Legal footer */}
      <footer style={{
        display: 'flex', flexDirection: 'column', gap: '0.6rem',
        alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          {['terms', 'privacy', 'refund'].map(page => (
            <button
              key={page}
              onClick={() => setCurrentView(page)}
              style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline', padding: 0, fontSize: 'inherit' }}
            >
              {page === 'terms' ? 'Terms' : page === 'privacy' ? 'Privacy' : 'Refund'}
            </button>
          ))}
        </div>
        <a href="mailto:dionisio.carvajal@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
          dionisio.carvajal@gmail.com
        </a>
      </footer>
    </div>
  );
}
