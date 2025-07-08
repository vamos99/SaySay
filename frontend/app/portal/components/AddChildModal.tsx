import React, { useRef } from 'react';

interface AddChildModalProps {
  onAdd: (name: string) => void;
  onClose: () => void;
}

export const AddChildModal: React.FC<AddChildModalProps> = ({ onAdd, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.18)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 18, padding: 32, minWidth: 320, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" }}>
        <h2 style={{ margin: 0, fontWeight: 800, color: "#2c3e50" }}>Çocuk Ekle</h2>
        <p style={{ margin: "12px 0 24px 0" }}>Çocuğunuzun adını ve bilgilerini girin.</p>
        <input ref={inputRef} type="text" placeholder="Adı" style={{ width: "100%", padding: 8, borderRadius: 8, border: "1.5px solid #dcdcdc", marginBottom: 12 }} />
        <button className="btn-submit" style={{ width: "100%" }} onClick={() => {
          const name = inputRef.current?.value;
          if (name) onAdd(name);
        }}>
          Kaydet
        </button>
        <button style={{ marginTop: 8, width: "100%", background: '#eee', color: '#333', borderRadius: 8, padding: 8 }} onClick={onClose}>Vazgeç</button>
      </div>
    </div>
  );
}; 