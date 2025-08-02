import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { useAuth } from '../../utils/AuthContext';
import { gameCache } from '../../utils/gameCache';
import { useSecureCache } from '../../utils/cacheManager';

interface AddChildModalProps {
  onAdd: (
    c:
      | { name: string; birthYear: number; gender: string; avatar: string; note: string; theme: string; is_literate: boolean; wants_tts: boolean }
      | { avatar: string; is_literate: boolean; wants_tts: boolean }
  ) => Promise<void>;
  onClose: () => void;
  isEditMode?: boolean;
  childId?: string;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({length: 10}, (_, i) => CURRENT_YEAR - i); // Son 10 yıl
const GENDERS = [
  { value: 'female', label: 'Kız', svg: (
    <svg width="28" height="28" viewBox="0 0 28 28" style={{verticalAlign:'middle'}}><circle cx="14" cy="14" r="13" fill="#f8c9d3" stroke="#e67e22" strokeWidth="2"/><ellipse cx="14" cy="16" rx="7" ry="8" fill="#fff"/><ellipse cx="14" cy="15" rx="5" ry="6" fill="#f8c9d3"/><ellipse cx="11" cy="13" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="17" cy="13" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="11" cy="13" rx="0.5" ry="0.7" fill="#7b8fa1"/><ellipse cx="17" cy="13" rx="0.5" ry="0.7" fill="#7b8fa1"/><ellipse cx="14" cy="17.5" rx="2" ry="1" fill="#e67e22"/></svg>
  ) },
  { value: 'male', label: 'Erkek', svg: (
    <svg width="28" height="28" viewBox="0 0 28 28" style={{verticalAlign:'middle'}}><circle cx="14" cy="14" r="13" fill="#bde6f7" stroke="#2c3e50" strokeWidth="2"/><ellipse cx="14" cy="16" rx="7" ry="8" fill="#fff"/><ellipse cx="14" cy="15" rx="5" ry="6" fill="#bde6f7"/><ellipse cx="11" cy="13" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="17" cy="13" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="11" cy="13" rx="0.5" ry="0.7" fill="#2c3e50"/><ellipse cx="17" cy="13" rx="0.5" ry="0.7" fill="#2c3e50"/><ellipse cx="14" cy="17.5" rx="2" ry="1" fill="#7b8fa1"/><rect x="8" y="7" width="12" height="4" rx="2" fill="#7b8fa1"/></svg>
  ) },
];
// AVATARS sabit array yerine dinamik çekilecek
// const AVATARS = [ ... ];

export const AddChildModal: React.FC<AddChildModalProps> = ({ onAdd, onClose, isEditMode, childId }) => {
  const { user } = useAuth();
  const { getCached, setCached } = useSecureCache();
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState<number>(CURRENT_YEAR);
  const [gender, setGender] = useState('female');
  const [avatars, setAvatars] = useState<{ name: string, image_url: string }[]>([]);
  const [avatar, setAvatar] = useState<string>('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [themes, setThemes] = useState<{ name: string }[]>([]);
  const [theme, setTheme] = useState('');
  const [isLiterate, setIsLiterate] = useState(false);
  const [wantsTTS, setWantsTTS] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [concepts, setConcepts] = useState<{id:string, name:string}[]>([]);
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  
  // PIN yönetimi state'leri
  const [showPINSection, setShowPINSection] = useState(false);
  const [pinAction, setPinAction] = useState<'create' | 'update'>('create');
  const [newPIN, setNewPIN] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [pinSuccess, setPinSuccess] = useState<string>('');

  useEffect(() => {
    // Önce cache'den kontrol et
    const cachedThemes = getCached('public_themes_');
    if (cachedThemes) {
      setThemes(cachedThemes);
      return;
    }

    // Cache'de yoksa DB'den çek
    supabase.from('themes').select('name').then(({ data }: { data: any }) => {
      setThemes(data || []);
      setCached('public_themes_', data || []); // Cache'e kaydet
    });
  }, []);

  useEffect(() => {
    if (themes.length > 0 && !theme) setTheme(themes[0].name);
  }, [themes, theme]);

  useEffect(() => {
    // Önce cache'den kontrol et
    const cachedAvatars = getCached('public_avatars_');
    if (cachedAvatars) {
      setAvatars(cachedAvatars);
      return;
    }

    // Cache'de yoksa DB'den çek
    supabase.from('avatars').select('name, image_url').then(({ data }: { data: any }) => {
      setAvatars(data || []);
      setCached('public_avatars_', data || []); // Cache'e kaydet
    });
  }, []);
  useEffect(() => {
    if (avatars.length > 0 && !avatar) setAvatar(avatars[0].image_url);
  }, [avatars, avatar]);

  useEffect(() => {
    // Önce cache'den kontrol et
    const cachedCategories = getCached('public_categories_');
    if (cachedCategories) {
      setConcepts(cachedCategories);
      return;
    }

    // Cache'de yoksa DB'den çek
    supabase.from('categories').select('id, name').then(({ data }: { data: any }) => {
      setConcepts(data || []);
      setCached('public_categories_', data || []); // Cache'e kaydet
    });
  }, []);

  // ESC key ile kapatma
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [onClose]);

  // Modal dışına tıklama ile kapatma
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  // Approval modal dışına tıklama ile kapatma
  const handleApprovalOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setShowApprovalModal(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) { setError('Kullanıcı bilgisi bulunamadı'); return; }
    if (!name.trim()) { setError('İsim zorunlu'); return; }
    if (!gender || (gender !== 'female' && gender !== 'male')) { setError('Cinsiyet seçin'); return; }
    if (!theme) { setError('Tema seçin'); return; }
    if (!birthYear) { setError('Doğum yılı seçin'); return; }
    if (selectedConcepts.length === 0) { setError('En az bir kavram seçmelisiniz'); return; }
    // Sadece allowed kavramlar seçilmiş mi kontrol et
    const ALLOWED_CONCEPTS = ['Renkler', 'Sayılar', 'Büyük/Küçük', 'Duygular'];
    const selectedConceptNames = concepts.filter(c => selectedConcepts.includes(c.id) && ALLOWED_CONCEPTS.includes(c.name)).map(c => c.name);
    if (selectedConceptNames.length === 0) { setError('Geçerli kavram seçmelisiniz'); return; }
    setError('');
    
    // Çocuk ekle
    const { data: child, error: childError } = await supabase.from('children').insert([{
      user_id: user.id,
      name,
      gender,
      theme,
      birth_year: birthYear,
      avatar,
      note,
      is_literate: isLiterate,
      wants_tts: wantsTTS
    }]).select().single();
    
    if (childError || !child) { 
      setError('Çocuk eklenemedi: ' + (childError?.message || 'Bilinmeyen hata')); 
      return; 
    }

    // Mevcut PIN'i yeni çocuğa ekle
    try {
      const { data: existingPin, error: pinQueryError } = await supabase
        .from('children')
        .select('pin_hash')
        .eq('user_id', user.id)
        .not('pin_hash', 'is', null);

      if (pinQueryError) {
        console.error('PIN sorgu hatası:', pinQueryError);
      } else if (existingPin && existingPin.length > 0 && existingPin[0]?.pin_hash) {
        const { error: pinUpdateError } = await supabase
          .from('children')
          .update({ pin_hash: existingPin[0].pin_hash })
          .eq('id', child.id);
        
                   if (pinUpdateError) {
             console.error('PIN güncelleme hatası:', pinUpdateError);
           }
         }
    } catch (pinError) {
      console.error('PIN ekleme genel hatası:', pinError);
    }

    // Roadmap datası hazırla
    const roadmap = {
      child_id: child.id,
      concepts_order: selectedConceptNames,
    };
    setRoadmapData(roadmap);
    setShowApprovalModal(true);
  };

