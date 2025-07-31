'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserType } from '../utils/UserTypeContext';
import { useAuth } from '../utils/AuthContext';
import { verifyChildPIN } from '../utils/pinUtils';

// PIN Modal bileşeni
const PINModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { selectedChildId } = useUserType();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Eğer selectedChildId yoksa localStorage'dan al
    let childId = selectedChildId;
    if (!childId) {
      childId = localStorage.getItem('selected_child_id');
    }

    if (!childId) {
      setError('Çocuk ID bulunamadı!');
      setIsLoading(false);
      return;
    }

    try {
      const isValid = await verifyChildPIN(childId, pin);
      if (isValid) {
        onSuccess();
      } else {
        setError('Yanlış PIN!');
      }
    } catch (error) {
      setError('PIN doğrulanırken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.18)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:22,padding:32,maxWidth:400}}>
        <h3 style={{fontWeight:900,fontSize:22,marginBottom:16,textAlign:'center'}}>PIN Girişi</h3>
        <form onSubmit={handleSubmit}>
          <div style={{marginBottom:16}}>
            <label style={{display:'block',marginBottom:8,fontWeight:700,color:'#2c3e50'}}>
              PIN Kodunu Girin
            </label>
            <input
              id="pin-input"
              name="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              style={{width:'100%',padding:'12px',border:'2px solid #ddd',borderRadius:8,fontSize:16}}
              placeholder="4 haneli PIN"
              maxLength={4}
              required
              aria-label="PIN kodu girişi"
            />
          </div>
          {error && (
            <div style={{color:'#e74c3c',fontSize:14,marginBottom:16,textAlign:'center'}}>{error}</div>
          )}
          <div style={{display:'flex',gap:12}}>
            <button
              type="button"
              onClick={onClose}
              style={{flex:1,padding:'12px',background:'#eee',color:'#333',borderRadius:12,fontWeight:800,border:'none',cursor:'pointer'}}
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{flex:1,padding:'12px',background:isLoading?'#ccc':'#3498db',color:'#fff',borderRadius:12,fontWeight:800,border:'none',cursor:'pointer'}}
            >
              {isLoading ? 'Kontrol...' : 'Giriş'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function ChildDashboard() {
  const router = useRouter();
  const { userType, selectedChildId, isLoading } = useUserType();
  const { user } = useAuth();
  const [showPINModal, setShowPINModal] = useState(false);

  // Eğer parent ise portal'a yönlendir
  React.useEffect(() => {
    if (!isLoading && userType === 'parent') {
      router.push('/portal');
    }
  }, [userType, isLoading, router]);

  // Loading durumu
  if (isLoading) {
    return (
      <div style={{display:'flex',minHeight:'100vh',alignItems:'center',justifyContent:'center',background:'var(--light-blue-bg)'}}>
        <div style={{textAlign:'center',color:'#2c3e50'}}>
          <div style={{fontSize:24,fontWeight:700,marginBottom:16}}>Yükleniyor...</div>
          <div style={{fontSize:16,color:'#7b8fa1'}}>Lütfen bekleyin</div>
        </div>
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa login'e yönlendir
  if (!user) {
    router.push('/login');
    return null;
  }

  // Çocuk değilse portal'a yönlendir
  if (userType !== 'child') {
    router.push('/portal');
    return null;
  }

  const handleGameClick = (gamePath: string) => {
    console.log('Oyun tıklandı:', gamePath);
    // Direkt window.location kullan
    window.location.href = gamePath;
  };

  const handleSettingsClick = () => {
    setShowPINModal(true);
  };

  const handlePINSuccess = () => {
    setShowPINModal(false);
    localStorage.setItem('user_type', 'parent');
    window.location.href = '/portal';
  };

  return (
    <div style={{
      display:'flex',
      minHeight:'100vh',
      position:'relative',
      overflow:'hidden',
      background:'linear-gradient(-45deg, #667eea, #764ba2, #667eea, #764ba2)',
      backgroundSize:'400% 400%',
      animation:'gradientShift 8s ease infinite'
    }}>
      {/* Floating Bubbles */}
      <div style={{
        position:'absolute',
        width:60,
        height:60,
        background:'rgba(255,255,255,0.1)',
        borderRadius:'50%',
        top:'10%',
        left:'10%',
        animation:'floatingBubbles 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position:'absolute',
        width:60,
        height:60,
        background:'rgba(255,255,255,0.1)',
        borderRadius:'50%',
        top:'20%',
        right:'15%',
        animation:'floatingBubbles 6s ease-in-out infinite 2s'
      }}></div>
      <div style={{
        position:'absolute',
        width:60,
        height:60,
        background:'rgba(255,255,255,0.1)',
        borderRadius:'50%',
        bottom:'30%',
        left:'20%',
        animation:'floatingBubbles 6s ease-in-out infinite 4s'
      }}></div>
      
      <main style={{flex:1,padding:'40px 0 0 0',minHeight:'100vh',position:'relative',zIndex:1}}>
        <div style={{maxWidth:800,margin:'0 auto',padding:'0 24px',position:'relative'}}>
          {/* Hoş geldin mesajı */}
          <div style={{textAlign:'center',marginBottom:40}}>
            <h1 style={{
              fontWeight:900,
              fontSize:'2.5rem',
              color:'#fff',
              marginBottom:8,
              textShadow:'0 2px 4px rgba(0,0,0,0.3)',
              animation:'fadeInDown 1s ease-out'
            }}>
              Merhaba! 👋
            </h1>
            <p style={{
              color:'#fff',
              fontSize:18,
              opacity:0.9,
              animation:'fadeInUp 1s ease-out 0.3s both'
            }}>
              Hangi oyunu oynamak istiyorsun?
            </p>
          </div>
          
          {/* CSS Animasyonları */}
          <style jsx>{`
            @keyframes fadeInDown {
              from {
                opacity: 0;
                transform: translateY(-30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes float {
              0%, 100% {
                transform: translateY(0px);
              }
              50% {
                transform: translateY(-10px);
              }
            }
            
            @keyframes pulse {
              0%, 100% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.05);
              }
            }
            
            @keyframes shimmer {
              0% {
                background-position: -200px 0;
              }
              100% {
                background-position: calc(200px + 100%) 0;
              }
            }
            
            @keyframes gradientShift {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
            
            @keyframes floatingBubbles {
              0%, 100% {
                transform: translateY(0px) rotate(0deg);
              }
              25% {
                transform: translateY(-20px) rotate(90deg);
              }
              50% {
                transform: translateY(-10px) rotate(180deg);
              }
              75% {
                transform: translateY(-30px) rotate(270deg);
              }
            }
            
            .game-card {
              animation: fadeInUp 0.6s ease-out both;
            }
            
            .game-card:nth-child(1) { animation-delay: 0.1s; }
            .game-card:nth-child(2) { animation-delay: 0.2s; }
            .game-card:nth-child(3) { animation-delay: 0.3s; }
            
            .floating-icon {
              animation: float 3s ease-in-out infinite;
            }
            
            .pulse-icon {
              animation: pulse 2s ease-in-out infinite;
            }
            
            .shimmer-bg {
              background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
              background-size: 200px 100%;
              animation: shimmer 2s infinite;
            }
            
            .animated-bg {
              background: linear-gradient(-45deg, #667eea, #764ba2, #667eea, #764ba2);
              background-size: 400% 400%;
              animation: gradientShift 8s ease infinite;
            }
            
            .floating-bubble {
              position: absolute;
              width: 60px;
              height: 60px;
              background: rgba(255,255,255,0.1);
              border-radius: 50%;
              animation: floatingBubbles 6s ease-in-out infinite;
            }
            
            .bubble1 { top: 10%; left: 10%; animation-delay: 0s; }
            .bubble2 { top: 20%; right: 15%; animation-delay: 2s; }
            .bubble3 { bottom: 30%; left: 20%; animation-delay: 4s; }
            .bubble4 { bottom: 20%; right: 10%; animation-delay: 1s; }
            .bubble5 { top: 50%; left: 5%; animation-delay: 3s; }
          `}</style>
          
          {/* Oyun Kartları */}
          <div style={{display:'flex',gap:20,marginBottom:32,flexWrap:'wrap',justifyContent:'center'}}>
            {/* Kavram Oyunu Kartı */}
            <div 
              className="game-card"
              onClick={() => handleGameClick('/games/oyun1')}
              role="button"
              tabIndex={0}
              aria-label="Kavram Oyunu'nu başlat"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleGameClick('/games/oyun1');
                }
              }}
              style={{
                background:'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                borderRadius:18,
                padding:28,
                cursor:'pointer',
                transition:'all 0.3s ease',
                transform:'scale(1)',
                boxShadow:'0 8px 32px rgba(76,175,80,0.3)',
                border:'3px solid rgba(255,255,255,0.2)',
                textAlign:'center',
                width:220,
                height:180,
                display:'flex',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
                position:'relative',
                overflow:'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) rotate(2deg)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(76,175,80,0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(76,175,80,0.3)';
              }}
            >
              {/* Custom Kavram Oyunu İkonu */}
              <div className="floating-icon" style={{
                width:48,
                height:48,
                background:'rgba(255,255,255,0.2)',
                borderRadius:'50%',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                marginBottom:12,
                position:'relative'
              }}>
                <div style={{
                  width:24,
                  height:24,
                  background:'#fff',
                  borderRadius:4,
                  position:'relative'
                }}>
                  <div style={{
                    width:8,
                    height:8,
                    background:'#4CAF50',
                    borderRadius:2,
                    position:'absolute',
                    top:2,
                    left:2
                  }}></div>
                  <div style={{
                    width:8,
                    height:8,
                    background:'#4CAF50',
                    borderRadius:2,
                    position:'absolute',
                    top:2,
                    right:2
                  }}></div>
                  <div style={{
                    width:8,
                    height:8,
                    background:'#4CAF50',
                    borderRadius:2,
                    position:'absolute',
                    bottom:2,
                    left:2
                  }}></div>
                  <div style={{
                    width:8,
                    height:8,
                    background:'#4CAF50',
                    borderRadius:2,
                    position:'absolute',
                    bottom:2,
                    right:2
                  }}></div>
                </div>
              </div>
              <h3 style={{fontWeight:900,fontSize:20,color:'#fff',marginBottom:8}}>Kavram Oyunu</h3>
              <p style={{color:'#fff',fontSize:13,opacity:0.9,lineHeight:1.3}}>
                Renkler, sayılar ve duyguları öğren!
              </p>
            </div>

            {/* İletişim Panosu Kartı */}
            <div 
              className="game-card"
              onClick={() => handleGameClick('/games/oyun3')}
              role="button"
              tabIndex={0}
              aria-label="İletişim Panosu'nu başlat"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleGameClick('/games/oyun3');
                }
              }}
              style={{
                background:'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
                borderRadius:18,
                padding:28,
                cursor:'pointer',
                transition:'all 0.3s ease',
                transform:'scale(1)',
                boxShadow:'0 8px 32px rgba(33,150,243,0.3)',
                border:'3px solid rgba(255,255,255,0.2)',
                textAlign:'center',
                width:220,
                height:180,
                display:'flex',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
                position:'relative',
                overflow:'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) rotate(-2deg)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(33,150,243,0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(33,150,243,0.3)';
              }}
            >
              {/* Custom İletişim İkonu */}
              <div className="pulse-icon" style={{
                width:48,
                height:48,
                background:'rgba(255,255,255,0.2)',
                borderRadius:'50%',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                marginBottom:12,
                position:'relative'
              }}>
                <div style={{
                  width:20,
                  height:16,
                  background:'#fff',
                  borderRadius:8,
                  position:'relative'
                }}>
                  <div style={{
                    width:6,
                    height:6,
                    background:'#2196F3',
                    borderRadius:'50%',
                    position:'absolute',
                    top:2,
                    left:2
                  }}></div>
                  <div style={{
                    width:6,
                    height:6,
                    background:'#2196F3',
                    borderRadius:'50%',
                    position:'absolute',
                    top:2,
                    right:2
                  }}></div>
                  <div style={{
                    width:4,
                    height:4,
                    background:'#2196F3',
                    borderRadius:'50%',
                    position:'absolute',
                    bottom:2,
                    left:3
                  }}></div>
                  <div style={{
                    width:4,
                    height:4,
                    background:'#2196F3',
                    borderRadius:'50%',
                    position:'absolute',
                    bottom:2,
                    right:3
                  }}></div>
                </div>
              </div>
              <h3 style={{fontWeight:900,fontSize:20,color:'#fff',marginBottom:8}}>İletişim Panosu</h3>
              <p style={{color:'#fff',fontSize:13,opacity:0.9,lineHeight:1.3}}>
                Kendini ifade et!
              </p>
            </div>

            {/* Daha Fazla Oyun Kartı */}
            <div 
              className="game-card"
              onClick={() => alert('Yakında daha fazla oyun gelecek!')}
              role="button"
              tabIndex={0}
              aria-label="Daha fazla oyun bilgisi"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  alert('Yakında daha fazla oyun gelecek!');
                }
              }}
              style={{
                background:'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                borderRadius:18,
                padding:28,
                cursor:'pointer',
                transition:'all 0.3s ease',
                transform:'scale(1)',
                boxShadow:'0 8px 32px rgba(255,152,0,0.3)',
                border:'3px solid rgba(255,255,255,0.2)',
                textAlign:'center',
                width:220,
                height:180,
                display:'flex',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
                position:'relative',
                overflow:'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.05) rotate(1deg)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(255,152,0,0.4)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(255,152,0,0.3)';
              }}
            >
              {/* Custom Daha Fazla Oyun İkonu */}
              <div className="shimmer-bg" style={{
                width:48,
                height:48,
                background:'rgba(255,255,255,0.2)',
                borderRadius:'50%',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                marginBottom:12,
                position:'relative'
              }}>
                <div style={{
                  width:24,
                  height:24,
                  background:'#fff',
                  borderRadius:'50%',
                  position:'relative'
                }}>
                  <div style={{
                    width:8,
                    height:8,
                    background:'#FF9800',
                    borderRadius:'50%',
                    position:'absolute',
                    top:2,
                    left:2
                  }}></div>
                  <div style={{
                    width:6,
                    height:6,
                    background:'#FF9800',
                    borderRadius:'50%',
                    position:'absolute',
                    top:4,
                    right:4
                  }}></div>
                  <div style={{
                    width:4,
                    height:4,
                    background:'#FF9800',
                    borderRadius:'50%',
                    position:'absolute',
                    bottom:4,
                    left:4
                  }}></div>
                </div>
              </div>
              <h3 style={{fontWeight:900,fontSize:20,color:'#fff',marginBottom:8}}>Daha Fazla Oyun</h3>
              <p style={{color:'#fff',fontSize:13,opacity:0.9,lineHeight:1.3}}>
                Yakında yeni oyunlar gelecek!
              </p>
            </div>
          </div>
          
          {/* Ebeveyn Ayarları Butonu */}
          <div style={{textAlign:'center'}}>
            <button 
              onClick={handleSettingsClick}
              aria-label="Ebeveyn ayarlarına erişim için PIN girişi"
              style={{
                background:'rgba(255,255,255,0.2)',
                color:'#fff',
                border:'2px solid rgba(255,255,255,0.3)',
                borderRadius:15,
                padding:'12px 32px',
                fontWeight:800,
                fontSize:16,
                cursor:'pointer',
                transition:'all 0.3s ease',
                backdropFilter:'blur(10px)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Ebeveyn Ayarları
            </button>
          </div>
        </div>
      </main>

      {/* PIN Modal */}
      <PINModal
        isOpen={showPINModal}
        onClose={() => setShowPINModal(false)}
        onSuccess={handlePINSuccess}
      />
    </div>
  );
} 