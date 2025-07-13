"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../utils/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();

  // Local state
  const [token,   setToken  ] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm ] = useState("");
  const [error,    setError   ] = useState<string | null>(null);
  const [success,  setSuccess ] = useState<string | null>(null);

  // 1) Sayfa yüklendiğinde hem search hem hash içinden token’ı al
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

    // Supabase SDK, fragment’teki token’ı otomatik alıp kullanacak
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess("Şifreniz başarıyla güncellendi. Giriş sayfasına yönlendiriliyorsunuz...");
      setTimeout(() => router.push("/login"), 3000);
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Şifre Yenile</h1>

      {error   && <p className="mb-4 text-red-600">{error}</p>}
      {success && <p className="mb-4 text-green-600">{success}</p>}

      {!success && token && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block mb-1">Yeni Parola</label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block mb-1">Parolayı Onayla</label>
            <input
              id="confirm"
              type="password"
              required
              minLength={6}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Şifreyi Güncelle
          </button>
        </form>
      )}
    </main>
  );
}
