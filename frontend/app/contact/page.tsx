'use client';

import React, { FormEvent } from 'react';
import { supabase } from '../utils/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';
import { CustomMessageIcon, CustomLightbulbIcon, CustomSparkleIcon } from '../components/icons/CustomIcons';

export default function ContactPage() {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !subject || !message) {
      toast.error('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ name, email, subject, message }]);

      if (error) throw error;

      toast.success('Mesajınız başarıyla gönderildi!');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Mesaj gönderilirken bir hata oluştu');
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div style={{
        height: '100vh',
        background: 'linear-gradient(to bottom right, #f0f9ff, #ffffff, #fef3c7)',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: '"Comic Sans MS", "Chalkboard SE", "Arial Rounded MT Bold", cursive'
      }}>
        {/* Floating Elements */}
        <div style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '50px',
          height: '50px',
          background: 'linear-gradient(45deg, #3b82f6, #7c3aed)',
          borderRadius: '50%',
          opacity: '0.1',
          animation: 'float 6s ease-in-out infinite'
        }}></div>
        
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '15%',
          width: '40px',
          height: '40px',
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
            maxWidth: '800px',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '2rem',
            alignItems: 'center'
          }}>
            {/* Left Side - Info */}
            <div style={{
              textAlign: 'center'
            }}>
              <div style={{
                width: '3.5rem',
                height: '3.5rem',
                background: 'linear-gradient(45deg, #3b82f6, #7c3aed)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.5rem',
                boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
              }}>
                <CustomMessageIcon size={28} />
              </div>
              
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                İletişim
              </h1>
              
              <p style={{
                fontSize: '1rem',
                color: '#6b7280',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçin.
              </p>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    background: 'linear-gradient(45deg, #10b981, #059669)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CustomLightbulbIcon size={12} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>Teknik Destek</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>7/24 yardım</div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.8)',
                  borderRadius: '0.75rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{
                    width: '1.5rem',
                    height: '1.5rem',
                    background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CustomSparkleIcon size={12} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '0.875rem' }}>Öneriler</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Geliştirme önerileri</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div style={{
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
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  textAlign: 'center',
                  background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Mesaj Gönder
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="contact-name" style={{
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Adınız
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        transition: 'border-color 0.2s ease'
                      }}
                      placeholder="Adınız ve soyadınız"
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="contact-email" style={{
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
                      id="contact-email"
                      name="email"
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

                  <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="contact-subject" style={{
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Konu
                    </label>
                    <input
                      type="text"
                      id="contact-subject"
                      name="subject"
                      required
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        transition: 'border-color 0.2s ease'
                      }}
                      placeholder="Mesajınızın konusu"
                    />
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label htmlFor="contact-message" style={{
                      display: 'block',
                      marginBottom: '0.25rem',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.875rem'
                    }}>
                      Mesaj
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        transition: 'border-color 0.2s ease',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      background: 'linear-gradient(to right, #3b82f6, #7c3aed)',
                      color: 'white',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      fontSize: '1rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 8px 15px rgba(59, 130, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.2)';
                    }}
                  >
                    Gönder
                  </button>
                </form>
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
    </>
  );
}