import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  color: string;
  iconBg?: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, color, iconBg, description }) => (
  <div
    className="feature-card"
    style={{
      borderRadius: 16,
      padding: 0,
      width: 210,
      height: 130,
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      margin: 0,
    }}
  >
    <div className="feature-card-inner" style={{ width: '100%', height: '100%' }}>
      <div
        className="feature-card-front"
        style={{
          backgroundColor: color,
          borderRadius: 16,
          padding: 0,
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          className="icon"
          style={{
            backgroundColor: iconBg || '#fff',
            borderRadius: '50%',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
            border: '1.2px solid rgba(0,0,0,0.06)',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 0,
          }}
        >
          {icon}
        </div>
        <h3 style={{ margin: '8px 0 0 0', fontSize: '1.05rem', fontWeight: 700, textAlign: 'center' }}>{title}</h3>
      </div>
      <div
        className="feature-card-back"
        style={{
          backgroundColor: color,
          color: 'var(--dark-text)',
          borderRadius: 16,
          padding: 0,
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 700, textAlign: 'center' }}>{title}</h4>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', textAlign: 'center' }}>{description}</p>
      </div>
    </div>
  </div>
); 