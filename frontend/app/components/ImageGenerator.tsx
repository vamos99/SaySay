import axios from "axios";
import { useState } from "react";

export default function ImageGenerator() {
  // Prompt sabit
  const prompt = "Bir çocuk ve köpek parkta oynuyor, çizgi film tarzında, renkli ve neşeli bir sahne.";
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setImage("");
    try {
      const res = await axios.post(
        "https://generator-api-1003061737705.us-central1.run.app/generate",
        { prompt }
      );
      setImage("data:image/png;base64," + res.data.image_base64);
    } catch (err) {
      setError("Görsel üretilemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ fontWeight: 500, marginBottom: 8, textAlign: "center" }}>
        <span style={{ color: '#555' }}>Prompt:</span> <span style={{ color: '#222' }}>{prompt}</span>
      </div>
      <button onClick={handleGenerate} disabled={loading} style={{ padding: 8, borderRadius: 8 }}>
        {loading ? "Yükleniyor..." : "Görsel Üret"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {image && <img src={image} alt="Üretilen görsel" style={{ marginTop: 16, maxWidth: 400, borderRadius: 12 }} />}
    </div>
  );
} 