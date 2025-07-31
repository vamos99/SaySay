import React from 'react';

interface GameButtonProps {
  imageUrl: string;
  altText: string;
  isCorrect: boolean;
  onClick: () => void;
  feedback: string | null;
  optionOrder: number[];
  index: number;
}

export const GameButton: React.FC<GameButtonProps> = ({
  imageUrl,
  altText,
  isCorrect,
  onClick,
  feedback,
  optionOrder,
  index
}) => {
  const buttonStyles = {
    background: '#fff',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#e0b97d',
    borderRadius: 16,
    padding: '8px',
    width: '200px',
    height: '200px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '18px',
    boxShadow: '0 2px 12px #f0f0f0',
    color: '#2c3e50',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative' as const,
    overflow: 'hidden',
  };

  const imageStyles = {
    width: '190px',
    height: '190px',
    objectFit: 'cover' as const,
    transition: 'all 0.3s ease',
    borderRadius: '12px',
    border: '3px solid #e0b97d',
  };

  const getAnimationClass = () => {
    if (!feedback) return '';
    if (feedback === 'dogru' && isCorrect) return 'correctAnimation';
    if (feedback === 'yanlis' && !isCorrect) return 'wrongAnimation';
    return '';
  };

  return (
    <button
      id={`option-${index}`}
      name={`option-${index}`}
      aria-label={altText}
      style={{
        ...buttonStyles,
        ...(feedback === 'dogru' && isCorrect && {
          background: '#d4edda',
          borderColor: '#28a745',
          animation: 'correctPulse 0.6s ease-in-out'
        }),
        ...(feedback === 'yanlis' && !isCorrect && {
          background: '#f8d7da',
          borderColor: '#dc3545',
          animation: 'wrongShake 0.6s ease-in-out'
        })
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
        e.currentTarget.style.boxShadow = '0 4px 20px #d0d0d0';
        e.currentTarget.style.borderColor = '#d4af37';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 2px 12px #f0f0f0';
        e.currentTarget.style.borderColor = '#e0b97d';
      }}
      className={getAnimationClass()}
    >
      <img src={imageUrl} alt={altText} style={imageStyles} />
    </button>
  );
}; 