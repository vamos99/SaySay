'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '../utils/supabaseClient';
import { CustomFamilyIcon, CustomSparkleIcon, AIBrainIcon, CustomChartIcon, GameIcon, ChildIcon } from '../components/icons/CustomIcons';

// Feature Card Component
const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div style={{
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(139, 92, 246, 0.1)'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-8px)';
    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
  }}>
    <div style={{
      width: '2.5rem',
      height: '2.5rem',
      background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem'
    }}>
      <Icon size={24} />
    </div>
    <h3 style={{
      fontSize: '1.125rem',
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: '0.5rem',
      color: '#1f2937'
    }}>
      {title}
    </h3>
    <p style={{
      fontSize: '0.875rem',
      textAlign: 'center',
      color: '#6b7280',
      lineHeight: '1.5'
    }}>
      {description}
    </p>
  </div>
);

export default function RegisterPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [showFeatures, setShowFeatures] = useState(false);
  
  // Form state'leri
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthYear: new Date().getFullYear() - 30, // Varsayılan ebeveyn yaşı
    gender: 'female',
    theme: '',
    avatar: '',
    isLiterate: false,
    wantsTTS: true
  });
  
  // Veritabanı verileri
  const [themes, setThemes] = useState<{ name: string }[]>([]);
  const [avatars, setAvatars] = useState<{ name: string, image_url: string }[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.replace('/portal');
    }
    // Show features after a short delay
    const timer = setTimeout(() => setShowFeatures(true), 500);
    return () => clearTimeout(timer);
  }, [user, loading, router]);

  // Veritabanı verilerini yükle
  useEffect(() => {
    const loadData = async () => {
      // Temaları yükle
      const { data: themesData } = await supabase.from('themes').select('name');
      if (themesData) {
        setThemes(themesData);
        setFormData(prev => ({ ...prev, theme: themesData[0]?.name || '' }));
      }

      // Avatar'ları yükle
      const { data: avatarsData } = await supabase.from('avatars').select('name, image_url');
      if (avatarsData) {
        setAvatars(avatarsData);
        setFormData(prev => ({ ...prev, avatar: avatarsData[0]?.image_url || '' }));
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Şifreler eşleşmiyor');
      return;
    }

    if (formData.password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      return;
    }

    // Kayıt işlemi burada yapılacak

  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #faf5ff, #ffffff, #fef3c7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '2px solid #8b5cf6',
          borderTop: '2px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div style={{
      height: '100vh',
      background: 'linear-gradient(to bottom right, #faf5ff, #ffffff, #fef3c7)',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", cursive'
    }}>
      {/* Floating Elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '50px',
        height: '50px',
        background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
        borderRadius: '50%',
        opacity: '0.1',
        animation: 'float 7s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '15%',
        width: '40px',
        height: '40px',
        background: 'linear-gradient(45deg, #f59e0b, #10b981)',
        borderRadius: '50%',
        opacity: '0.1',
        animation: 'float 6s ease-in-out infinite reverse'
      }}></div>

      {/* Main Content - Single Page */}
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
          {/* Left Side - Features */}
          <div style={{
            opacity: showFeatures ? 1 : 0,
            transform: showFeatures ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease',
            height: '100%',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              width: '100%'
            }}>
              <FeatureCard 
                icon={AIBrainIcon}
                title="Kişiselleştirilmiş Öğrenme"
                description="Her çocuğun benzersiz öğrenme stilini keşfedin."
              />
              <FeatureCard 
                icon={CustomChartIcon}
                title="Detaylı Gelişim Takibi"
                description="Çocuğunuzun ilerlemesini görsel grafiklerle takip edin."
              />
              <FeatureCard 
                icon={GameIcon}
                title="Eğlenceli Oyunlar"
                description="Eğitici oyunlarla öğrenmeyi eğlenceli hale getirin."
              />
              <FeatureCard 
                icon={CustomSparkleIcon}
                title="Yapay Zeka Desteği"
                description="AI destekli öneriler ve kişiselleştirilmiş deneyimler."
              />
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            height: '100%',
            alignItems: 'center'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '28rem',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              position: 'relative',
              overflow: 'hidden',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}>
              {/* Background decoration */}
              <div style={{
                position: 'absolute',
                top: '-3rem',
                right: '-3rem',
                width: '12rem',
                height: '12rem',
                background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                borderRadius: '50%',
                opacity: '0.05'
              }}></div>
              
              <div style={{
                position: 'absolute',
                bottom: '-2rem',
                left: '-2rem',
                width: '6rem',
                height: '6rem',
                background: 'linear-gradient(45deg, #f59e0b, #10b981)',
                borderRadius: '50%',
                opacity: '0.05'
              }}></div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  textAlign: 'center',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    background: 'linear-gradient(45deg, #8b5cf6, #ec4899)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <CustomFamilyIcon size={24} />
                  </div>
                  <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Aile Hesabı Oluştur
                  </h1>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.875rem'
                  }}>
                    Çocuğunuzun eğitim yolculuğuna başlayın
                  </p>
                </div>

                {error && (
                  <div style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    textAlign: 'center',
                    fontSize: '0.875rem'
                  }}>
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        transition: 'border-color 0.2s ease'
                      }}
                      placeholder="Adınız ve soyadınız"
                      required
                    />
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      E-posta
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        transition: 'border-color 0.2s ease'
                      }}
                      placeholder="ornek@email.com"
                      required
                    />
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Şifre
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        transition: 'border-color 0.2s ease'
                      }}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Şifre Tekrar
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        transition: 'border-color 0.2s ease'
                      }}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {/* Çocuk Bilgileri */}
                  <div style={{
                    background: 'rgba(139, 92, 246, 0.05)',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    marginBottom: '1rem',
                    border: '1px solid rgba(139, 92, 246, 0.1)'
                  }}>
                    <h3 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: '#8b5cf6',
                      marginBottom: '0.75rem',
                      textAlign: 'center'
                    }}>
                      <ChildIcon size={16} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                      İlk Çocuğunuzun Bilgileri
                    </h3>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.25rem',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '0.875rem'
                      }}>
                        Doğum Yılı
                      </label>
                      <select
                        value={formData.birthYear}
                        onChange={(e) => handleInputChange('birthYear', parseInt(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '0.5rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem',
                          transition: 'border-color 0.2s ease'
                        }}
                      >
                        {Array.from({ length: 18 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{
                        display: 'block',
                        marginBottom: '0.25rem',
                        fontWeight: '500',
                        color: '#374151',
                        fontSize: '0.875rem'
                      }}>
                        Cinsiyet
                      </label>
                      <div style={{
                        display: 'flex',
                        gap: '1rem'
                      }}>
                        {[
                          { value: 'female', label: 'Kız', color: '#ec4899' },
                          { value: 'male', label: 'Erkek', color: '#3b82f6' }
                        ].map(gender => (
                          <label key={gender.value} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                          }}>
                            <input
                              type="radio"
                              name="gender"
                              value={gender.value}
                              checked={formData.gender === gender.value}
                              onChange={(e) => handleInputChange('gender', e.target.value)}
                              style={{ margin: 0 }}
                            />
                            <span style={{ color: gender.color, fontWeight: '500' }}>
                              {gender.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {themes.length > 0 && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <label style={{
                          display: 'block',
                          marginBottom: '0.25rem',
                          fontWeight: '500',
                          color: '#374151',
                          fontSize: '0.875rem'
                        }}>
                          Tema
                        </label>
                        <select
                          value={formData.theme}
                          onChange={(e) => handleInputChange('theme', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.5rem',
                            fontSize: '0.875rem',
                            transition: 'border-color 0.2s ease'
                          }}
                        >
                          {themes.map(theme => (
                            <option key={theme.name} value={theme.name}>{theme.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}>
                        <input
                          type="checkbox"
                          checked={formData.isLiterate}
                          onChange={(e) => handleInputChange('isLiterate', e.target.checked)}
                          style={{ margin: 0 }}
                        />
                        <span style={{ fontWeight: '500', color: '#374151' }}>
                          Çocuğum okuma yazma biliyor
                        </span>
                      </label>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem'
                      }}>
                        <input
                          type="checkbox"
                          checked={formData.wantsTTS}
                          onChange={(e) => handleInputChange('wantsTTS', e.target.checked)}
                          style={{ margin: 0 }}
                        />
                        <span style={{ fontWeight: '500', color: '#374151' }}>
                          Sesli okuma özelliğini kullanmak istiyoruz
                        </span>
                      </label>
            </div>
            </div>
                  
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      background: 'linear-gradient(to right, #8b5cf6, #ec4899)',
                      color: 'white',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      fontSize: '1rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 6px rgba(139, 92, 246, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 8px 15px rgba(139, 92, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(139, 92, 246, 0.2)';
                    }}
                  >
                    Hesap Oluştur
                  </button>
                </form>
                
                <div style={{
                  textAlign: 'center',
                  marginTop: '1rem',
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>
                  Zaten hesabınız var mı?{' '}
                  <a href="/login" style={{
                    color: '#8b5cf6',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}>
                    Giriş yapın
                  </a>
            </div>
            </div>
            </div>
          </div>
          </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}