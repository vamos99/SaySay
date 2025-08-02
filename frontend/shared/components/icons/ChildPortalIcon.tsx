import React from 'react';

export const ChildPortalIcon: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={style}>
    {/* Portal/Geçiş simgesi */}
    <rect x="4" y="8" width="16" height="8" rx="2" fill="currentColor" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 12 L16 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 8 L12 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    {/* Çocuk simgesi */}
    <circle cx="12" cy="4" r="2" fill="currentColor" stroke="currentColor" strokeWidth="1"/>
  </svg>
); 