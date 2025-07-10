import React from 'react';
import { ChildIcon } from '@/components/icons/ChildIcon';
import { GameIcon } from '@/components/icons/GameIcon';
import { ReportIcon } from '@/components/icons/ReportIcon';
import { useRouter } from 'next/navigation';

interface PortalCardProps {
  type: 'children' | 'game' | 'report';
  count?: number;
  onAddChild?: () => void;
}

export const PortalCard: React.FC<PortalCardProps> = ({ type, count, onAddChild }) => {
  const router = useRouter();
  if (type === 'children') {
    return (
      <div style={{ background: "#f8c9d3", borderRadius: 18, padding: 24, minWidth: 220, minHeight: 120, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", position: 'relative', zIndex: 1 }}>
        <h3 style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><ChildIcon />Çocuklarım</h3>
        <p style={{ margin: "8px 0 0 0" }}>{count} çocuk kayıtlı</p>
        <button className="btn-submit portal-btn" style={{ marginTop: 12, background: '#7b8fa1', color: '#fff' }} onClick={onAddChild}>
          + Çocuk Ekle
        </button>
      </div>
    );
  }
  if (type === 'game') {
    return (
      <div style={{ background: "#e6e6e6", borderRadius: 18, padding: 24, minWidth: 220, minHeight: 120, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", position: 'relative', zIndex: 1 }}>
        <h3 style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><GameIcon />Oyun Ayarları</h3>
        <p style={{ margin: "8px 0 0 0" }}>Kişiselleştir</p>
        <button className="btn-submit portal-btn" style={{ marginTop: 12, background: '#7b8fa1', color: '#fff' }} onClick={() => router.push('/portal/roadmap')}>
          Ayarları Düzenle
        </button>
      </div>
    );
  }
  if (type === 'report') {
    return (
      <div style={{ background: "#bde6d3", borderRadius: 18, padding: 24, minWidth: 220, minHeight: 120, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", position: 'relative', zIndex: 1 }}>
        <h3 style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}><ReportIcon />Raporlar</h3>
        <p style={{ margin: "8px 0 0 0" }}>Gelişim Grafikleri</p>
        <button className="btn-submit portal-btn" style={{ marginTop: 12, background: '#7b8fa1', color: '#fff' }}>
          Raporları Gör
        </button>
      </div>
    );
  }
  return null;
}; 