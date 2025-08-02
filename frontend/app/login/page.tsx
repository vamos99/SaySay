'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useRouter } from 'next/navigation';
import { CustomLightbulbIcon, CustomBookIcon, CustomSparkleIcon, ChildIcon } from '../components/icons/CustomIcons';

// Did You Know Card Component
const DidYouKnowCard = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  
  const facts = [
    {
      text: "Çocuklar günde ortalama 400 soru sorar!",
      icon: ChildIcon,
      color: "#3b82f6"
    },
    {
      text: "3-6 yaş arası çocuklar günde 12,000 kelime duyar!",
      icon: CustomBookIcon,
      color: "#8b5cf6"
    },
    {
      text: "Oyun oynarken öğrenme %40 daha etkili!",
      icon: CustomSparkleIcon,
      color: "#f59e0b"
    },
    {
      text: "Çocuklar 2 yaşından itibaren teknolojiyi anlayabilir!",
      icon: CustomLightbulbIcon,
      color: "#10b981"
    },
    {
      text: "Her çocuk benzersiz öğrenme hızına sahiptir!",
      icon: ChildIcon,
      color: "#ec4899"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    }, 3000); // 3 saniyede bir değiş

    return () => clearInterval(interval);
  }, [facts.length]);

  const currentFact = facts[currentFactIndex];
  const IconComponent = currentFact.icon;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderRadius: '1.5rem',
      padding: '1.5rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.1)',
      position: 'relative',
      overflow: 'hidden',
      height: 'fit-content',
      transition: 'all 0.5s ease'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-2rem',
        right: '-2rem',
        width: '8rem',
        height: '8rem',
        background: `linear-gradient(45deg, ${currentFact.color}, ${currentFact.color}80)`,
        borderRadius: '50%',
        opacity: '0.1',
        transition: 'all 0.5s ease'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-1rem',
        left: '-1rem',
        width: '4rem',
        height: '4rem',
        background: `linear-gradient(45deg, ${currentFact.color}80, ${currentFact.color}40)`,
        borderRadius: '50%',
        opacity: '0.1',
        transition: 'all 0.5s ease'
      }}></div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          background: `linear-gradient(45deg, ${currentFact.color}, ${currentFact.color}80)`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          transition: 'all 0.5s ease'
        }}>
          <IconComponent size={24} />
        </div>
        
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '1rem',
          color: '#1f2937'
        }}>
          Biliyor muydunuz?
        </h3>
        
        <p style={{
          fontSize: '1rem',
          textAlign: 'center',
          color: '#4b5563',
          lineHeight: '1.6',
          marginBottom: '1.5rem',
          minHeight: '3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {currentFact.text}
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          {facts.map((_, index) => (
            <div
              key={index}
              style={{
                width: '0.5rem',
                height: '0.5rem',
                background: index === currentFactIndex ? currentFact.color : '#d1d5db',
                borderRadius: '50%',
                transition: 'all 0.3s ease',
                transform: index === currentFactIndex ? 'scale(1.2)' : 'scale(1)'
              }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      router.replace('/portal');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await login(email, password);
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        background: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #faf5ff)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          border: '2px solid #3b82f6',
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
      background: 'linear-gradient(to bottom right, #eff6ff, #ffffff, #faf5ff)',
      overflow: 'hidden',
      position: 'relative',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", cursive'
    }}>
      {/* Floating Elements */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '5%',
        width: '40px',
        height: '40px',
        background: 'linear-gradient(45deg, #3b82f6, #7c3aed)',
        borderRadius: '50%',
        opacity: '0.1',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        width: '50px',
        height: '50px',
        background: 'linear-gradient(45deg, #ec4899, #f59e0b)',
        borderRadius: '50%',
        opacity: '0.1',
        animation: 'float 8s ease-in-out infinite reverse'
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
          maxWidth: '1000px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '2rem',
          alignItems: 'center'
        }}>
          {/* Left Side - Did You Know Card */}
          <div style={{ display: 'block' }}>
            <DidYouKnowCard />
          </div>
          
          {/* Right Side - Login Form */}
          <div style={{
            display: 'flex',
            justifyContent: 'center'
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
              overflow: 'hidden'
            }}>
              {/* Background decoration */}
              <div style={{
                position: 'absolute',
                top: '-2rem',
                right: '-2rem',
                width: '6rem',
                height: '6rem',
                background: 'linear-gradient(45deg, #3b82f6, #7c3aed)',
                borderRadius: '50%',
                opacity: '0.05'
              }}></div>
              
              <div style={{
                position: 'absolute',
                bottom: '-1rem',
                left: '-1rem',
                width: '3rem',
                height: '3rem',
                background: 'linear-gradient(45deg, #ec4899, #f59e0b)',
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
                    background: 'linear-gradient(45deg, #3b82f6, #7c3aed)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <CustomBookIcon size={24} />
                  </div>
                  <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Giriş Yap
                  </h1>
                  <p style={{
                    color: '#6b7280',
                    fontSize: '0.875rem'
                  }}>
                    Hesabınıza giriş yapın
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
                    fontSize: '0.875rem',
                    textAlign: 'center'
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
                      E-posta
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        transition: 'border-color 0.2s ease'
                      }}
                      placeholder="ornek@email.com"
                    />
                  </div>
                  
                  <div style={{ marginBottom: '1.5rem' }}>
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        transition: 'border-color 0.2s ease'
                      }}
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      width: '100%',
                      background: isSubmitting ? '#9ca3af' : 'linear-gradient(to right, #3b82f6, #7c3aed)',
                      color: 'white',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      fontSize: '1rem',
                      border: 'none',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)',
                      opacity: isSubmitting ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 8px 15px rgba(59, 130, 246, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubmitting) {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.2)';
                      }
                    }}
                  >
                    {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                  </button>
                </form>
                
                <div style={{
                  textAlign: 'center',
                  marginTop: '1rem',
                  color: '#6b7280',
                  fontSize: '0.875rem'
                }}>
                  Hesabınız yok mu?{' '}
                  <a href="/register" style={{
                    color: '#3b82f6',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}>
                    Kayıt olun
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