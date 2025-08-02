"use client";
import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from 'next/navigation';
import { useAuth } from '../../utils/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { PortalLayout } from "@/components/layout/PortalLayout";

const SettingsPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);

  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    if (session?.user) {
      setUser(session.user);
      setEmail(session.user.email || "");
    }
  }, [session]);

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({ email });
      
      if (error) {
        setMessageType('error');
        setMessage(`E-posta güncelleme hatası: ${error.message}`);
      } else {
        setMessageType('success');
        setMessage("E-posta güncelleme isteği gönderildi. Lütfen e-postanızı kontrol edin.");
      }
    } catch (error) {
      setMessageType('error');
      setMessage("Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (newPassword !== confirmPassword) {
      setMessageType('error');
      setMessage("Yeni şifreler eşleşmiyor.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    if (newPassword.length < 6) {
      setMessageType('error');
      setMessage("Şifre en az 6 karakter olmalıdır.");
      setTimeout(() => setMessage(""), 3000);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      
      if (error) {
        setMessageType('error');
        setMessage(`Şifre güncelleme hatası: ${error.message}`);
      } else {
        setMessageType('success');
        setMessage("Şifreniz başarıyla güncellendi!");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setMessageType('error');
      setMessage("Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    if (!confirm("Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.")) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Önce çocukları sil
      const { error: childrenError } = await supabase
        .from('children')
        .delete()
        .eq('user_id', user.id);

      if (childrenError) {
        console.error('Çocuk silme hatası:', childrenError);
      }

      // Sonra kullanıcıyı sil
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      
      if (error) {
        setMessageType('error');
        setMessage(`Hesap silme hatası: ${error.message}`);
      } else {
        setMessageType('success');
        setMessage("Hesabınız silindi. Yönlendiriliyorsunuz...");
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (error) {
      setMessageType('error');
      setMessage("Beklenmeyen bir hata oluştu.");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  return (
    <Fragment>
      <PortalLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        
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
          zIndex: 1,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem'
        }}>
          {/* Header Section - Küçültülmüş */}
          <div style={{
            textAlign: 'center',
            marginBottom: '1.5rem'
          }}>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              background: 'linear-gradient(to right, #2563eb, #7c3aed, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Hesap Ayarları ⚙️
            </h1>
            <p style={{
              fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
              color: '#6b7280',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: '1.5'
            }}>
              Hesap bilgilerinizi güvenli bir şekilde yönetin
            </p>
          </div>

          {/* Message Display */}
          {message && (
            <div style={{
              background: messageType === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${messageType === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              borderRadius: '0.75rem',
              padding: '1rem',
              marginBottom: '2rem',
              color: messageType === 'success' ? '#059669' : '#dc2626',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{fontSize:'1.25rem'}}>
                {messageType === 'success' ? '✅' : '⚠️'}
              </span>
              {message}
            </div>
          )}

          {/* Settings Cards - Tek sayfa tasarımı */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '1.5rem',
            flex: 1,
            overflow: 'hidden'
          }}>
            {/* Email Settings */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              height: 'fit-content'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>📧 E-posta Adresi</h2>
              <form onSubmit={handleEmailUpdate} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div>
                  <label style={{
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}>E-posta Adresi</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(to right, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {loading ? 'Güncelleniyor...' : 'E-posta Güncelle'}
                </button>
              </form>
            </div>

            {/* Password Settings */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              height: 'fit-content'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '1rem'
              }}>🔒 Şifre Değiştir</h2>
              <form onSubmit={handlePasswordUpdate} style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem'
              }}>
                <div>
                  <label style={{
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}>Yeni Şifre</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)} 
                    placeholder="En az 6 karakter"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '0.5rem',
                    display: 'block'
                  }}>Şifre Tekrar</label>
                  <input 
                    type="password" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    placeholder="Şifrenizi tekrar girin"
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: '1px solid rgba(59, 130, 246, 0.2)',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    background: 'linear-gradient(to right, #10b981, #059669)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.5rem',
                    padding: '0.75rem 1.5rem',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    opacity: loading ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {loading ? 'Güncelleniyor...' : 'Şifre Güncelle'}
                </button>
              </form>
            </div>

            {/* Danger Zone */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.1)',
              height: 'fit-content'
            }}>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: '#dc2626',
                marginBottom: '1rem'
              }}>⚠️ Tehlikeli Bölge</h2>
              <p style={{
                color: '#6b7280',
                marginBottom: '1.5rem',
                lineHeight: '1.6'
              }}>
                Hesabınızı silmek geri alınamaz bir işlemdir. Tüm verileriniz kalıcı olarak silinecektir.
              </p>
              <button 
                onClick={handleDeleteAccount}
                disabled={loading}
                style={{
                  background: 'linear-gradient(to right, #ef4444, #dc2626)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: loading ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {loading ? 'İşleniyor...' : 'Hesabı Sil'}
              </button>
            </div>
          </div>
        </div>
      </PortalLayout>
    </Fragment>
  );
};

export default SettingsPage; 