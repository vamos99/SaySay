import React, { FormEvent } from 'react';

export const ContactPage: React.FC = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle contact form submission
  };

  return (
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
  );
}; 