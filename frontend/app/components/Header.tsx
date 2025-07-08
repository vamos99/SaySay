"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const pathname = usePathname();
  // Portal route'undaysak header'ı render etme
  if (pathname && pathname.startsWith('/portal')) {
    return null;
  }
  return (
    <header className="app-header">
      <Link href="/" className="logo">
        SAY SAY
      </Link>
      <nav className="nav-links">
        <Link href="/contact">İletişim</Link>
        <Link href="/register">Kayıt Ol</Link>
        <Link href="/login">Giriş</Link>
      </nav>
    </header>
  );
};