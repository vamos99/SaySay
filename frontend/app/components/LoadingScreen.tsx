"use client";
import React, { useEffect, useState } from "react";

const MOTIVATION = [
  'Her çocuk bir dünyadır! 🌍',
  'Birlikte öğrenmek çok eğlenceli! 🎈',
  'Güvenli ve mutlu bir gelişim için buradayız!',
  'Her gün yeni bir keşif! 🚀',
  'Oyunla öğren, sevgiyle büyü! 💛',
  'Hayal gücünün sınırı yok!',
  'Senin için en iyisi hazırlanıyor...'
];

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface LoadingScreenProps {
  text?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ text }) => {
  const [progress, setProgress] = useState(20);
  const [motivation, setMotivation] = useState(MOTIVATION[0]);
  const [bubbles, setBubbles] = useState<any[]>([]);

  useEffect(() => {
    setMotivation(MOTIVATION[getRandomInt(0, MOTIVATION.length - 1)]);
    setBubbles(Array.from({ length: 3 }).map((_, i) => {
      const size = getRandomInt(40, 90);
      const top = getRandomInt(20, 70);
      const left = getRandomInt(10, 80);
      const color = ['#f8c9d3', '#ffe6b3', '#e0b97d'][i];
      const opacity = 0.10 + 0.08 * i;
      const anim = `bubble${i + 1} ${(4 + i)}s infinite alternate`;
      return { size, top, left, color, opacity, anim, i };
    }));
    const interval = setInterval(() => {
      setProgress((p) => (p < 98 ? p + getRandomInt(1, 3) : p));
    }, 350);
    return () => clearInterval(interval);
  }, []);

  const bubbleEls = bubbles.map(({ size, top, left, color, opacity, anim, i }) => (
    <div key={i} style={{ position: 'absolute', top: `${top}%`, left: `${left}%`, opacity, animation: anim, zIndex: 0 }}>
      <svg width={size} height={size}><circle cx={size / 2} cy={size / 2} r={size / 2 - 3} fill={color} /></svg>
    </div>
  ));

  const ChildFaceSVG = (
    <svg width="120" height="120" viewBox="0 0 120 120" style={{ display: 'block' }}>
      <circle cx="60" cy="60" r="56" fill="#ffe6b3" stroke="#e0b97d" strokeWidth="4" />
      <ellipse cx="60" cy="80" rx="32" ry="18" fill="#fff" />
      <ellipse cx="60" cy="80" rx="18" ry="10" fill="#f9d7a0" />
      <ellipse cx="42" cy="60" rx="7" ry="9" fill="#fff" />
      <ellipse cx="78" cy="60" rx="7" ry="9" fill="#fff" />
      <ellipse cx="42" cy="62" rx="3.5" ry="4.5" fill="#5a6a78" />
      <ellipse cx="78" cy="62" rx="3.5" ry="4.5" fill="#5a6a78" />
      <ellipse cx="60" cy="92" rx="7" ry="3.5" fill="#e0b97d" />
      <path d="M50 50 Q60 40 70 50" stroke="#e0b97d" strokeWidth="3" fill="none" />
      <path d="M48 90 Q60 100 72 90" stroke="#e0b97d" strokeWidth="2" fill="none" />
      <ellipse cx="35" cy="48" rx="7" ry="4" fill="#e0b97d" opacity="0.18" />
      <ellipse cx="85" cy="48" rx="7" ry="4" fill="#e0b97d" opacity="0.18" />
      <ellipse cx="60" cy="30" rx="18" ry="10" fill="#e0b97d" opacity="0.18" />
    </svg>
  );

  const OrbitSVG = (
    <svg width="180" height="180" style={{ position: 'absolute', top: -30, left: -30, animation: 'orbit 3.5s linear infinite', zIndex: 2 }}>
      <g transform="rotate(0 90 90)">
        <circle cx="90" cy="30" r="18" fill="#ffe6b3" stroke="#e0b97d" strokeWidth="2" />
        <ellipse cx="90" cy="25" rx="5" ry="3" fill="#fff" opacity="0.7" />
        <circle cx="82" cy="28" r="3" fill="#e0b97d" />
        <circle cx="98" cy="28" r="3" fill="#e0b97d" />
      </g>
      <g transform="rotate(120 90 90)">
        <ellipse cx="90" cy="30" rx="10" ry="16" fill="#e0b97d" stroke="#e0b97d" strokeWidth="2" />
        <rect x="87" y="46" width="6" height="8" rx="2" fill="#5a6a78" />
        <path d="M90 54 Q92 58 94 54" stroke="#5a6a78" strokeWidth="2" fill="none" />
      </g>
      <g transform="rotate(240 90 90)">
        <rect x="80" y="18" width="20" height="20" rx="5" fill="#fff6e0" stroke="#e0b97d" strokeWidth="2" />
        <circle cx="90" cy="18" r="4" fill="#fff" stroke="#5a6a78" strokeWidth="1" />
        <circle cx="100" cy="28" r="4" fill="#fff" stroke="#5a6a78" strokeWidth="1" />
      </g>
    </svg>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'linear-gradient(135deg,#fffef7 60%,#ffe6b3 100%)', position: 'relative', overflow: 'hidden' }}>
      {bubbleEls}
      <div style={{ position: 'relative', width: 120, height: 120, marginBottom: 24, zIndex: 2 }}>
        {ChildFaceSVG}
        {OrbitSVG}
      </div>
      <div style={{ fontWeight: 800, fontSize: '1.4rem', color: '#e74c3c', marginBottom: 8, letterSpacing: 1, zIndex: 1 }}>{text || 'SaySay Yükleniyor...'}</div>
      <div style={{ width: 240, height: 16, background: '#e0b97d', borderRadius: 10, overflow: 'hidden', marginBottom: 12, boxShadow: '0 2px 8px #ffe6b3', zIndex: 1 }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg,#ffe6b3 0%,#e0b97d 100%)', transition: 'width 0.7s', borderRadius: 10 }}></div>
      </div>
      <div style={{ color: '#2c3e50', fontSize: '1.05rem', fontWeight: 700, marginBottom: 4, zIndex: 1 }}>{progress < 100 ? `Veriler hazırlanıyor... %${progress}` : 'Hazır!'}</div>
      <div style={{ color: '#5a6a78', fontSize: '0.95rem', zIndex: 1 }}>{motivation}</div>
      <style>{`
        @keyframes orbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes bubble1 {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-30px) scale(1.08); }
        }
        @keyframes bubble2 {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(24px) scale(1.12); }
        }
        @keyframes bubble3 {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-18px) scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen; 