import React from 'react';

interface Game2CardProps {
  id: number;
  name: string;
  imageUrl: string;
  isSelected: boolean;
  onClick: () => void;
  type: 'object' | 'action';
}

export const Game2Card: React.FC<Game2CardProps> = ({
  id,
  name,
  imageUrl,
  isSelected,
  onClick,
  type
}) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: '120px',
        height: '140px',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: isSelected 
          ? '0 8px 25px rgba(224, 185, 125, 0.4)' 
          : '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: isSelected ? '3px solid #e0b97d' : '2px solid #ecf0f1',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isSelected ? 'scale(1.05)' : 'scale(1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '12px',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      {/* Seçim göstergesi */}
      {isSelected && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '20px',
          height: '20px',
          background: '#e0b97d',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          ✓
        </div>
      )}

      {/* Görsel */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '8px',
        background: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img
          src={imageUrl}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            // Görsel yüklenemezse placeholder göster
            e.currentTarget.style.display = 'none';
            e.currentTarget.parentElement!.innerHTML = `
              <div style="
                width: 100%; 
                height: 100%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                background: #e9ecef; 
                color: #6c757d; 
                font-size: 24px;
                font-weight: bold;
              ">
                ${type === 'object' ? '📦' : '🎯'}
              </div>
            `;
          }}
        />
      </div>

      {/* İsim */}
      <div style={{
        fontSize: '14px',
        fontWeight: 600,
        color: isSelected ? '#2c3e50' : '#7b8fa1',
        textAlign: 'center',
        lineHeight: '1.2',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {name}
      </div>
    </div>
  );
}; 