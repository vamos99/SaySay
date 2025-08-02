"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../utils/supabaseClient";
import { ChildPortalIcon } from '../icons/ChildPortalIcon';

const links = [
  { 
    href: "/portal", 
    label: "Ana Sayfa", 
    icon: (color: string) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={color}/>
      </svg>
    )
  },
  { 
    href: "/portal/children", 
    label: "Çocuklarım", 
    icon: (color: string) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill={color}/>
      </svg>
    )
  },
  { 
    href: "/portal/games", 
    label: "Oyun Ayarları", 
    icon: (color: string) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill={color}/>
      </svg>
    )
  },
  { 
    href: "/portal/raporlar", 
    label: "Raporlar", 
    icon: (color: string) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" fill={color}/>
      </svg>
    )
  },
  { 
    href: "/portal/settings", 
    label: "Ayarlar", 
    icon: (color: string) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" fill={color}/>
      </svg>
    )
  },
];

export const PortalSidebar: React.FC<{ open: boolean; setOpen: (v: boolean) => void }> = ({ open, setOpen }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Çıkış yaparken hata oluştu:", error.message);
      return;
    }
    router.push("/login");
  };

  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      width: '80px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRight: '1px solid rgba(59, 130, 246, 0.1)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", cursive'
    }}>
      {/* Header - Sadece Logo */}
      <div style={{
        padding: '1.5rem 0.5rem',
        borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #2563eb, #7c3aed, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          transform: 'rotate(180deg)',
          letterSpacing: '0.1em'
        }}>
          SAY SAY
        </div>
      </div>

      {/* Navigation Links - Sadece İkonlar */}
      <nav style={{
        flex: 1,
        padding: '1rem 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              textDecoration: 'none',
              color: pathname === link.href ? '#3b82f6' : '#6b7280',
              background: pathname === link.href ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
              border: pathname === link.href ? '2px solid rgba(59, 130, 246, 0.3)' : '2px solid transparent',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              if (pathname !== link.href) {
                e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)';
                e.currentTarget.style.color = '#3b82f6';
                e.currentTarget.style.transform = 'scale(1.1)';
              }
            }}
            onMouseLeave={(e) => {
              if (pathname !== link.href) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#6b7280';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
            title={link.label}
          >
            <span style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '24px',
              height: '24px'
            }}>
              {link.icon(pathname === link.href ? '#3b82f6' : '#6b7280')}
            </span>
            
            {/* Tooltip */}
            <div style={{
              position: 'absolute',
              left: '100%',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(0, 0, 0, 0.8)',
              color: 'white',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              whiteSpace: 'nowrap',
              opacity: 0,
              pointerEvents: 'none',
              transition: 'opacity 0.3s ease',
              marginLeft: '0.5rem',
              zIndex: 1001
            }}>
              {link.label}
            </div>
          </Link>
        ))}
        
        {/* Çocuk Portalı Butonu */}
        <button
          onClick={() => {
            localStorage.setItem('user_type', 'child');
            window.location.href = '/child-dashboard';
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: 'rgba(236, 72, 153, 0.1)',
            border: '2px solid rgba(236, 72, 153, 0.2)',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            color: '#ec4899',
            marginTop: '0.5rem',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(236, 72, 153, 0.2)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(236, 72, 153, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title="Çocuk Portalı"
        >
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px'
          }}>
            <ChildPortalIcon style={{ 
              width: '24px', 
              height: '24px'
            }} />
          </span>
          
          {/* Tooltip */}
          <div style={{
            position: 'absolute',
            left: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            opacity: 0,
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease',
            marginLeft: '0.5rem',
            zIndex: 1001
          }}>
            Çocuk Portalı
          </div>
        </button>
      </nav>

      {/* Bottom Section - Sadece Çıkış Butonu */}
      <div style={{
        padding: '1rem 0.5rem',
        borderTop: '1px solid rgba(59, 130, 246, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {/* Çıkış Butonu */}
        <button
          onClick={handleSignOut}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          title="Çıkış Yap"
        >
          <span style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '24px',
            height: '24px'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2z" fill="white"/>
            </svg>
          </span>
          
          {/* Tooltip */}
          <div style={{
            position: 'absolute',
            left: '100%',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            opacity: 0,
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease',
            marginLeft: '0.5rem',
            zIndex: 1001
          }}>
            Çıkış Yap
          </div>
        </button>
      </div>
    </aside>
  );
};
