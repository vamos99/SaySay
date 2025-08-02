'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../utils/AuthContext';

// View Models
interface HeaderViewModel {
  isMenuOpen: boolean;
  user: any;
  shouldShowHeader: boolean;
  handleMenuToggle: () => void;
  handleLogout: () => Promise<void>;
  handleMenuClose: () => void;
}

// Custom Hook - Business Logic
const useHeaderLogic = (): HeaderViewModel => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleMenuToggle = () => setIsMenuOpen(!isMenuOpen);
  const handleMenuClose = () => setIsMenuOpen(false);
  
  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  // Header'ı sadece belirli sayfalarda göster
  const shouldShowHeader = !pathname.startsWith('/portal') && 
                          !pathname.startsWith('/child-dashboard') && 
                          !pathname.startsWith('/games');

  return {
    isMenuOpen,
    user,
    shouldShowHeader,
    handleMenuToggle,
    handleLogout,
    handleMenuClose
  };
};

// Styles - Separation of Concerns
const headerStyles = {
  container: {
    backgroundColor: 'white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #f3f4f6',
    position: 'sticky' as const,
    top: 0,
    zIndex: 50
  },
  wrapper: {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '0 1rem'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '4rem'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none'
  },
  logoIcon: {
    width: '2.5rem',
    height: '2.5rem',
    background: 'linear-gradient(to bottom right, #3b82f6, #7c3aed)',
    borderRadius: '0.75rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '0.75rem',
    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
  },
  logoText: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(to right, #2563eb, #7c3aed)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  desktopNav: {
    display: 'flex',
    alignItems: 'center'
  },
  navLink: {
    color: '#374151',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.875rem',
    marginRight: '2rem',
    transition: 'color 0.2s ease'
  },
  primaryButton: {
    background: 'linear-gradient(to right, #3b82f6, #7c3aed)',
    color: 'white',
    padding: '0.5rem 1.5rem',
    borderRadius: '0.5rem',
    fontWeight: '500',
    fontSize: '0.875rem',
    textDecoration: 'none',
    marginRight: '1rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)'
  },
  logoutButton: {
    color: '#4b5563',
    background: 'none',
    border: 'none',
    fontWeight: '500',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'color 0.2s ease'
  },
  mobileMenuButton: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    width: '2rem',
    height: '2rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0'
  },
  hamburgerLine: {
    width: '1.5rem',
    height: '0.125rem',
    backgroundColor: '#374151',
    marginBottom: '0.25rem',
    transition: 'all 0.3s ease'
  },
  mobileMenu: {
    backgroundColor: 'white',
    borderTop: '1px solid #f3f4f6',
    padding: '1rem 0',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  mobileMenuContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem'
  },
  mobileLink: {
    color: '#374151',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.875rem',
    padding: '0.5rem 0',
    transition: 'color 0.2s ease'
  },
  mobileButtonGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    paddingTop: '0.5rem',
    borderTop: '1px solid #f3f4f6'
  },
  mobilePrimaryButton: {
    background: 'linear-gradient(to right, #3b82f6, #7c3aed)',
    color: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: '500',
    fontSize: '0.875rem',
    textDecoration: 'none',
    textAlign: 'center' as const,
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)'
  },
  mobileLogoutButton: {
    color: '#ef4444',
    background: 'none',
    border: '1px solid #ef4444',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    fontWeight: '500',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  mobileLoginButton: {
    color: '#374151',
    textDecoration: 'none',
    fontWeight: '500',
    fontSize: '0.875rem',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    transition: 'all 0.2s ease',
    textAlign: 'center' as const
  }
};

// Event Handlers - Separation of Concerns
const eventHandlers = {
  onNavLinkHover: (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = '#2563eb';
  },
  onNavLinkLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.color = '#374151';
  },
  onPrimaryButtonHover: (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.boxShadow = '0 8px 15px rgba(59, 130, 246, 0.3)';
  },
  onPrimaryButtonLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.2)';
  },
  onLogoutHover: (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = '#ef4444';
  },
  onLogoutLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.color = '#4b5563';
  },
  onMobileLogoutHover: (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#ef4444';
    e.currentTarget.style.color = 'white';
  },
  onMobileLogoutLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = '#ef4444';
  },
  onMobileLoginHover: (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = '#f3f4f6';
    e.currentTarget.style.borderColor = '#9ca3af';
  },
  onMobileLoginLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.borderColor = '#d1d5db';
  }
};

