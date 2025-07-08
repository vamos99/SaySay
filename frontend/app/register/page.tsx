'use client';

import React, { FormEvent } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function RegisterPage() {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const email = (document.getElementById('reg-email') as HTMLInputElement).value;
    const password = (document.getElementById('reg-password') as HTMLInputElement).value;
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert('Kayıt başarısız: ' + error.message);
    } else {
      alert('Kayıt başarılı! Lütfen e-postanızı kontrol edin.');
      window.location.href = '/login';
    }
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
          <button type="submit" className="btn-submit">Kayıt Ol</button>
        </form>
      </div>
    </div>
  );
};