"use client";

import { FormEvent, useState } from "react";
import { supabase } from "../utils/supabaseClient";  // doğru relative yolu kontrol edin

export default function ForgotPasswordPage() {
  const [email, setEmail]       = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);

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
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Şifremi Unuttum</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">E-posta Adresiniz</label>
          <input
            id="email"
            type="email"
            required
            placeholder="parent@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Mail Gönder
        </button>
      </form>

      {error && (
        <p className="mt-4 text-red-600">{error}</p>
      )}
      {success && (
        <p className="mt-4 text-green-600">{success}</p>
      )}
    </main>
  );
}
