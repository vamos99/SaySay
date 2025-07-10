import React, { useRef, useState } from 'react';

interface AddChildModalProps {
  onAdd: (child: { name: string; birthYear: number; gender: string; avatar: string; note: string; theme: string }) => void;
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
// AVATARS: Net, karakteristik, tematik SVG stringler
const AVATARS = [
  // Kız çocuk, pembe saç bantlı
  `<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#ffe6b3" stroke="#e67e22" stroke-width="2"/><ellipse cx="16" cy="20" rx="8" ry="7" fill="#fff"/><ellipse cx="16" cy="18" rx="6" ry="6.5" fill="#f8c9d3"/><ellipse cx="12.5" cy="15.5" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="19.5" cy="15.5" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="12.5" cy="15.5" rx="0.5" ry="0.7" fill="#7b8fa1"/><ellipse cx="19.5" cy="15.5" rx="0.5" ry="0.7" fill="#7b8fa1"/><ellipse cx="16" cy="22.5" rx="2" ry="1" fill="#e67e22"/><rect x="8" y="10" width="16" height="4" rx="2" fill="#ff7eb9"/></svg>`,
  // Erkek çocuk, mavi şapkalı
  `<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#bde6f7" stroke="#2c3e50" stroke-width="2"/><ellipse cx="16" cy="20" rx="8" ry="7" fill="#fff"/><ellipse cx="16" cy="18" rx="6" ry="6.5" fill="#bde6f7"/><ellipse cx="12.5" cy="15.5" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="19.5" cy="15.5" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="12.5" cy="15.5" rx="0.5" ry="0.7" fill="#2c3e50"/><ellipse cx="19.5" cy="15.5" rx="0.5" ry="0.7" fill="#2c3e50"/><ellipse cx="16" cy="22.5" rx="2" ry="1" fill="#7b8fa1"/><rect x="8" y="8" width="16" height="5" rx="2.5" fill="#4a90e2"/></svg>`,
  // Kıvırcık saçlı çocuk, sarı saç
  `<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#ffe6b3" stroke="#e67e22" stroke-width="2"/><ellipse cx="16" cy="20" rx="8" ry="7" fill="#fff"/><ellipse cx="16" cy="18" rx="6" ry="6.5" fill="#ffe6b3"/><ellipse cx="12.5" cy="15.5" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="19.5" cy="15.5" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="12.5" cy="15.5" rx="0.5" ry="0.7" fill="#e67e22"/><ellipse cx="19.5" cy="15.5" rx="0.5" ry="0.7" fill="#e67e22"/><ellipse cx="16" cy="22.5" rx="2" ry="1" fill="#e67e22"/><ellipse cx="16" cy="10" rx="7" ry="3.5" fill="#ffe066"/></svg>`,
  // Gözlüklü çocuk, mor saç
  `<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#e0c9f8" stroke="#7b8fa1" stroke-width="2"/><ellipse cx="16" cy="20" rx="8" ry="7" fill="#fff"/><ellipse cx="16" cy="18" rx="6" ry="6.5" fill="#e0c9f8"/><ellipse cx="12.5" cy="15.5" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="19.5" cy="15.5" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="12.5" cy="15.5" rx="0.5" ry="0.7" fill="#7b8fa1"/><ellipse cx="19.5" cy="15.5" rx="0.5" ry="0.7" fill="#7b8fa1"/><ellipse cx="16" cy="22.5" rx="2" ry="1" fill="#e67e22"/><rect x="10" y="8" width="12" height="3" rx="1.5" fill="#a259f7"/><ellipse cx="12.5" cy="15.5" rx="2" ry="2" fill="none" stroke="#7b8fa1" stroke-width="1.2"/><ellipse cx="19.5" cy="15.5" rx="2" ry="2" fill="none" stroke="#7b8fa1" stroke-width="1.2"/></svg>`,
  // Koyu tenli çocuk, kırmızı tişört
  `<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#a97c50" stroke="#7b8fa1" stroke-width="2"/><ellipse cx="16" cy="20" rx="8" ry="7" fill="#fff"/><ellipse cx="16" cy="18" rx="6" ry="6.5" fill="#a97c50"/><ellipse cx="12.5" cy="15.5" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="19.5" cy="15.5" rx="1.2" ry="1.5" fill="#fff"/><ellipse cx="12.5" cy="15.5" rx="0.5" ry="0.7" fill="#2c3e50"/><ellipse cx="19.5" cy="15.5" rx="0.5" ry="0.7" fill="#2c3e50"/><ellipse cx="16" cy="22.5" rx="2" ry="1" fill="#e67e22"/><rect x="10" y="25" width="12" height="3" rx="1.5" fill="#e74c3c"/></svg>`
];
const THEMES = [
  { name: 'Korsanlar' },
  { name: 'Hayvanlar' },
  { name: 'Uzay' },
  { name: 'Prensesler' },
  { name: 'Arabalar' },
];

export const AddChildModal: React.FC<AddChildModalProps> = ({ onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState<number>(CURRENT_YEAR);
  const [gender, setGender] = useState('female');
  const [avatar, setAvatar] = useState<string>(AVATARS[0]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(THEMES[0].name);

  const handleSave = () => {
    if (!name.trim()) { setError('İsim zorunlu'); return; }
    if (!gender || (gender !== 'female' && gender !== 'male')) { setError('Cinsiyet seçin'); return; }
    setError('');
    onAdd({ name: name.trim(), birthYear, gender, avatar, note, theme });
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
          {AVATARS.map((a, index) => (
            <button key={index} type="button" onClick={()=>setAvatar(a)} style={{width:56,height:56,padding:0,display:'flex',alignItems:'center',justifyContent:'center',borderRadius:14,border:avatar===a?'2.5px solid #e67e22':'1.5px solid #dcdcdc',background:avatar===a?'#ffe6b3':'#fff',cursor:'pointer',transition:'all 0.2s'}}>
              <span style={{display:'block',width:44,height:44}} dangerouslySetInnerHTML={{__html:a}} />
            </button>
          ))}
        </div>
        <label style={{fontWeight:700,marginBottom:4,display:'block'}}>Tema</label>
        <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:16}}>
          {THEMES.map(t => (
            <button key={t.name} type="button" onClick={()=>setTheme(t.name)} style={{padding:'10px 18px',borderRadius:12,border:theme===t.name?'2px solid #2c3e50':'1.5px solid #dcdcdc',background:theme===t.name?'#eaffea':'#fff',color:'#2c3e50',fontWeight:800,cursor:'pointer',fontSize:16}}>{t.name}</button>
          ))}
        </div>
        <label style={{fontWeight:700,marginBottom:4,display:'block'}}>Not</label>
        <input type="text" value={note} onChange={e=>setNote(e.target.value)} placeholder="Kısa not (isteğe bağlı)" style={{ width: "100%", padding: 12, borderRadius: 12, border: "1.5px solid #dcdcdc", marginBottom: 16, fontSize:16 }} />
        {error && <div style={{color:'#fff',background:'#e74c3c',borderRadius:10,padding:'10px 18px',marginBottom:14,display:'flex',alignItems:'center',gap:10,fontWeight:900,fontSize:16}}><span style={{fontWeight:900,fontSize:20}}>!</span> {error}</div>}
        <button className="btn-submit" style={{ width: "100%",fontWeight:900,fontSize:18,padding:'14px 0',borderRadius:12,marginBottom:8 }} onClick={handleSave}>
          Kaydet
        </button>
        <button style={{ width: "100%", background: '#eee', color: '#333', borderRadius: 12, padding: 12, fontWeight:800 }} onClick={onClose}>Vazgeç</button>
      </div>
    </div>
  );
}; 