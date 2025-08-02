"use client";

import { FormEvent, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) setError(error.message);
    else setSuccess("Şifre sıfırlama maili gönderildi. Gelen kutunuzu kontrol edin.");
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #fef3c7, #ffffff, #f0f9ff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '28rem',
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '2rem',
          background: 'linear-gradient(to right, #f59e0b, #3b82f6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Şifremi Unuttum
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="email" style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '500',
              color: '#374151'
            }}>
              E-posta Adresiniz
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="parent@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                transition: 'border-color 0.2s ease'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: 'linear-gradient(to right, #f59e0b, #3b82f6)',
              color: 'white',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 6px rgba(245, 158, 11, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 15px rgba(245, 158, 11, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(245, 158, 11, 0.2)';
            }}
          >
            Mail Gönder
          </button>
        </form>

        {error && (
          <p style={{
            marginTop: '1rem',
            color: '#dc2626',
            textAlign: 'center',
            padding: '0.75rem',
            background: '#fef2f2',
            borderRadius: '0.5rem',
            border: '1px solid #fecaca'
          }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{
            marginTop: '1rem',
            color: '#059669',
            textAlign: 'center',
            padding: '0.75rem',
            background: '#f0fdf4',
            borderRadius: '0.5rem',
            border: '1px solid #bbf7d0'
          }}>
            {success}
          </p>
        )}
      </div>
    </div>
  );
}
