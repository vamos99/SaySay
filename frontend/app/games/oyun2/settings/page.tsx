'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/utils/AuthContext';

interface Game2Object {
  id: string;  // UUID string olarak değiştirildi
  name: string;
  image_url: string;
}

interface Game2Action {
  id: number;
  name: string;
  image_url: string;
}

interface Game2Settings {
  objects: Game2Object[];
  actions: Game2Action[];
}

export default function Game2SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<Game2Settings>({ objects: [], actions: [] });
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);
  const [selectedActions, setSelectedActions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load settings
  useEffect(() => {
    if (!user?.id) return;
    
    const loadSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/game2/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ child_id: user.id }),
        });

        const data = await response.json();
        
        console.log('Game2 Settings Data:', data); // Debug log
        
        if (data.error) {
          setError(data.error);
        } else if (data.objects.length === 0 && data.actions.length === 0) {
          setError('Veritabanında nesne veya eylem bulunamadı. Lütfen Supabase veritabanınızı kontrol edin.');
        } else {
          setSettings(data);
          // Initially select all items
          setSelectedObjects(data.objects.map((obj: Game2Object) => obj.id));
          setSelectedActions(data.actions.map((action: Game2Action) => action.id));
        }
      } catch (err) {
        setError('Ayarlar yüklenirken hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [user?.id]);

  // Save settings
  const saveSettings = async () => {
    if (!user?.id) return;

    try {
      setSaving(true);
      const response = await fetch('/api/game2/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          child_id: user.id,
          selected_object_ids: selectedObjects,
          selected_action_ids: selectedActions,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        router.push('/games/oyun2');
      } else {
        setError(data.error || 'Ayarlar kaydedilemedi');
      }
    } catch (err) {
      setError('Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  // Toggle selection
  const toggleObject = (id: string) => {
    setSelectedObjects(prev => 
      prev.includes(id) 
        ? prev.filter(objId => objId !== id)
        : [...prev, id]
    );
  };

  const toggleAction = (id: number) => {
    setSelectedActions(prev => 
      prev.includes(id) 
        ? prev.filter(actionId => actionId !== id)
        : [...prev, id]
    );
  };

  // Filter items based on search
  const normalizeText = (text: string) => {
    return text.toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c');
  };
  
  const filteredObjects = settings.objects.filter(obj => 
    normalizeText(obj.name).includes(normalizeText(searchTerm)) ||
    obj.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredActions = settings.actions.filter(action => 
    normalizeText(action.name).includes(normalizeText(searchTerm)) ||
    action.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Debug logs
  console.log('Search term:', searchTerm);
  console.log('Settings:', settings);
  console.log('Filtered objects:', filteredObjects);
  console.log('Filtered actions:', filteredActions);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--light-blue-bg)',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#2c3e50' }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
            Ayarlar Yükleniyor...
          </div>
          <div style={{ fontSize: 16, color: '#7b8fa1' }}>Lütfen bekleyin</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--light-blue-bg)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '2px solid #ecf0f1'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#2c3e50',
              margin: 0,
              marginBottom: '8px'
            }}>
              Game2 Ayarları
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#7b8fa1',
              margin: 0
            }}>
              Oyun2'de kullanılacak nesneleri ve eylemleri seçin
            </p>
          </div>
          <button
            onClick={() => router.push('/games/oyun2')}
            style={{
              background: '#ecf0f1',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '16px',
              fontWeight: 600,
              color: '#2c3e50',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#d5dbdb';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ecf0f1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            ← Geri Dön
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Search Bar */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '2px solid #ecf0f1'
        }}>
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="Nesne veya eylem ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 20px',
                border: '2px solid #ecf0f1',
                borderRadius: '12px',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#e0b97d';
                e.target.style.boxShadow = '0 0 0 3px rgba(224, 185, 125, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#ecf0f1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '14px',
            color: '#7b8fa1'
          }}>
            <span>
              {searchTerm ? (
                <>
                  <strong>{filteredObjects.length + filteredActions.length}</strong> sonuç bulundu
                </>
              ) : (
                <>
                  <strong>{settings.objects.length + settings.actions.length}</strong> toplam öğe
                </>
              )}
            </span>
            <span>
              <strong>{selectedObjects.length + selectedActions.length}</strong> seçili
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: '#fdf2f2',
            border: '2px solid #fecaca',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            color: '#dc2626',
            fontSize: '16px',
            fontWeight: 600
          }}>
            {error}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Objects Section */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '2px solid #ecf0f1'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#2c3e50',
                margin: 0
              }}>
                Nesneler
              </h2>
              <div style={{
                background: '#e0b97d',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 600
              }}>
                {selectedObjects.length} / {settings.objects.length}
              </div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '16px',
              maxHeight: '400px',
              overflowY: 'auto',
              paddingRight: '8px'
            }}>
              {filteredObjects.map((obj) => {
                const isSelected = selectedObjects.includes(obj.id);
                return (
                  <div
                    key={obj.id}
                    onClick={() => toggleObject(obj.id)}
                    style={{
                      width: '120px',
                      height: '140px',
                      background: '#fff',
                      borderRadius: '16px',
                      boxShadow: isSelected 
                        ? '0 8px 25px rgba(224, 185, 125, 0.4)' 
                        : '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: isSelected ? '3px solid #e0b97d' : '2px solid #ecf0f1',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = isSelected ? 'scale(1.05)' : 'scale(1)';
                        e.currentTarget.style.boxShadow = isSelected 
                          ? '0 8px 25px rgba(224, 185, 125, 0.4)' 
                          : '0 4px 12px rgba(0, 0, 0, 0.1)';
                      }
                    }}
                  >
                    {/* Seçim göstergesi */}
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '20px',
                        height: '20px',
                        background: '#e0b97d',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        ✓
                      </div>
                    )}

                    {/* Görsel */}
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '8px',
                      background: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={obj.image_url}
                        alt={obj.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `
                            <div style="
                              width: 100%; 
                              height: 100%; 
                              display: flex; 
                              align-items: center; 
                              justify-content: center; 
                              background: #e9ecef; 
                              color: #6c757d; 
                              font-size: 24px;
                              font-weight: bold;
                            ">
                              📦
                            </div>
                          `;
                        }}
                      />
                    </div>

                    {/* İsim */}
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: isSelected ? '#2c3e50' : '#7b8fa1',
                      textAlign: 'center',
                      lineHeight: '1.2',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {obj.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions Section */}
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '2px solid #ecf0f1'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#2c3e50',
                margin: 0
              }}>
                Eylemler
              </h2>
              <div style={{
                background: '#e0b97d',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 600
              }}>
                {selectedActions.length} / {settings.actions.length}
              </div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '16px',
              maxHeight: '400px',
              overflowY: 'auto',
              paddingRight: '8px'
            }}>
              {filteredActions.map((action) => {
                const isSelected = selectedActions.includes(action.id);
                return (
                  <div
                    key={action.id}
                    onClick={() => toggleAction(action.id)}
                    style={{
                      width: '120px',
                      height: '140px',
                      background: '#fff',
                      borderRadius: '16px',
                      boxShadow: isSelected 
                        ? '0 8px 25px rgba(224, 185, 125, 0.4)' 
                        : '0 4px 12px rgba(0, 0, 0, 0.1)',
                      border: isSelected ? '3px solid #e0b97d' : '2px solid #ecf0f1',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.transform = isSelected ? 'scale(1.05)' : 'scale(1)';
                        e.currentTarget.style.boxShadow = isSelected 
                          ? '0 8px 25px rgba(224, 185, 125, 0.4)' 
                          : '0 4px 12px rgba(0, 0, 0, 0.1)';
                      }
                    }}
                  >
                    {/* Seçim göstergesi */}
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '20px',
                        height: '20px',
                        background: '#e0b97d',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        ✓
                      </div>
                    )}

                    {/* Görsel */}
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      marginBottom: '8px',
                      background: '#f8f9fa',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={action.image_url}
                        alt={action.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = `
                            <div style="
                              width: 100%; 
                              height: 100%; 
                              display: flex; 
                              align-items: center; 
                              justify-content: center; 
                              background: #e9ecef; 
                              color: #6c757d; 
                              font-size: 24px;
                              font-weight: bold;
                            ">
                              🎯
                            </div>
                          `;
                        }}
                      />
                    </div>

                    {/* İsim */}
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: isSelected ? '#2c3e50' : '#7b8fa1',
                      textAlign: 'center',
                      lineHeight: '1.2',
                      maxWidth: '100%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {action.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '32px'
        }}>
          <button
            onClick={saveSettings}
            disabled={saving || selectedObjects.length === 0 || selectedActions.length === 0}
            style={{
              background: saving || selectedObjects.length === 0 || selectedActions.length === 0
                ? '#bdc3c7'
                : '#e0b97d',
              border: 'none',
              borderRadius: '16px',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: 700,
              color: '#fff',
              cursor: saving || selectedObjects.length === 0 || selectedActions.length === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '200px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (!saving && selectedObjects.length > 0 && selectedActions.length > 0) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(224, 185, 125, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!saving && selectedObjects.length > 0 && selectedActions.length > 0) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }
            }}
          >
            {saving ? (
              <>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid #fff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Kaydediliyor...
              </>
            ) : (
              <>
                ✓ Ayarları Kaydet
              </>
            )}
          </button>
        </div>
      </div>

      {/* Custom CSS Variables and Animations */}
      <style jsx global>{`
        :root {
          --light-blue-bg: #f8fafc;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        body {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}