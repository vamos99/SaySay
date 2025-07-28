"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation';

const categories = [
  { key: "user", label: "Kullanıcı Ayarları" },
  { key: "notifications", label: "Bildirim Ayarları" },
  { key: "theme", label: "Tema Ayarları" },
  { key: "privacy", label: "Gizlilik ve Güvenlik" },
  { key: "language", label: "Dil Ayarları" },
];

const SettingsPage = () => {
  const [active, setActive] = useState("user");
  const [name, setName] = useState("Mevcut Kullanıcı");
  const [email, setEmail] = useState("kullanici@example.com");
  const [password, setPassword] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [message, setMessage] = useState("");
  const [theme, setTheme] = useState("light");
  const [language, setLanguage] = useState("tr");

  const router = useRouter();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Ayarlar kaydedildi! (Demo)");
    setTimeout(() => setMessage(""), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fdf6e3', padding: '40px 0 0 0', position: 'relative' }}>
      {/* Back button */}
      <button onClick={()=>router.push('/portal')} style={{position:'absolute',top:24,left:40,zIndex:20,background:'#fffbe6',border:'none',borderRadius:12,padding:'10px 24px',fontWeight:800,fontSize:18,boxShadow:'0 2px 8px #ffd600',color:'#2c3e50',cursor:'pointer'}}>← Geri</button>
      <div style={{ maxWidth: 600, margin: "40px auto", background: "#fff", borderRadius: 18, boxShadow: "0 2px 16px #eee", padding: 32 }}>
        <h2 style={{ fontWeight: 800, fontSize: 28, marginBottom: 24, color: "#2c3e50" }}>Ayarlar</h2>
        {/* Kategori butonları */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActive(cat.key)}
              style={{
                background: active === cat.key ? '#F7B801' : '#f6f8fc',
                color: active === cat.key ? '#2c3e50' : '#7b8fa1',
                border: active === cat.key ? '2px solid #F7B801' : '2px solid #f6f8fc',
                borderRadius: 12,
                padding: '10px 18px',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                boxShadow: active === cat.key ? '0 2px 8px #f7b80133' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
        {/* Aktif kategoriye göre form */}
        {active === "user" && (
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div>
              <label style={{ fontWeight: 700, color: "#7b8fa1" }}>Ad Soyad</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid #dcdcdc", fontSize: 16, marginTop: 6 }} />
            </div>
            <div>
              <label style={{ fontWeight: 700, color: "#7b8fa1" }}>E-posta</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid #dcdcdc", fontSize: 16, marginTop: 6 }} />
            </div>
            <div>
              <label style={{ fontWeight: 700, color: "#7b8fa1" }}>Şifre Değiştir</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Yeni şifre" style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid #dcdcdc", fontSize: 16, marginTop: 6 }} />
            </div>
            <button type="submit" style={{ background: "#F7B801", color: "#2c3e50", border: "none", borderRadius: 12, padding: "14px 0", fontWeight: 800, fontSize: 18, cursor: "pointer", marginTop: 10 }}>Kaydet</button>
            {message && <div style={{ color: '#27ae60', fontWeight: 700, marginTop: 8 }}>{message}</div>}
          </form>
        )}
        {active === "notifications" && (
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input type="checkbox" checked={notifications} onChange={e => setNotifications(e.target.checked)} id="notifications" />
              <label htmlFor="notifications" style={{ fontWeight: 700, color: "#7b8fa1", cursor: "pointer" }}>Bildirimleri Aç</label>
            </div>
            <button type="submit" style={{ background: "#F7B801", color: "#2c3e50", border: "none", borderRadius: 12, padding: "14px 0", fontWeight: 800, fontSize: 18, cursor: "pointer", marginTop: 10 }}>Kaydet</button>
            {message && <div style={{ color: '#27ae60', fontWeight: 700, marginTop: 8 }}>{message}</div>}
          </form>
        )}
        {active === "theme" && (
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div>
              <label style={{ fontWeight: 700, color: "#7b8fa1" }}>Tema Seçimi</label>
              <select value={theme} onChange={e => setTheme(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid #dcdcdc", fontSize: 16, marginTop: 6 }}>
                <option value="light">Açık Mod</option>
                <option value="dark">Koyu Mod</option>
              </select>
            </div>
            <button type="submit" style={{ background: "#F7B801", color: "#2c3e50", border: "none", borderRadius: 12, padding: "14px 0", fontWeight: 800, fontSize: 18, cursor: "pointer", marginTop: 10 }}>Kaydet</button>
            {message && <div style={{ color: '#27ae60', fontWeight: 700, marginTop: 8 }}>{message}</div>}
          </form>
        )}
        {active === "privacy" && (
          <div style={{ color: '#7b8fa1', fontWeight: 700, fontSize: 17, padding: 18 }}>
            Gizlilik ve güvenlik ayarları yakında burada olacak.<br />
            (Hesap silme, oturum yönetimi, veri paylaşım izinleri vb.)
          </div>
        )}
        {active === "language" && (
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div>
              <label style={{ fontWeight: 700, color: "#7b8fa1" }}>Dil Seçimi</label>
              <select value={language} onChange={e => setLanguage(e.target.value)} style={{ width: "100%", padding: 12, borderRadius: 10, border: "1.5px solid #dcdcdc", fontSize: 16, marginTop: 6 }}>
                <option value="tr">Türkçe</option>
                <option value="en">English</option>
              </select>
            </div>
            <button type="submit" style={{ background: "#F7B801", color: "#2c3e50", border: "none", borderRadius: 12, padding: "14px 0", fontWeight: 800, fontSize: 18, cursor: "pointer", marginTop: 10 }}>Kaydet</button>
            {message && <div style={{ color: '#27ae60', fontWeight: 700, marginTop: 8 }}>{message}</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default SettingsPage; 