// Main Component - View Layer
export const ModernHeader: React.FC = () => {
  const { isMenuOpen, user, shouldShowHeader, handleMenuToggle, handleLogout, handleMenuClose } = useHeaderLogic();

  if (!shouldShowHeader) {
    return null;
  }

  return (
    <header style={headerStyles.container}>
      <div style={headerStyles.wrapper}>
        <div style={headerStyles.nav}>
          {/* Logo */}
          <Link href="/" style={headerStyles.logo}>
            <div style={headerStyles.logoIcon}>
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.25rem' }}>S</span>
            </div>
            <span style={headerStyles.logoText}>SaySay</span>
          </Link>

          {/* Desktop Navigation */}
          <nav style={headerStyles.desktopNav}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link 
                  href="/portal"
                  style={headerStyles.primaryButton}
                  onMouseEnter={eventHandlers.onPrimaryButtonHover}
                  onMouseLeave={eventHandlers.onPrimaryButtonLeave}
                >
                  Portal'a Git
                </Link>
                <button
                  onClick={handleLogout}
                  style={headerStyles.logoutButton}
                  onMouseEnter={eventHandlers.onLogoutHover}
                  onMouseLeave={eventHandlers.onLogoutLeave}
                >
                  Çıkış
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link 
                  href="/login"
                  style={headerStyles.navLink}
                  onMouseEnter={eventHandlers.onNavLinkHover}
                  onMouseLeave={eventHandlers.onNavLinkLeave}
                >
                  Giriş
                </Link>
                <Link 
                  href="/register"
                  style={headerStyles.primaryButton}
                  onMouseEnter={eventHandlers.onPrimaryButtonHover}
                  onMouseLeave={eventHandlers.onPrimaryButtonLeave}
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={handleMenuToggle} style={headerStyles.mobileMenuButton}>
            <span style={{
              ...headerStyles.hamburgerLine,
              transform: isMenuOpen ? 'rotate(45deg) translate(0.25rem, 0.25rem)' : 'none'
            }}></span>
            <span style={{
              ...headerStyles.hamburgerLine,
              opacity: isMenuOpen ? '0' : '1'
            }}></span>
            <span style={{
              ...headerStyles.hamburgerLine,
              marginBottom: '0',
              transform: isMenuOpen ? 'rotate(-45deg) translate(0.25rem, -0.25rem)' : 'none'
            }}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div style={headerStyles.mobileMenu}>
            <div style={headerStyles.mobileMenuContent}>
              <Link 
                href="/" 
                style={headerStyles.mobileLink}
                onMouseEnter={eventHandlers.onNavLinkHover}
                onMouseLeave={eventHandlers.onNavLinkLeave}
                onClick={handleMenuClose}
              >
                Ana Sayfa
              </Link>
              <Link 
                href="/contact" 
                style={headerStyles.mobileLink}
                onMouseEnter={eventHandlers.onNavLinkHover}
                onMouseLeave={eventHandlers.onNavLinkLeave}
                onClick={handleMenuClose}
              >
                İletişim
              </Link>
              
              {user ? (
                <div style={headerStyles.mobileButtonGroup}>
                  <Link 
                    href="/portal"
                    style={headerStyles.mobilePrimaryButton}
                    onMouseEnter={eventHandlers.onPrimaryButtonHover}
                    onMouseLeave={eventHandlers.onPrimaryButtonLeave}
                    onClick={handleMenuClose}
                  >
                    Portal'a Git
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      handleMenuClose();
                    }}
                    style={headerStyles.mobileLogoutButton}
                    onMouseEnter={eventHandlers.onMobileLogoutHover}
                    onMouseLeave={eventHandlers.onMobileLogoutLeave}
                  >
                    Çıkış
                  </button>
                </div>
              ) : (
                <div style={headerStyles.mobileButtonGroup}>
                  <Link 
                    href="/login"
                    style={headerStyles.mobileLoginButton}
                    onMouseEnter={eventHandlers.onMobileLoginHover}
                    onMouseLeave={eventHandlers.onMobileLoginLeave}
                    onClick={handleMenuClose}
                  >
                    Giriş
                  </Link>
                  <Link 
                    href="/register"
                    style={headerStyles.mobilePrimaryButton}
                    onMouseEnter={eventHandlers.onPrimaryButtonHover}
                    onMouseLeave={eventHandlers.onPrimaryButtonLeave}
                    onClick={handleMenuClose}
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}; 