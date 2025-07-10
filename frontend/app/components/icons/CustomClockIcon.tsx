import React from 'react';
const CustomClockIcon: React.FC = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="12" fill="#bde6d3" stroke="#6fc7b2" strokeWidth="2"/>
    <rect x="15" y="10" width="2" height="7" rx="1" fill="#6fc7b2"/>
    <rect x="16" y="16" width="6" height="2" rx="1" fill="#6fc7b2" transform="rotate(45 16 16)"/>
  </svg>
);
export default CustomClockIcon; 