import React from 'react';
import { useRouter } from 'next/navigation';

interface PortalCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export const PortalCard: React.FC<PortalCardProps> = ({ title, description, icon, href, color }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(href);
  };

  return (
    <div 
      onClick={handleClick}
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Background gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
        opacity: 0.5,
        transition: 'opacity 0.3s ease'
      }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Icon */}
        <div style={{ marginBottom: '1rem' }}>
          {icon}
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: '#1f2937',
          margin: '0 0 0.5rem 0',
          lineHeight: '1.3'
        }}>
          {title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '0.875rem',
          color: '#6b7280',
          margin: 0,
          lineHeight: '1.5'
        }}>
          {description}
        </p>

        {/* Arrow indicator */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          width: '1.5rem',
          height: '1.5rem',
          background: `linear-gradient(45deg, ${color}, ${color}80)`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.7,
          transition: 'all 0.3s ease'
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}; 