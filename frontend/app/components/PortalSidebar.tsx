"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon } from '@/components/icons/HomeIcon';
import { ChildIcon } from '@/components/icons/ChildIcon';
import { GameIcon } from '@/components/icons/GameIcon';
import { ReportIcon } from '@/components/icons/ReportIcon';
import { SettingsIcon } from '@/components/icons/SettingsIcon';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { SunIcon } from '@/components/icons/SunIcon';
import { MoonIcon } from '@/components/icons/MoonIcon';
import { ExpandSidebarIcon } from '@/components/icons/ExpandSidebarIcon';

const links = [
  { href: "/portal", label: "Ana Sayfa", icon: <HomeIcon /> },
  { href: "/portal/children", label: "Çocuklarım", icon: <ChildIcon /> },
  { href: "/portal/games", label: "Oyun Ayarları", icon: <GameIcon /> },
  { href: "/portal/reports", label: "Raporlar", icon: <ReportIcon /> },
  { href: "/portal/settings", label: "Ayarlar", icon: <SettingsIcon /> },
];

export const PortalSidebar: React.FC<{open: boolean, setOpen: (v: boolean) => void}> = ({open, setOpen}) => {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Tema tercihini localStorage'dan al
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

  return (
    <aside className={"portal-sidebar" + (open ? " open" : " closed") + (isDark ? " dark" : "") }>
      <div className="sidebar-header">
        <div className="sidebar-title logo">SAY SAY</div>
        {open && (
          <button className="sidebar-hamburger sidebar-close" onClick={() => setOpen(false)} aria-label="Menüyü Kapat">
            <CloseIcon />
          </button>
        )}
      </div>
      <nav className="sidebar-links">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={
              "sidebar-link" + (pathname === l.href ? " active" : "")
            }
          >
            <span>{l.icon}</span>
            {open && l.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button className="sidebar-theme-toggle" onClick={() => setIsDark(d => !d)} title="Tema değiştir">
          {isDark ? <SunIcon /> : <MoonIcon />}
          {open && <span style={{marginLeft:8, fontWeight:600}}>{isDark ? 'Gündüz Modu' : 'Gece Modu'}</span>}
        </button>
      </div>
    </aside>
  );
}; 