  const handleApproveRoadmap = async () => {
    if (!roadmapData) return;
    setIsGenerating(true);
    try {
  
      
      // Roadmap'i DB'ye kaydet (upsert ile)
      const { error: roadmapError } = await supabase
        .from('concept_roadmap')
        .upsert([roadmapData], { 
          onConflict: 'child_id' // child_id çakışmasında güncelle
        });
      
      if (roadmapError) {
        console.error('Roadmap kaydetme hatası:', roadmapError);
        setError('Roadmap kaydedilemedi: ' + roadmapError.message);
        setIsGenerating(false);
        return;
      }


      // API route üzerinden backend'e istek at (arka planda)
      
      // Modal'ı kapat ve backend işlemini arka planda yap
      onClose();
      
      // Backend işlemini arka planda yap
      fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ child_id: roadmapData.child_id })
      }).then(async response => {
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API route hatası:', response.status, errorText);
          console.warn('Backend işlemi başarısız, ancak çocuk eklendi. Daha sonra tekrar deneyebilirsiniz.');
        } else {
          const data = await response.json();
          
          // Backend işlemi başarılıysa cache'e kaydet
          if (data.all_concepts && data.all_concepts.length > 0) {
            const filteredContent = data.all_concepts.filter((c: any) => !c.error);
            gameCache.set(roadmapData.child_id, filteredContent, 'Yeni Çocuk');
 
          }
        }
      }).catch(err => {
        console.error('API route isteği hatası:', err);
        console.warn('Backend işlemi başarısız, ancak çocuk eklendi. Daha sonra tekrar deneyebilirsiniz.');
      });
      
      // Sayfa yenileme kaldırıldı - kullanıcı manuel olarak yenileyebilir
    } catch (err) {
      console.error('Roadmap kaydetme hatası:', err);
      setError('Roadmap kaydedilemedi: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
      setIsGenerating(false);
    }
  };

  // PIN yönetimi fonksiyonları
  const handleCreatePIN = async () => {
    if (!childId || !user?.id) return;
    
    try {
      setPinError('');
      setPinSuccess('');
      
      // Mevcut PIN'i kontrol et
      const { data: existingPin } = await supabase
        .from('children')
        .select('pin_hash')
        .eq('user_id', user.id)
        .not('pin_hash', 'is', null);
      
      if (existingPin && existingPin.length > 0 && existingPin[0]?.pin_hash) {
        // PIN zaten var, göster
        setPinSuccess(`Mevcut PIN: ${existingPin[0].pin_hash}\nBu PIN'i güvenli bir yerde saklayın!\nTüm çocuklarınız için aynı PIN kullanılacak.`);
      } else {
        // PIN yok, kullanıcıya PIN girmesini söyle
        setPinError('Henüz PIN oluşturulmamış. Lütfen aşağıdan PIN girin ve "PIN Güncelle" butonuna tıklayın.');
        setPinAction('update');
      }
    } catch (error) {
      setPinError('PIN bilgisi alınamadı');
    }
  };

  const handleUpdatePIN = async () => {
    if (!childId || !user?.id || !newPIN || newPIN.length !== 4) {
      setPinError('PIN 4 haneli olmalıdır');
      return;
    }

    try {
      setPinError('');
      setPinSuccess('');
      
      // Kullanıcının girdiği PIN'i tüm çocuklara kaydet
      await supabase
        .from('children')
        .update({ pin_hash: newPIN })
        .eq('user_id', user.id);
      
      setPinSuccess(`PIN güncellendi: ${newPIN}\nBu PIN'i güvenli bir yerde saklayın!\nTüm çocuklarınız için aynı PIN kullanılacak.`);
      setNewPIN('');
    } catch (error) {
      setPinError('PIN güncellenemedi');
    }
  };

  const handlePINAction = (action: 'create' | 'update') => {
    setPinAction(action);
    setShowPINSection(true);
    setPinError('');
    setPinSuccess('');
    setNewPIN('');
  };

  const ALLOWED_CONCEPTS = ['Renkler', 'Sayılar', 'Büyük/Küçük', 'Duygular'];

  return (
    <div>
      <div 
        style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.18)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}
        onClick={handleOverlayClick}
      >
        <div style={{ background: "#fff", borderRadius: 22, padding: 24, width: '100vw', maxWidth: 380, boxSizing: 'border-box', boxShadow: "0 8px 32px rgba(0,0,0,0.12)", maxHeight: '90vh', overflowY: 'auto', margin: 12 }}>
          <h2 style={{ margin: 0, fontWeight: 900, color: "#2c3e50", fontSize: 22 }}>Çocuk Ekle</h2>
          <p style={{ margin: "12px 0 24px 0", color:'#7b8fa1',fontWeight:600 }}>Çocuğunuzun bilgilerini girin.</p>
          <label style={{fontWeight:700,marginBottom:4,display:'block'}}>İsim</label>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Adı" style={{ width: "100%", padding: 12, borderRadius: 12, border: "1.5px solid #dcdcdc", marginBottom: 16, fontSize:16 }} />
          <label style={{fontWeight:700,marginBottom:4,display:'block'}}>Doğum Yılı</label>
          <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
            {YEARS.map(y => (
              <button key={y} type="button" onClick={()=>setBirthYear(y)} style={{padding:'8px 18px',borderRadius:10,border:birthYear===y?'2px solid #4CAF50':'1.5px solid #dcdcdc',background:birthYear===y?'#eaffea':'#fff',color:'#2c3e50',fontWeight:700,cursor:'pointer',fontSize:16}}>{y}</button>
            ))}
          </div>
          <label style={{fontWeight:700,marginBottom:4,display:'block'}}>Cinsiyet</label>
          <div style={{display:'flex',gap:12,marginBottom:16}}>
            {GENDERS.map(g => (
              <button key={g.value} type="button" onClick={()=>setGender(g.value)} style={{padding:'10px 20px',borderRadius:12,border:gender===g.value?'2px solid #4CAF50':'1.5px solid #dcdcdc',background:gender===g.value?'#eaffea':'#fff',color:'#2c3e50',fontWeight:800,cursor:'pointer',fontSize:20,display:'flex',alignItems:'center',gap:10}}>{g.svg} {g.label}</button>
            ))}
          </div>
          <label style={{fontWeight:700,marginBottom:4,display:'block'}}>Avatar</label>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:16}}>
            {avatars.map((a, index) => (
              <button key={index} type="button" onClick={()=>setAvatar(a.image_url)} style={{width:56,height:56,padding:0,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:14,border:avatar===a.image_url?'2.5px solid #e67e22':'1.5px solid #dcdcdc',background:avatar===a.image_url?'#ffe6b3':'#fff',cursor:'pointer',transition:'all 0.2s'}}>
                {a.image_url?.startsWith('<svg') ? (
                  <span style={{display:'block',width:44,height:44}} dangerouslySetInnerHTML={{__html:a.image_url}} />
                ) : (
                  a.image_url ? <img src={a.image_url} alt="Avatar" style={{display:'block',width:44,height:44,borderRadius:'50%'}} /> : null
                )}
              </button>
            ))}
          </div>
          {/* Avatar input'unu gizle - gereksiz bilgi gösteriyor */}
          {/* <input type="text" value={avatar} onChange={e=>setAvatar(e.target.value)} placeholder="Avatar SVG kodu veya resim linki (URL) girin" style={{ width: "100%", padding: 10, borderRadius: 10, border: "1.5px solid #dcdcdc", marginBottom: 16, fontSize:15 }} /> */}
          {/* Avatar önizleme */}
          {avatar && (
            <div style={{marginBottom:16}}>
              <span style={{fontWeight:700,marginBottom:4,display:'block'}}>Avatar Önizleme:</span>
              {avatar.startsWith('<svg') ? (
                <span style={{display:'block',width:56,height:56}} dangerouslySetInnerHTML={{__html:avatar}} />
              ) : (
                avatar ? <img src={avatar} alt="Avatar" style={{display:'block',width:56,height:56,borderRadius:'50%'}} /> : null
              )}
            </div>
          )}
          <label style={{fontWeight:700,marginBottom:4,display:'block'}}>Tema</label>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:16}}>
            {themes.map(t => (
              <button key={t.name} type="button" onClick={()=>setTheme(t.name)} style={{padding:'10px 18px',borderRadius:12,border:theme===t.name?'2px solid #2c3e50':'1.5px solid #dcdcdc',background:theme===t.name?'#eaffea':'#fff',color:'#2c3e50',fontWeight:800,cursor:'pointer',fontSize:16}}>{t.name}</button>
            ))}
          </div>
          
          {/* PIN Yönetimi - Sadece edit modunda göster */}
          {isEditMode && childId && (
            <div style={{marginBottom:16}}>
              <label style={{fontWeight:700,marginBottom:8,display:'block'}}>🔐 PIN Yönetimi</label>
              <div style={{background:'#f8f9fa',borderRadius:12,padding:16,border:'1px solid #e9ecef'}}>
                <div style={{display:'flex',gap:8,marginBottom:12}}>
                  <button 
                    type="button" 
                    onClick={() => handlePINAction('create')}
                    style={{
                      padding:'8px 16px',
                      borderRadius:8,
                      border:'1.5px solid #3498db',
                      background:'#fff',
                      color:'#3498db',
                      fontWeight:700,
                      cursor:'pointer',
                      fontSize:14
                    }}
                  >
                    PIN Görüntüle
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handlePINAction('update')}
                    style={{
                      padding:'8px 16px',
                      borderRadius:8,
                      border:'1.5px solid #9b59b6',
                      background:'#fff',
                      color:'#9b59b6',
                      fontWeight:700,
                      cursor:'pointer',
                      fontSize:14
                    }}
                  >
                    PIN Güncelle
                  </button>
                </div>
                
                {showPINSection && (
                  <div style={{marginTop:12}}>
                    {pinAction === 'create' ? (
                      <div>
                        <p style={{fontSize:14,color:'#6c757d',marginBottom:12}}>
                          Mevcut PIN'i görüntüleyin. Bu PIN ile çocuk portal'a erişebilecek.
                        </p>
                        <button 
                          onClick={handleCreatePIN}
                          style={{
                            width:'100%',
                            padding:'10px',
                            borderRadius:8,
                            background:'#3498db',
                            color:'#fff',
                            border:'none',
                            fontWeight:700,
                            cursor:'pointer',
                            fontSize:14
                          }}
                        >
                          PIN Görüntüle
                        </button>
                      </div>
                    ) : (
                      <div>
                        <label style={{fontSize:14,fontWeight:600,marginBottom:4,display:'block'}}>
                          Yeni PIN (4 haneli):
                        </label>
                        <input
                          type="password"
                          value={newPIN}
                          onChange={(e) => setNewPIN(e.target.value)}
                          style={{
                            width:'100%',
                            padding:'10px',
                            borderRadius:8,
                            border:'1.5px solid #ddd',
                            fontSize:14,
                            marginBottom:8
                          }}
                          placeholder="0000"
                          maxLength={4}
                        />
                        <button 
                          onClick={handleUpdatePIN}
                          style={{
                            width:'100%',
                            padding:'10px',
                            borderRadius:8,
                            background:'#9b59b6',
                            color:'#fff',
                            border:'none',
                            fontWeight:700,
                            cursor:'pointer',
                            fontSize:14
                          }}
                        >
                          PIN Güncelle
                        </button>
                      </div>
                    )}
                    
                    {pinError && (
                      <div style={{color:'#e74c3c',fontSize:13,marginTop:8,fontWeight:600}}>{pinError}</div>
                    )}
                    {pinSuccess && (
                      <div style={{color:'#27ae60',fontSize:13,marginTop:8,fontWeight:600,whiteSpace:'pre-line'}}>{pinSuccess}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          <label style={{fontWeight:700,marginBottom:4,display:'block'}}>Not</label>
          <input type="text" value={note} onChange={e=>setNote(e.target.value)} placeholder="Kısa not (isteğe bağlı)" style={{ width: "100%", padding: 12, borderRadius: 12, border: "1.5px solid #dcdcdc", marginBottom: 16, fontSize:16 }} />
          {/* Okuma yazma ve seslendirme ayarları */}
          <div style={{marginTop:16,display:'flex',flexDirection:'column',gap:12}}>
            <label style={{display:'flex',alignItems:'center',gap:8}}>
              <input type="checkbox" checked={isLiterate} onChange={e=>setIsLiterate(e.target.checked)} /> Okuma yazma biliyor
            </label>
            <label style={{display:'flex',alignItems:'center',gap:8}}>
              <input type="checkbox" checked={wantsTTS} onChange={e=>setWantsTTS(e.target.checked)} /> Seslendirme olsun
            </label>
          </div>
          <label style={{fontWeight:700,marginBottom:4,display:'block'}}>Kavramlar</label>
          <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:16}}>
            {concepts.filter(concept => ALLOWED_CONCEPTS.includes(concept.name)).map(concept => (
              <button
                key={concept.id}
                type="button"
                onClick={() => setSelectedConcepts(selectedConcepts.includes(concept.id)
                  ? selectedConcepts.filter(id => id !== concept.id)
                  : [...selectedConcepts, concept.id])}
                style={{
                  padding:'10px 18px',
                  borderRadius:12,
                  border:selectedConcepts.includes(concept.id)?'2px solid #4CAF50':'1.5px solid #dcdcdc',
                  background:selectedConcepts.includes(concept.id)?'#eaffea':'#fff',
                  color:'#2c3e50',
                  fontWeight:800,
                  cursor:'pointer',
                  fontSize:16,
                  marginBottom:6
                }}
              >
                {concept.name}
              </button>
            ))}
          </div>
          {error && <div style={{color:'#fff',background:'#e74c3c',borderRadius:10,padding:'10px 18px',marginBottom:14,display:'flex',alignItems:'center',gap:10,fontWeight:900,fontSize:16}}><span style={{fontWeight:900,fontSize:20}}>!</span> {error}</div>}
          <button className="btn-submit" style={{ width: "100%",fontWeight:900,fontSize:18,padding:'14px 0',borderRadius:12,marginBottom:8 }} onClick={handleSave}>
            Kaydet
          </button>
          <button style={{ width: "100%", background: '#eee', color: '#333', borderRadius: 12, padding: 12, fontWeight:800 }} onClick={onClose}>Vazgeç</button>
        </div>
      </div>
      {showApprovalModal && (
        <div 
          style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.18)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}
          onClick={handleApprovalOverlayClick}
        >
          <div style={{background:'#fff',borderRadius:22,padding:32,maxWidth:400}}>
            <h3 style={{fontWeight:900,fontSize:22,marginBottom:16}}>Öğrenme Planını Onayla</h3>
            <p style={{marginBottom:12}}>Eklediğiniz kavramlar ve bilgilerle öğrenme planı oluşturulacak. Onaylıyor musunuz?</p>
            <ul style={{marginBottom:24,paddingLeft:18}}>
              {concepts.filter(c=>selectedConcepts.includes(c.id) && ALLOWED_CONCEPTS.includes(c.name)).map(c=>(
                <li key={c.id} style={{fontWeight:700,fontSize:16}}>{c.name}</li>
              ))}
            </ul>
            <button 
              style={{
                width:'100%',
                fontWeight:900,
                fontSize:18,
                padding:'14px 0',
                borderRadius:12,
                marginBottom:8,
                background: isGenerating ? '#ccc' : '#4CAF50',
                color:'#fff',
                cursor: isGenerating ? 'not-allowed' : 'pointer'
              }} 
              onClick={handleApproveRoadmap}
              disabled={isGenerating}
            >
              {isGenerating ? 'İşleniyor...' : 'Onayla'}
            </button>
            <button style={{width:'100%',background:'#eee',color:'#333',borderRadius:12,padding:12,fontWeight:800}} onClick={()=>setShowApprovalModal(false)}>Vazgeç</button>
          </div>
        </div>
      )}
    </div>
  );
}; 