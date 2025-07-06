import React, { FormEvent } from 'react';

export const RegisterPage: React.FC = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle registration logic
  };

  return (
    <div className="page-container container">
      <div className="form-container form-container-lg">
        <h2 className="form-title">Yeni Bir Hesap Oluştur</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="firstName">Adın</label>
              <input type="text" id="firstName" required/>
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Soyadın</label>
              <input type="text" id="lastName" required/>
            </div>
            <div className="form-group">
              <label htmlFor="dob">gün/ay/yıl</label>
              <input type="date" id="dob" required/>
            </div>
            <div className="form-group">
              <label htmlFor="phone">Telefon</label>
              <input type="tel" id="phone" />
            </div>
            <div className="form-group full-width">
              <label htmlFor="reg-email">E-Posta</label>
              <input type="email" id="reg-email" required/>
            </div>
            <div className="form-group full-width">
              <label htmlFor="reg-password">Yeni Şifre</label>
              <input type="password" id="reg-password" required/>
            </div>
          </div>
          <div className="checkbox-group">
            <div className="checkbox-item"><input type="checkbox" id="gender-f"/> <label htmlFor="gender-f">Kadın</label></div>
            <div className="checkbox-item"><input type="checkbox" id="gender-m"/> <label htmlFor="gender-m">Erkek</label></div>
          </div>
          <div className="checkbox-group">
            <div className="checkbox-item"><input type="checkbox" id="literate"/> <label htmlFor="literate">Okuma Yazma Biliyor</label></div>
            <div className="checkbox-item"><input type="checkbox" id="not-literate"/> <label htmlFor="not-literate">Okuma Yazma Bilmiyor</label></div>
          </div>
          <div className="checkbox-group">
            <div className="checkbox-item"><input type="checkbox" id="special-needs"/> <label htmlFor="special-needs">Özel Gereksinimli?</label></div>
          </div>
          <button type="submit" className="btn-submit">Kayıt Ol</button>
        </form>
      </div>
    </div>
  );
}; 