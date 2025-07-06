import React from 'react';

interface HeaderProps {
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="app-header">
      <a href="#/" className="logo" onClick={() => onNavigate('/')}>
        SAY SAY
      </a>
      <nav className="nav-links">
        <a href="#/contact" onClick={() => onNavigate('/contact')}>İletişim</a>
        <a href="#/register" onClick={() => onNavigate('/register')}>Kayıt Ol</a>
        <a href="#/login" onClick={() => onNavigate('/login')}>Giriş</a>
      </nav>
    </header>
  );
}; 