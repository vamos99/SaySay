// components/icons/ExitIcon.tsx
import React from 'react';

export function ExitIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="4"
        fill="#ffe6b3" stroke="#4b5f43" strokeWidth="2"/>
      <path d="M10 8 L14 12 L10 16"
        stroke="#4b5f43" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 12 H8"
        stroke="#4b5f43" strokeWidth="2"
        strokeLinecap="round"/>
    </svg>
  );
}
