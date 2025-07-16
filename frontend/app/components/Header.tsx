"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const pathname = usePathname();
  if (pathname && pathname.startsWith('/portal')) {
    return null;
  }
  return (
    <header
      className="app-header"
      style={{
        background: 'linear-gradient(90deg, #f8e9ee 0%, #e3f4fb 100%)',
        boxShadow: '0 1.5px 8px 0 rgba(0,0,0,0.03)',
        borderRadius: '0 0 14px 14px',
        padding: '6px 0 4px 0',
        marginBottom: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 38,
        height: 48,
      }}
    >
      <Link
        href="/"
        className="logo"
        style={{
          fontWeight: 900,
          fontSize: '1.18rem',
          color: '#2d2d2d',
          letterSpacing: 0.5,
          textShadow: '0 1px 2px #fff7',
          padding: '0 12px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.18)',
          transition: 'background 0.2s',
        }}
      >
        SAY SAY
      </Link>
      <nav className="nav-links" style={{ display: 'flex', gap: 10, paddingRight: 10 }}>
        <Link href="/contact" style={{ fontSize: '0.97rem', fontWeight: 600, color: '#2d2d2d', padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.18)', transition: 'background 0.2s', lineHeight: 1.1 }} onMouseOver={e => (e.currentTarget.style.background='#f8c9d3')} onMouseOut={e => (e.currentTarget.style.background='rgba(255,255,255,0.18)')}>İletişim</Link>
        <Link href="/register" style={{ fontSize: '0.97rem', fontWeight: 600, color: '#2d2d2d', padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.18)', transition: 'background 0.2s', lineHeight: 1.1 }} onMouseOver={e => (e.currentTarget.style.background='#a9dff5')} onMouseOut={e => (e.currentTarget.style.background='rgba(255,255,255,0.18)')}>Kayıt Ol</Link>
        <Link href="/login" style={{ fontSize: '0.97rem', fontWeight: 700, color: '#fff', background: '#a9dff5', padding: '4px 12px', borderRadius: 8, boxShadow: '0 1px 2px #a9dff533', transition: 'background 0.2s', lineHeight: 1.1 }} onMouseOver={e => (e.currentTarget.style.background='#7ecbe6')} onMouseOut={e => (e.currentTarget.style.background='#a9dff5')}>Giriş</Link>
      </nav>
    </header>
  );
};