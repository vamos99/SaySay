import React from 'react';

const CustomSadChildIcon: React.FC = () => (
    <svg width="64" height="64" viewBox="0 0 120 120" style={{display:'block'}}>
      <circle cx="60" cy="60" r="56" fill="#f8c9d3" stroke="#e0b97d" strokeWidth="3" opacity="0.7"/>
      <ellipse cx="60" cy="80" rx="32" ry="18" fill="#fff" />
      <ellipse cx="60" cy="80" rx="18" ry="10" fill="#fdebe2" />
      <ellipse cx="42" cy="60" rx="7" ry="9" fill="#fff" />
      <ellipse cx="78" cy="60" rx="7" ry="9" fill="#fff" />
      <ellipse cx="42" cy="62" rx="3.5" ry="4.5" fill="#5a6a78" />
      <ellipse cx="78" cy="62" rx="3.5" ry="4.5" fill="#5a6a78" />
      {/* Sad mouth */}
      <path d="M48 95 Q60 85 72 95" stroke="#e0b97d" strokeWidth="3" fill="none" />
      {/* Tear */}
      <path d="M45 72 a 5 8 0 0 1 0 10 a 15 15 0 0 1 -5 -5z" fill="#a9dff5" opacity="0.8"/>
    </svg>
);

export default CustomSadChildIcon; 