"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";
import { HomeIcon } from '@/components/icons/HomeIcon';
import { ChildIcon } from '@/components/icons/ChildIcon';
import { GameIcon } from '@/components/icons/GameIcon';
import { ReportIcon } from '@/components/icons/ReportIcon';
import { SettingsIcon } from '@/components/icons/SettingsIcon';
import { ExitIcon } from '@/components/icons/ExitIcon';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { SunIcon } from '@/components/icons/SunIcon';
import { MoonIcon } from '@/components/icons/MoonIcon';
import { ExpandSidebarIcon } from '@/components/icons/ExpandSidebarIcon';
import { ChildPortalIcon } from '@/components/icons/ChildPortalIcon';

const links = [
  { href: "/portal",            label: "Ana Sayfa",    icon: <HomeIcon /> },
  { href: "/portal/children",   label: "Çocuklarım",   icon: <ChildIcon /> },
  { href: "/portal/games",      label: "Oyun Ayarları", icon: <GameIcon /> },
  { href: "/portal/raporlar",    label: "Raporlar",      icon: <ReportIcon /> },
  { href: "/portal/settings",   label: "Ayarlar",       icon: <SettingsIcon /> },
];

export const PortalSidebar: React.FC<{ open: boolean; setOpen: (v: boolean) => void }> = ({ open, setOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    if (theme === 'dark') setIsDark(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isDark) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }, [isDark]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Çıkış yaparken hata oluştu:", error.message);
      return;
    }
    router.push("/login");
  };

  return (
    <aside className={`portal-sidebar${open ? ' open' : ' closed'}${isDark ? ' dark' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-title logo">SAY SAY</div>
        {open ? (
          <button
            className="sidebar-hamburger sidebar-close"
            onClick={() => setOpen(false)}
            aria-label="Menüyü Kapat"
          >
            <CloseIcon />
          </button>
        ) : (
          <button
            className="sidebar-hamburger sidebar-open"
            onClick={() => setOpen(true)}
            aria-label="Menüyü Aç"
          >
            <ExpandSidebarIcon />
          </button>
        )}
      </div>

      <nav className="sidebar-links">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`sidebar-link${pathname === l.href ? ' active' : ''}`}
          >
            <span className="icon">{l.icon}</span>
            {open && <span className="label">{l.label}</span>}
          </Link>
        ))}
        
        {/* Çocuk Portalı Butonu - Ayarların altında */}
        <button
          onClick={() => {
            localStorage.setItem('user_type', 'child');
            window.location.href = '/child-dashboard';
          }}
          className="sidebar-link"
          style={{
            width: '100%',
            marginTop: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '12px 16px',
            borderRadius: '8px',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#2c3e50'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#ffe6b3';
            e.currentTarget.style.color = '#e74c3c';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#2c3e50';
          }}
        >
          <span className="icon">
            <ChildPortalIcon />
          </span>
          {open && <span className="label">Çocuk Portalı</span>}
        </button>
      </nav>

      <div className="sidebar-bottom">
        {/* Çıkış Butonu */}
        <button
          onClick={handleSignOut}
          className="sidebar-logout flex items-center px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mb-4"
        >
          <ExitIcon />
          {open && <span className="ml-2">Çıkış Yap</span>}
        </button>

        {/* Tema Değiştirici */}
        <button
          className="sidebar-theme-toggle flex items-center"
          onClick={() => setIsDark((d) => !d)}
          title="Tema değiştir"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
          {open && <span className="ml-2 theme-label">{isDark ? 'Gündüz Modu' : 'Gece Modu'}</span>}
        </button>
      </div>
    </aside>
  );
};
