import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';

interface AddChildModalProps {
  onAdd: (
    c:
      | { name: string; birthYear: number; gender: string; avatar: string; note: string; theme: string; is_literate: boolean; wants_tts: boolean }
      | { avatar: string; is_literate: boolean; wants_tts: boolean }
  ) => Promise<void>;
  onClose: () => void;
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

export const AddChildModal: React.FC<AddChildModalProps> = ({ onAdd, onClose }) => {
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

  useEffect(() => {
    supabase.from('themes').select('name').then(({ data }) => setThemes(data || []));
  }, []);

  useEffect(() => {
    if (themes.length > 0 && !theme) setTheme(themes[0].name);
  }, [themes]);

  useEffect(() => {
    supabase.from('avatars').select('name, image_url').then(({ data }) => setAvatars(data || []));
  }, []);
  useEffect(() => {
    if (avatars.length > 0 && !avatar) setAvatar(avatars[0].image_url);
  }, [avatars]);

  const handleSave = () => {
    if (!name.trim()) { setError('İsim zorunlu'); return; }
    if (!gender || (gender !== 'female' && gender !== 'male')) { setError('Cinsiyet seçin'); return; }
    if (!theme) { setError('Tema seçin'); return; }
    if (!birthYear) { setError('Doğum yılı seçin'); return; }
    setError('');
    onAdd({
      name,
      gender,
      theme,
      birthYear,
      avatar,
      note,
      is_literate: isLiterate,
      wants_tts: wantsTTS
    });
  };

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.18)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
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
        <input type="text" value={avatar} onChange={e=>setAvatar(e.target.value)} placeholder="Avatar SVG kodu veya resim linki (URL) girin" style={{ width: "100%", padding: 10, borderRadius: 10, border: "1.5px solid #dcdcdc", marginBottom: 16, fontSize:15 }} />
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
        {error && <div style={{color:'#fff',background:'#e74c3c',borderRadius:10,padding:'10px 18px',marginBottom:14,display:'flex',alignItems:'center',gap:10,fontWeight:900,fontSize:16}}><span style={{fontWeight:900,fontSize:20}}>!</span> {error}</div>}
        <button className="btn-submit" style={{ width: "100%",fontWeight:900,fontSize:18,padding:'14px 0',borderRadius:12,marginBottom:8 }} onClick={handleSave}>
          Kaydet
        </button>
        <button style={{ width: "100%", background: '#eee', color: '#333', borderRadius: 12, padding: 12, fontWeight:800 }} onClick={onClose}>Vazgeç</button>
      </div>
    </div>
  );
}; 