"use client";

import React from "react";
import { PortalSidebar } from "./PortalSidebar";
import { ExpandSidebarIcon } from '../icons/CustomIcons';

interface PortalLayoutProps {
  children: React.ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const PortalLayout: React.FC<PortalLayoutProps> = ({ 
  children, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #faf5ff 100%)',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", cursive'
    }}>
      <PortalSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {!sidebarOpen && (
        <button
          className="sidebar-expand-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Menüyü Aç"
          style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '0.5rem',
            padding: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
          }}
        >
          <ExpandSidebarIcon />
        </button>
      )}

      <main style={{
        flex: 1,
        padding: '2rem',
        marginLeft: '100px',
        height: '100vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        {/* Floating Animated Elements */}
        <div style={{
          position: 'absolute',
          top: '8%',
          left: '8%',
          width: '50px',
          height: '50px',
          background: 'linear-gradient(45deg, #3b82f6, #7c3aed)',
          borderRadius: '50%',
          opacity: '0.1',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        
        <div style={{
          position: 'absolute',
          top: '15%',
          right: '12%',
          width: '35px',
          height: '35px',
          background: 'linear-gradient(45deg, #ec4899, #f59e0b)',
          borderRadius: '50%',
          opacity: '0.1',
          animation: 'float 8s ease-in-out infinite reverse'
        }}></div>

        <div style={{
          position: 'absolute',
          bottom: '25%',
          left: '15%',
          width: '40px',
          height: '40px',
          background: 'linear-gradient(45deg, #10b981, #3b82f6)',
          borderRadius: '50%',
          opacity: '0.1',
          animation: 'float 7s ease-in-out infinite'
        }}></div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          {children}
        </div>
      </main>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
}; 