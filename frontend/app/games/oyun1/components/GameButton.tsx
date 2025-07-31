import React from 'react';

interface GameButtonProps {
  imageUrl: string;
  altText: string;
  isCorrect: boolean;
  onClick: () => void;
  feedback: 'dogru' | 'yanlis' | null;
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
    padding: '0',
    borderRadius: '16px',
    border: '3px solid #e0b97d',
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: 'scale(1)',
    boxShadow: '0 4px 16px rgba(224, 185, 125, 0.3)',
    position: 'relative' as const,
    overflow: 'hidden' as const
  };

  const imageStyles = {
    width: '240px',
    height: '240px',
    objectFit: 'cover' as const,
    borderRadius: '12px',
    transition: 'all 0.3s ease'
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.boxShadow = '0 8px 24px rgba(224, 185, 125, 0.4)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 4px 16px rgba(224, 185, 125, 0.3)';
  };

  return (
    <div
      style={buttonStyles}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${altText} seçeneği`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <img
        src={imageUrl}
        alt={altText}
        style={imageStyles}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    </div>
  );
}; 