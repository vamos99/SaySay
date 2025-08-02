"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PortalLayout } from "@/components/layout/PortalLayout";

const TIMER_OPTIONS = [30, 60, 90, 120];
const LENGTH_OPTIONS = [
  { label: 'Kısa', value: 'short' },
  { label: 'Orta', value: 'medium' },
  { label: 'Uzun', value: 'long' },
];

export default function Oyun3SettingsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [timer, setTimer] = useState(90);
  const [length, setLength] = useState<'short'|'medium'|'long'>('medium');
  const [wantTTS, setWantTTS] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('oyun3_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.timer) setTimer(parsed.timer);
        if (parsed.length) setLength(parsed.length);
        if (parsed.wantTTS !== undefined) setWantTTS(parsed.wantTTS);
      } catch {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('oyun3_settings', JSON.stringify({ timer, length, wantTTS }));
    router.push('/portal/games/oyun3');
  };

  return (
    <PortalLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
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
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Header Section */}
          <div style={{
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 'bold',
              marginBottom: '1rem',
              background: 'linear-gradient(to right, #2563eb, #7c3aed, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Oyun Ayarları
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Oyun deneyimini kişiselleştirin ve tercihlerinizi ayarlayın
            </p>
          </div>

          {/* Settings Card */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.1)',
            marginBottom: '2rem'
          }}>
            {/* Timer Settings */}
            <div style={{
              marginBottom: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>⏱️ Süre Ayarları</h3>
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap'
              }}>
                {TIMER_OPTIONS.map(opt => (
                  <button 
                    key={opt} 
                    onClick={() => setTimer(opt)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      border: timer === opt ? '2px solid #3b82f6' : '1px solid rgba(59, 130, 246, 0.2)',
                      background: timer === opt ? 'linear-gradient(to right, #3b82f6, #2563eb)' : 'rgba(255, 255, 255, 0.8)',
                      color: timer === opt ? 'white' : '#1f2937',
                      fontWeight: timer === opt ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '0.875rem'
                    }}
                    onMouseEnter={(e) => {
                      if (timer !== opt) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (timer !== opt) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {opt} saniye
                  </button>
                ))}
              </div>
            </div>

            {/* Length Settings */}
            <div style={{
              marginBottom: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>📝 Metin Uzunluğu</h3>
              <div style={{
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap'
              }}>
                {LENGTH_OPTIONS.map(opt => (
                  <button 
                    key={opt.value} 
                    onClick={() => setLength(opt.value as any)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '0.5rem',
                      border: length === opt.value ? '2px solid #10b981' : '1px solid rgba(16, 185, 129, 0.2)',
                      background: length === opt.value ? 'linear-gradient(to right, #10b981, #059669)' : 'rgba(255, 255, 255, 0.8)',
                      color: length === opt.value ? 'white' : '#1f2937',
                      fontWeight: length === opt.value ? '600' : '500',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '0.875rem'
                    }}
                    onMouseEnter={(e) => {
                      if (length !== opt.value) {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (length !== opt.value) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TTS Settings */}
            <div style={{
              marginBottom: '2rem'
            }}>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>🔊 Ses Ayarları</h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '0.5rem',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <input
                    type="checkbox"
                    id="tts-toggle"
                    checked={wantTTS}
                    onChange={(e) => setWantTTS(e.target.checked)}
                    style={{
                      width: '1.2rem',
                      height: '1.2rem',
                      accentColor: '#f59e0b'
                    }}
                  />
                  <label htmlFor="tts-toggle" style={{
                    fontSize: '1rem',
                    color: '#1f2937',
                    cursor: 'pointer'
                  }}>
                    Metni sesli okuma (TTS)
                  </label>
                </div>
                <span style={{
                  fontSize: '0.875rem',
                  color: '#6b7280'
                }}>
                  Sorular otomatik olarak sesli okunur
                </span>
              </div>
            </div>

            {/* Save Button */}
            <button 
              onClick={handleSave}
              style={{
                width: '100%',
                background: 'linear-gradient(to right, #f59e0b, #d97706)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                padding: '1rem 2rem',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginTop: '1rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(245, 158, 11, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              💾 Kaydet ve Geri Dön
            </button>
          </div>
        </div>
    </PortalLayout>
  );
} 