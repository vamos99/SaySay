import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../utils/AuthContext';

interface Child {
  id: string;
  name: string;
  gender: string;
  theme: string;
  avatar: string;
}

interface ChildSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChildSelect: (childId: string) => void;
}

export const ChildSelectionModal: React.FC<ChildSelectionModalProps> = ({
  isOpen,
  onClose,
  onChildSelect
}) => {
  const { user } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && user) {
      loadChildren();
    }
  }, [isOpen, user]);

  const loadChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('id, name, gender, theme, avatar')
        .eq('user_id', user?.id);

      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      console.error('Çocuklar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChildSelect = (childId: string) => {
    onChildSelect(childId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: 32,
        maxWidth: 500,
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <h2 style={{
          fontWeight: 900,
          fontSize: 24,
          marginBottom: 24,
          textAlign: 'center',
          color: '#2c3e50'
        }}>
          Hangi Çocuk İçin Oyun Başlatıyorsun?
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 18, color: '#666' }}>Yükleniyor...</div>
          </div>
        ) : children.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 18, color: '#666' }}>Henüz çocuk eklenmemiş</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => handleChildSelect(child.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: 16,
                  background: '#f8f9fa',
                  border: '2px solid #e9ecef',
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  width: '100%',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.background = '#f0f4ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e9ecef';
                  e.currentTarget.style.background = '#f8f9fa';
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  background: '#667eea',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 18
                }}>
                  {child.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: '#2c3e50',
                    marginBottom: 4
                  }}>
                    {child.name}
                  </div>
                  <div style={{
                    fontSize: 14,
                    color: '#666'
                  }}>
                    {child.gender === 'male' ? 'Erkek' : 'Kız'} • {child.theme}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 24px',
              background: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            İptal
          </button>
        </div>
      </div>
    </div>
  );
}; 