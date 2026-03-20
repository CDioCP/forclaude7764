import React from 'react';
import { X, Check } from 'lucide-react';

const FEATURES = [
  'Unlock Tiers B1, B2 & C1',
  'Unlimited Hearts — never game over',
  'Ad-free experience',
];

const PremiumModal = ({ onClose, onSubscribe }) => {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.82)',
      backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem',
      animation: 'fadeIn 0.25s ease'
    }}>
      <div style={{
        background: 'linear-gradient(160deg, #0D0820 0%, #1A0535 100%)',
        padding: '2rem',
        borderRadius: '20px',
        border: '4px solid #ff00ff',
        boxShadow: '0 0 60px rgba(255,0,255,0.3), 0 20px 60px rgba(0,0,0,0.8)',
        maxWidth: 380,
        width: '100%',
        position: 'relative',
        textAlign: 'center'
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '1rem', right: '1rem',
            background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px', color: '#fff', cursor: 'pointer',
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>

        {/* LTD tag */}
        <div style={{
          display: 'inline-block',
          background: '#ff00ff', color: '#000',
          fontWeight: 900, fontSize: '0.78rem', letterSpacing: '1.5px',
          padding: '4px 14px', borderRadius: '4px',
          marginBottom: '1rem', textTransform: 'uppercase'
        }}>
          LTD OFFER: 1 MONTH FREE
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: 'var(--font-heading)', fontWeight: 900,
          fontSize: '1.6rem', color: '#fff', margin: '0 0 0.5rem',
          textTransform: 'uppercase', letterSpacing: '1px'
        }}>
          Premium Engine
        </h2>

        {/* Price */}
        <p style={{ margin: '0 0 0.4rem', lineHeight: 1 }}>
          <span style={{ fontSize: '3.2rem', fontFamily: 'var(--font-heading)', fontWeight: 900, color: '#fff' }}>
            $1.99
          </span>
          <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/mo</span>
        </p>

        {/* Due today */}
        <p style={{
          color: '#00f7ff', fontWeight: 800, fontSize: '1.1rem',
          margin: '0 0 1.25rem',
          textShadow: '0 0 12px rgba(0,247,255,0.6)'
        }}>
          $0.00 DUE TODAY — 30 DAY TRIAL
        </p>

        {/* Features */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px', padding: '1rem',
          marginBottom: '1.25rem', textAlign: 'left'
        }}>
          {FEATURES.map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              marginBottom: i < FEATURES.length - 1 ? '0.65rem' : 0,
              fontSize: '0.88rem', color: '#fff'
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: '6px', flexShrink: 0,
                background: 'rgba(255,0,255,0.15)',
                border: '1px solid rgba(255,0,255,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Check size={13} color="#ff00ff" strokeWidth={3} />
              </div>
              {f}
            </div>
          ))}
        </div>

        {/* CTA button */}
        <button
          onClick={onSubscribe}
          style={{
            width: '100%', padding: '1.1rem',
            background: '#ff00ff', color: '#000',
            fontFamily: 'var(--font-heading)', fontWeight: 900,
            fontSize: '1.2rem', letterSpacing: '0.5px',
            border: 'none', borderRadius: '12px', cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(255,0,255,0.55)',
            transition: 'all 0.2s ease',
            marginBottom: '0.75rem',
            textTransform: 'uppercase'
          }}
          onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 10px 36px rgba(255,0,255,0.75)'; }}
          onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(255,0,255,0.55)'; }}
        >
          Start My Free Month
        </button>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', margin: 0, lineHeight: 1.5 }}>
          No charge today. Subscription starts after 30 days. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default PremiumModal;
