'use client';

import React, { FormEvent } from 'react';
import { supabase } from '../utils/supabaseClient';
import toast, { Toaster } from 'react-hot-toast';

export default function ContactPage() {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const name = (document.getElementById('contact-name') as HTMLInputElement).value;
    const email = (document.getElementById('contact-email') as HTMLInputElement).value;
    const subject = (document.getElementById('contact-subject') as HTMLInputElement).value;
    const message = (document.getElementById('contact-message') as HTMLTextAreaElement).value;
    const { error } = await supabase.from('contact_messages').insert([{ name, email, subject, message }]);
    if (error) {
      toast.error('Mesaj gönderilemedi: ' + error.message);
    } else {
      toast.success('Mesajınız başarıyla gönderildi!');
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <div className="page-container container">
        <div className="form-container form-container-lg">
          <h2 className="form-title">İletişim</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="contact-name">Adınız</label>
              <input type="text" id="contact-name" required/>
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">E-Posta</label>
              <input type="email" id="contact-email" required/>
            </div>
            <div className="form-group">
              <label htmlFor="contact-subject">Konu</label>
              <input type="text" id="contact-subject" required/>
            </div>
            <div className="form-group">
              <label htmlFor="contact-message">Mesajınız</label>
              <textarea id="contact-message" rows={5} required></textarea>
            </div>
            <button type="submit" className="btn-submit">Gönder</button>
          </form>
        </div>
      </div>
    </>
  );
};