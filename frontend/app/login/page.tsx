'use client';

import React, { FormEvent } from 'react';
import { DidYouKnowCard } from '@/components/DidYouKnowCard';
import { supabase } from '../utils/supabaseClient';
import Link from "next/link";

export default function LoginPage() {
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert('Giriş başarısız: ' + error.message);
    } else {
      window.location.href = '/portal';
    }
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
            <Link href="/forgot-password" className="form-link">
            Şifreni mi Unuttun?
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};