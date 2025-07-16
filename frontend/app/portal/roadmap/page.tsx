"use client";
import React, { useEffect, useState } from 'react';
import { PortalSidebar } from '@/components/PortalSidebar';
import { useRouter } from 'next/navigation';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../utils/AuthContext';
import { AnimatedBubbles } from '../components/AnimatedBubbles';
import LoadingScreen from '@/components/LoadingScreen';
import { ExpandSidebarIcon } from '@/components/icons/ExpandSidebarIcon';

export default function RoadmapPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [plan, setPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useAuth();
  const [childId, setChildId] = useState<string | null>(null);
  // --- loading ekranı için state'ler ---
  const [progress, setProgress] = useState(20);
  const MOTIVATION = [
    'Her çocuk bir dünyadır! 🌍',
    'Birlikte öğrenmek çok eğlenceli! 🎈',
    'Güvenli ve mutlu bir gelişim için buradayız!',
    'Her gün yeni bir keşif! 🚀',
    'Oyunla öğren, sevgiyle büyü! 💛',
    'Hayal gücünün sınırı yok!',
    'Senin için en iyisi hazırlanıyor...'
  ];
  const [motivation, setMotivation] = useState(MOTIVATION[0]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Kategorileri çek
      const { data: cats } = await supabase.from('categories').select('id, name, default_verb');
      setCategories(cats || []);
      // Çocuğu bul
      if (user?.id) {
        const { data: children } = await supabase.from('children').select('id');
        if (children && children.length > 0) {
          setChildId(children[0].id);
          // Roadmap'i çek
          const { data: roadmap } = await supabase.from('concept_roadmap').select('concepts_order').eq('child_id', children[0].id).single();
          if (roadmap && roadmap.concepts_order) {
            // concepts_order: [category_id, ...]
            setPlan((cats || []).filter((c:any) => roadmap.concepts_order.includes(c.id)));
            setCategories((cats || []).filter((c:any) => !roadmap.concepts_order.includes(c.id)));
          }
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p < 98 ? p + Math.floor(Math.random() * 3) + 1 : p));
    }, 350);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMotivation(MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)]);
  }, []);

  const handleAdd = async (cat: any) => {
    if (!childId) return;
    const newPlan = [...plan, cat];
    setPlan(newPlan);
    setCategories(categories.filter(c => c.id !== cat.id));
    // DB'ye yaz
    await supabase.from('concept_roadmap').upsert([
      {
        child_id: childId,
        concepts_order: newPlan.map((c: any) => Number(c.id))
      }
    ], { onConflict: 'child_id' });
  };
  const handleRemove = async (cat: any) => {
    if (!childId) return;
    const newPlan = plan.filter((c: any) => c.id !== cat.id);
    setPlan(newPlan);
    setCategories([...categories, cat]);
    // DB'ye yaz
    await supabase.from('concept_roadmap').upsert([
      {
        child_id: childId,
        concepts_order: newPlan.map((c: any) => Number(c.id))
      }
    ], { onConflict: 'child_id' });
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app-portal-root" style={{position:'relative', overflow:'visible', zIndex:1}}>
      {!sidebarOpen && (
        <button
          className="sidebar-hamburger-fixed"
          style={{position:'fixed',top:18,left:18,zIndex:999,background:'none',border:'none',padding:0,display:'block'}}
          aria-label="Menüyü Aç"
          onClick={()=>setSidebarOpen(true)}
        >
          <ExpandSidebarIcon />
        </button>
      )}
      <PortalSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <main className="portal-main-content" style={{paddingTop: 0}}>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#2c3e50", marginBottom: 12 }}>Kavram Oyunu Öğrenme Yolu</h1>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start', marginTop: 24 }}>
          {/* Sol: Tüm kavramlar */}
          <div style={{ background: '#f8c9d3', borderRadius: 18, padding: 24, minWidth: 220, minHeight: 320, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: 0, fontWeight: 700, color: '#2c3e50' }}>Tüm Kavramlar</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0 0' }}>
              {categories.map(cat => (
                <li key={cat.id} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{cat.name}</span>
                  <button className="btn-submit" style={{ background: '#4CAF50', color: '#fff', padding: '4px 10px', fontSize: 13, borderRadius: 6 }} onClick={() => handleAdd(cat)}>Ekle</button>
                </li>
              ))}
            </ul>
          </div>
          {/* Sağ: Öğrenme Planı */}
          <div style={{ background: '#bde6d3', borderRadius: 18, padding: 24, minWidth: 320, minHeight: 320, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: 0, fontWeight: 700, color: '#2c3e50' }}>Öğrenme Planı</h3>
            {plan.length === 0 && <div style={{ color: '#7b8fa1', marginTop: 16 }}>Henüz kavram eklenmedi.</div>}
            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0 0' }}>
              {plan.map(cat => (
                <li key={cat.id} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{cat.name}</span>
                  <button className="btn-submit" style={{ background: '#E57373', color: '#fff', padding: '4px 10px', fontSize: 13, borderRadius: 6 }} onClick={() => handleRemove(cat)}>Çıkar</button>
                </li>
              ))}
            </ul>
            {plan.length > 0 && <button className="btn-submit" style={{ marginTop: 24, background: '#ffd600', color: '#2c3e50', fontWeight: 700, borderRadius: 8 }} onClick={()=>router.push('/portal')}>Kaydet ve Geri Dön</button>}
          </div>
        </div>
      </main>
    </div>
  );
} 