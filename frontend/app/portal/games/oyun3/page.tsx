"use client";
import React, { useState, useEffect } from "react";
import { PortalSidebar } from "@/components/PortalSidebar";
import { useRouter } from "next/navigation";
import { ExpandSidebarIcon } from '@/components/icons/ExpandSidebarIcon';

const sampleParagraphs = [
  {
    text: ["Ali sabah ", "____", " kalktı ve hemen dişlerini ", "____", "."],
    blanks: ["erken", "fırçaladı"],
    options: ["fırçaladı", "geç", "erken", "oynadı"],
    length: 'short',
  },
  {
    text: ["Ayşe okuldan sonra ", "____", " yaptı ve annesine ", "____", "."],
    blanks: ["ödev", "yardım etti"],
    options: ["yardım etti", "ödev", "koştu", "yemek"],
    length: 'medium',
  },
  {
    text: ["Bir gün Elif ve kardeşi parka gitmek için hazırlandılar. Elif annesine ", "____", " giydi ve kardeşiyle birlikte dışarı çıktı. Parkta ", "____", " oynadılar ve çok eğlendiler."],
    blanks: ["montunu", "salıncakta"],
    options: ["salıncakta", "montunu", "kitap", "koştu"],
    length: 'long',
  },
];

const TIMER_OPTIONS = [30, 60, 90, 120];
const LENGTH_OPTIONS = [
  { label: 'Kısa', value: 'short' },
  { label: 'Orta', value: 'medium' },
  { label: 'Uzun', value: 'long' },
];

export default function Oyun3Page() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [current, setCurrent] = useState(0);
  const [filled, setFilled] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [timer, setTimer] = useState(90);
  const [length, setLength] = useState<'short'|'medium'|'long'>('medium');
  const [filteredParagraphs, setFilteredParagraphs] = useState(sampleParagraphs);
  const [timeLeft, setTimeLeft] = useState(timer);

  useEffect(() => {
    const saved = localStorage.getItem('oyun3_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.timer) setTimer(parsed.timer);
        if (parsed.length) setLength(parsed.length);
      } catch {}
    }
  }, []);

  useEffect(() => {
    // Filter paragraphs by selected length
    const filtered = sampleParagraphs.filter(p => p.length === length);
    setFilteredParagraphs(filtered.length > 0 ? filtered : sampleParagraphs);
    setCurrent(0);
    setFilled([]);
    setTimeLeft(timer);
  }, [length, timer]);

  useEffect(() => {
    setTimeLeft(timer);
  }, [timer]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setFeedback('Süre doldu!');
    }
  }, [timeLeft]);

  const paragraph = filteredParagraphs[current] || filteredParagraphs[0];

  const handleOptionClick = (word: string) => {
    if (filled.length >= paragraph.blanks.length) return;
    const correct = paragraph.blanks[filled.length] === word;
    if (correct) {
      setFilled([...filled, word]);
      if (filled.length + 1 === paragraph.blanks.length) {
        setTimeout(() => {
          setFilled([]);
          setCurrent((prev) => (prev + 1) % filteredParagraphs.length);
        }, 1200);
      }
    } else {
      setFeedback("Tekrar dene!");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'var(--light-blue-bg)'}}>
      <PortalSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      {!sidebarOpen && (
        <button
          className="sidebar-expand-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Menüyü Aç"
        >
          <ExpandSidebarIcon />
        </button>
      )}
      {/* Sayaç ve ayar gösterimi */}
      <div style={{position:'absolute',top:24,right:40,zIndex:10,background:'#fffbe6',borderRadius:12,padding:'10px 24px',fontWeight:800,fontSize:18,boxShadow:'0 2px 8px #ffd600',color:'#2c3e50',display:'flex',alignItems:'center',gap:18}}>
        <span>⏰ {timeLeft} sn</span>
        <span>Metin: {length === 'short' ? 'Kısa' : length === 'medium' ? 'Orta' : 'Uzun'}</span>
      </div>
      <main style={{flex:1,padding:'40px 0 0 0',minHeight:'100vh',background:'var(--light-blue-bg)'}}>
        <div style={{maxWidth:700,margin:'0 auto',padding:'0 24px',position:'relative'}}>
          <h1 style={{fontWeight:900,fontSize:'2rem',color:'var(--dark-text)',marginBottom:24,display:'flex',alignItems:'center',gap:16}}>
            Boşluk Doldurma Oyunu
          </h1>
          <div style={{maxWidth:700,margin:'0 auto',padding:'0 24px'}}>
            <h1 style={{fontWeight:900,fontSize:'2rem',color:'var(--dark-text)',marginBottom:24}}>Boşluk Doldurma Oyunu</h1>
            <div style={{fontSize:20,marginBottom:24}}>
              {paragraph.text.map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i < paragraph.blanks.length && (
                    <span style={{
                      display:'inline-block',
                      minWidth:70,
                      borderBottom:'2px solid #e0b97d',
                      margin:'0 6px',
                      color: filled[i] ? '#27ae60' : '#e67e22',
                      fontWeight:700
                    }}>
                      {filled[i] || '____'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:24}}>
              {paragraph.options.map((word, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(word)}
                  disabled={filled.includes(word)}
                  style={{
                    background: filled.includes(word) ? '#eee' : 'var(--primary-yellow)',
                    color: filled.includes(word) ? '#aaa' : '#2c3e50',
                    border:'none',
                    borderRadius:12,
                    padding:'12px 24px',
                    fontWeight:800,
                    fontSize:17,
                    cursor: filled.includes(word) ? 'not-allowed' : 'pointer',
                    boxShadow:'0 2px 8px #ffd600',
                    transition:'all 0.2s'
                  }}
                >
                  {word}
                </button>
              ))}
            </div>
            {feedback && (
              <div style={{color:'#e74c3c',fontWeight:700,fontSize:18,marginBottom:16}}>{feedback}</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 