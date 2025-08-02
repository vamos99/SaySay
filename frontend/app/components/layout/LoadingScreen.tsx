"use client";
import React from 'react';

interface LoadingScreenProps {
  text?: string;
  size?: 'small' | 'medium' | 'large';
  showSubtext?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  text = 'Yükleniyor...', 
  size = 'medium',
  showSubtext = true 
}) => {
  const spinnerSizes = {
    small: '2rem',
    medium: '3rem',
    large: '4rem'
  };

  const textSizes = {
    small: '0.875rem',
    medium: '1rem',
    large: '1.25rem'
  };

  const subtextSizes = {
    small: '0.75rem',
    medium: '0.875rem',
    large: '1rem'
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", cursive'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        padding: size === 'large' ? '3rem' : size === 'small' ? '1.5rem' : '2rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: spinnerSizes[size],
          height: spinnerSizes[size],
          border: '3px solid rgba(59, 130, 246, 0.3)',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem'
        }}></div>
        <p style={{ 
          color: '#6b7280', 
          fontSize: textSizes[size],
          margin: 0
        }}>
          {text}
        </p>
        {showSubtext && (
          <p style={{ 
            color: '#9ca3af', 
            fontSize: subtextSizes[size], 
            marginTop: '0.5rem',
            margin: 0
          }}>
            Lütfen bekleyin
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen; 