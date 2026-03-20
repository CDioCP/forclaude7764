import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const Card = ({ content, type, isFlipped, isMatched, isMistake, onClick, disabled }) => {
  const backGradient = type === 'spanish'
    ? 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)'
    : 'linear-gradient(135deg, #881337 0%, #BE185D 100%)';

  const backBorder = type === 'spanish'
    ? 'rgba(139, 92, 246, 0.5)'
    : 'rgba(190, 24, 93, 0.5)';

  const backGlow = type === 'spanish'
    ? '0 4px 20px rgba(124, 58, 237, 0.5), 0 0 0 1px rgba(139, 92, 246, 0.2)'
    : '0 4px 20px rgba(190, 24, 93, 0.45), 0 0 0 1px rgba(236, 72, 153, 0.2)';

  const questionColor = type === 'spanish' ? '#C4B5FD' : '#F9A8D4';

  return (
    <div
      style={{
        perspective: '900px',
        height: '90px',
        opacity: isMatched ? 0 : 1,
        transition: 'opacity 0.5s ease 1.5s',
        pointerEvents: isMatched ? 'none' : 'auto'
      }}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 0 : 180 }}
        transition={{ duration: 0.38, ease: 'easeInOut' }}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          cursor: disabled ? 'default' : 'pointer'
        }}
        onClick={() => !disabled && onClick()}
        whileHover={!disabled && !isFlipped ? { scale: 1.06, y: -3 } : {}}
      >
        {/* Front face - content */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 4,
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '0.88rem',
          color: '#fff',
          textAlign: 'center',
          padding: '0.4rem',
          background: isMatched
            ? 'linear-gradient(135deg, rgba(0,200,100,0.25), rgba(0,255,136,0.15))'
            : isMistake
              ? 'linear-gradient(135deg, rgba(255,51,102,0.25), rgba(255,0,60,0.15))'
              : 'rgba(30, 20, 60, 0.92)',
          border: `1.5px solid ${isMatched ? 'var(--correct)' : isMistake ? 'var(--wrong)' : 'rgba(139, 92, 246, 0.25)'}`,
          boxShadow: isMatched
            ? '0 0 20px rgba(0,255,136,0.4), inset 0 0 20px rgba(0,255,136,0.05)'
            : isMistake
              ? '0 0 20px rgba(255,51,102,0.4), inset 0 0 20px rgba(255,51,102,0.05)'
              : '0 4px 16px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
          textShadow: isMatched ? '0 0 8px var(--green-neon)' : 'none'
        }}>
          <span style={{ lineHeight: 1.2 }}>{content}</span>
          {isMatched && <Check size={14} color="var(--correct)" strokeWidth={3} />}
          {isMistake && <X size={14} color="var(--wrong)" strokeWidth={3} />}
        </div>

        {/* Back face - cover */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 14,
          background: backGradient,
          border: `1.5px solid ${backBorder}`,
          boxShadow: backGlow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: '1.6rem',
            fontWeight: 900,
            color: questionColor,
            textShadow: `0 0 12px ${questionColor}`,
            opacity: 0.85
          }}>?</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Card;
