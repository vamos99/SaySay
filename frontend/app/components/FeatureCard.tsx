import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  color: string;
  description: string;
  iconBgColor: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, color, description, iconBgColor }) => (
  <div className="feature-card">
    <div className="feature-card-inner">
      <div className="feature-card-front" style={{ backgroundColor: color }}>
        <div className="icon" style={{ backgroundColor: iconBgColor }}>{icon}</div>
        <h3>{title}</h3>
      </div>
      <div className="feature-card-back" style={{ backgroundColor: color, color: 'var(--dark-text)'}}>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
    </div>
  </div>
); 