import React, { FormEvent } from 'react';
import { DidYouKnowCard } from '../components/DidYouKnowCard';

export const LoginPage: React.FC = () => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Handle login logic
  };

  return (
    <div className="page-container container page-container-centered">
      <div className="login-page-layout">
        <DidYouKnowCard />
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="email" id="email" required placeholder="E-Posta" />
            </div>
            <div className="form-group">
              <input type="password" id="password" required placeholder="Şifre" />
            </div>
            <button type="submit" className="btn-submit">Giriş</button>
            <a href="#/forgot-password" className="form-link">Şifreni mi Unuttun?</a>
          </form>
        </div>
      </div>
    </div>
  );
}; 