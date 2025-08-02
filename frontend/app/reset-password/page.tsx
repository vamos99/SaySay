"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();

  // Local state
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 1) Sayfa yüklendiğinde hem search hem hash içinden token'ı al
  useEffect(() => {
    // ?access_token=XYZ
    const search = new URLSearchParams(window.location.search);
    let t = search.get("access_token");

    // #access_token=XYZ&type=...
    if (!t && window.location.hash) {
      const hash = new URLSearchParams(window.location.hash.slice(1));
      t = hash.get("access_token");
    }

    setToken(t);
    if (!t) {
      setError("Geçerli bir şifre sıfırlama bağlantısı değil.");
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Parolalar eşleşmiyor.");
      return;
    }

    // Supabase SDK, fragment'teki token'ı otomatik alıp kullanacak
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f0fdf4, #ffffff, #f0f9ff)',
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
          background: 'linear-gradient(to right, #059669, #0ea5e9)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Şifre Yenile
        </h1>

        {error && (
          <p style={{
            marginBottom: '1rem',
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
            marginBottom: '1rem',
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

        {!success && token && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="password" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                Yeni Parola
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
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

            <div style={{ marginBottom: '2rem' }}>
              <label htmlFor="confirm" style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: '500',
                color: '#374151'
              }}>
                Parolayı Onayla
              </label>
              <input
                id="confirm"
                type="password"
                required
                minLength={6}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
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
                background: 'linear-gradient(to right, #059669, #0ea5e9)',
                color: 'white',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                fontWeight: '600',
                fontSize: '1rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px rgba(5, 150, 105, 0.2)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 15px rgba(5, 150, 105, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(5, 150, 105, 0.2)';
              }}
            >
              Şifreyi Güncelle
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
