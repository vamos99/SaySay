'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from './utils/AuthContext';
import { AIBrainIcon, CustomChartIcon, GameIcon, CustomFamilyIcon, CustomLightbulbIcon, CustomBookIcon, CustomSparkleIcon, SaySayLogoIcon } from './components/icons/CustomIcons';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #faf5ff)',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", cursive'
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

      {/* Rotating Boxes */}
      <div style={{
        position: 'absolute',
        top: '12%',
        right: '8%',
        width: '60px',
        height: '60px',
        border: '3px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '12px',
        animation: 'rotate 20s linear infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '18%',
        right: '20%',
        width: '45px',
        height: '45px',
        border: '3px solid rgba(139, 92, 246, 0.2)',
        borderRadius: '10px',
        animation: 'rotate 25s linear infinite reverse'
      }}></div>

      {/* Main Content - Two Column Layout */}
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          maxWidth: '1200px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          alignItems: 'center',
          height: '100%'
        }}>
          {/* Left Column - Hero Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            paddingRight: '1rem'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '1.5rem',
              gap: '1rem'
            }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(45deg, #3b82f6, #7c3aed)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 15px 35px rgba(59, 130, 246, 0.3)',
                animation: 'pulse 2s infinite'
              }}>
                <SaySayLogoIcon size={40} />
            </div>
              <h1 style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 'bold',
                margin: 0,
                background: 'linear-gradient(to right, #2563eb, #7c3aed, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
              }}>
                SaySay
              </h1>
            </div>
            
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
              fontWeight: '600',
              color: '#1f2937',
              marginBottom: '1rem',
              lineHeight: '1.2'
            }}>
              Çocuğunuzun sesini duyun, gelişimini destekleyin!
            </h2>
            
            <p style={{
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              color: '#4b5563',
              marginBottom: '1.5rem',
              lineHeight: '1.6',
              maxWidth: '500px'
            }}>
              Yapay zeka destekli eğitim platformu ile çocuğunuzun öğrenme yolculuğunu 
              takip edin ve kişiselleştirilmiş deneyimler sunun.
            </p>

            {/* Key Features - Compact */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  background: '#3b82f6',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px rgba(59, 130, 246, 0.5)'
                }}></div>
                <span style={{
                  fontSize: '1rem',
                  color: '#1f2937',
                  fontWeight: '500'
                }}>Yaşa uygun içerik ve AI destekli öğrenme</span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                <div style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  background: '#8b5cf6',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px rgba(139, 92, 246, 0.5)'
                }}></div>
                <span style={{
                  fontSize: '1rem',
                  color: '#1f2937',
                  fontWeight: '500'
                }}>Detaylı raporlama ve ebeveyn takibi</span>
        </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'rgba(236, 72, 153, 0.1)',
                borderRadius: '0.75rem',
                border: '1px solid rgba(236, 72, 153, 0.2)'
              }}>
                <div style={{
                  width: '0.75rem',
                  height: '0.75rem',
                  background: '#ec4899',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px rgba(236, 72, 153, 0.5)'
                }}></div>
                <span style={{
                  fontSize: '1rem',
                  color: '#1f2937',
                  fontWeight: '500'
                }}>Eğlenceli ve eğitici oyunlar</span>
              </div>
            </div>

            {/* Footer Info */}
            <div style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              marginTop: 'auto'
            }}>
              <p>Güvenli, eğitici ve eğlenceli çocuk gelişim platformu</p>
              <p style={{ marginTop: '0.25rem' }}>
                © 2025 SaySay - Çocukların geleceğini şekillendiriyoruz
              </p>
            </div>
          </div>

          {/* Right Column - Features Grid */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            paddingLeft: '1rem'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                height: 'fit-content'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  background: 'linear-gradient(to right, #3b82f6, #2563eb)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <AIBrainIcon size={28} />
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: '0.5rem',
                  color: '#1f2937'
                }}>
                  Yapay Zeka Destekli
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  color: '#6b7280',
                  lineHeight: '1.5'
                }}>
                  Kişiselleştirilmiş öğrenme deneyimleri
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(139, 92, 246, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                height: 'fit-content'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  background: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <CustomChartIcon size={28} />
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: '0.5rem',
                  color: '#1f2937'
                }}>
                  Detaylı Raporlama
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  color: '#6b7280',
                  lineHeight: '1.5'
                }}>
                  Çocuğunuzun gelişimini takip edin
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(236, 72, 153, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                height: 'fit-content'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  background: 'linear-gradient(to right, #ec4899, #db2777)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <GameIcon size={28} />
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: '0.5rem',
                  color: '#1f2937'
                }}>
                  Eğlenceli Oyunlar
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  color: '#6b7280',
                  lineHeight: '1.5'
                }}>
                  Yaşa uygun eğitici oyunlar
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                borderRadius: '1rem',
                padding: '1.5rem',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(16, 185, 129, 0.1)',
                position: 'relative',
                overflow: 'hidden',
                height: 'fit-content'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  background: 'linear-gradient(to right, #10b981, #059669)',
                  borderRadius: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}>
                  <CustomFamilyIcon size={28} />
                </div>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  marginBottom: '0.5rem',
                  color: '#1f2937'
                }}>
                  Aile Odaklı
                </h3>
                <p style={{
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  color: '#6b7280',
                  lineHeight: '1.5'
                }}>
                  Güvenli ve kontrollü ortam
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}