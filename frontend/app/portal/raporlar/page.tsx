"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

// Gelecekte eklenecek: Çocuk seçici, tarih aralığı seçici, grafik ve tablo için placeholderlar

const RaporlarPage = () => {
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'ebeveyn' | 'psikolog'>('ebeveyn');
  // Simüle veri ve loading (ileride gerçek veriyle değiştirilebilir)
  const [data, setData] = useState<any[]>([]); // Tablo ve grafik için veri

  useEffect(() => {
    // Simüle loading (2 saniye sonra veri gelir)
    setLoading(true);
    setTimeout(() => {
      setData([]); // Boş veriyle başlat, örnek için
      setLoading(false);
    }, 1200);
  }, []);

  const router = useRouter();

  return (
    <div style={{ padding: "32px 0 0 0", minHeight: "100vh", background: "#FFF8E7", overflow: "auto" }}>
      {/* Back button */}
      <button onClick={()=>router.push('/portal')} style={{position:'absolute',top:24,left:40,zIndex:20,background:'#fffbe6',border:'none',borderRadius:12,padding:'10px 24px',fontWeight:800,fontSize:18,boxShadow:'0 2px 8px #ffd600',color:'#2c3e50',cursor:'pointer'}}>← Geri</button>
      <div style={{ maxWidth: 900, margin: "0 auto", position: 'relative' }}>
        {/* Sağ üstte rol seçici kutucuklar */}
        <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: 12 }}>
          <button
            onClick={() => setRole('ebeveyn')}
            style={{
              background: role === 'ebeveyn' ? '#F7B801' : '#fff',
              color: role === 'ebeveyn' ? '#2c3e50' : '#7b8fa1',
              border: '2px solid #F7B801',
              borderRadius: 12,
              padding: '10px 22px',
              fontWeight: 800,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: role === 'ebeveyn' ? '0 2px 8px #f7b80133' : 'none',
              transition: 'all 0.2s',
            }}
          >
            👨‍👩‍👧‍👦 Ebeveyn
          </button>
          <button
            onClick={() => setRole('psikolog')}
            style={{
              background: role === 'psikolog' ? '#27ae60' : '#fff',
              color: role === 'psikolog' ? '#fff' : '#7b8fa1',
              border: '2px solid #27ae60',
              borderRadius: 12,
              padding: '10px 22px',
              fontWeight: 800,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: role === 'psikolog' ? '0 2px 8px #27ae6033' : 'none',
              transition: 'all 0.2s',
            }}
          >
            🧑‍⚕️ Psikolog
          </button>
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>Raporlar</h2>
        {/* Rol bazlı özel kutu ve içerik */}
        {role === 'ebeveyn' && !loading && (
          <>
            <div style={{ background: '#fffbe6', border: '2px solid #F7B801', borderRadius: 16, padding: 20, marginBottom: 24, fontWeight: 700, color: '#2c3e50', fontSize: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span role="img" aria-label="lightbulb">💡</span>
              Çocuğunuzun gelişimini görmek için haftalık raporları inceleyin! Birlikte oyun oynayarak öğrenmeyi daha eğlenceli hale getirebilirsiniz.
            </div>
            {/* Ebeveyn için temel bilgiler */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
              <div style={{ background: "#F6F8FC", borderRadius: 16, padding: 24, minWidth: 180 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>Son Giriş</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#F7B801" }}>14.07.2024 10:00</div>
              </div>
              <div style={{ background: "#F6F8FC", borderRadius: 16, padding: 24, minWidth: 180 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>Bitirdiği Oyunlar</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#F7B801" }}>Kavram Oyunu, Hafıza Oyunu</div>
              </div>
              <div style={{ background: "#F6F8FC", borderRadius: 16, padding: 24, minWidth: 180 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>Tamamlanan Görevler</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#F7B801" }}>8</div>
              </div>
            </div>
          </>
        )}
        {role === 'psikolog' && !loading && (
          <>
            <div style={{ background: '#eafaf1', border: '2px solid #27ae60', borderRadius: 16, padding: 20, marginBottom: 24, fontWeight: 700, color: '#14532d', fontSize: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span role="img" aria-label="chart">📊</span>
              Davranışsal Özet: Son 1 ayda oyun oynama sıklığı %12 arttı. Görev tamamlama oranı %78. Dikkat süresi ortalaması 14 dakika. En çok oynanan oyun: Kavram Oyunu.
            </div>
            {/* Psikolog için detaylı analizler */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
              <div style={{ background: "#d1f2eb", borderRadius: 16, padding: 24, minWidth: 180 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>Oyun Sıklığı (Haftalık)</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#27ae60" }}>12</div>
              </div>
              <div style={{ background: "#d1f2eb", borderRadius: 16, padding: 24, minWidth: 180 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>Görev Tamamlama Oranı</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#27ae60" }}>78%</div>
              </div>
              <div style={{ background: "#d1f2eb", borderRadius: 16, padding: 24, minWidth: 180 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>Dikkat Süresi Ort.</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#27ae60" }}>14 dk</div>
              </div>
              <div style={{ background: "#d1f2eb", borderRadius: 16, padding: 24, minWidth: 180 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>En Çok Oynanan Oyun</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#27ae60" }}>Kavram Oyunu</div>
              </div>
            </div>
            {/* Psikolog için ek analiz/grafik alanı (placeholder) */}
            <div style={{ background: "#eafaf1", borderRadius: 16, padding: 32, marginBottom: 32, minHeight: 120, textAlign: "center", color: "#27ae60" }}>
              [Haftalık gelişim trendi ve davranışsal analiz grafiği burada olacak]
            </div>
          </>
        )}
        {/* Filtreler */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <select style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }}>
            <option>Çocuk Seç</option>
            <option>adada</option>
            <option>aaaa</option>
          </select>
          <input type="date" style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }} />
          <input type="date" style={{ padding: 8, borderRadius: 8, border: "1px solid #ddd" }} />
        </div>
        {/* Özet Kutuları */}
        <div style={{ display: "flex", gap: 24, marginBottom: 32 }}>
          <div style={{ background: "#F6F8FC", borderRadius: 16, padding: 24, minWidth: 180 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Toplam Oyun</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#F7B801" }}>12</div>
          </div>
          <div style={{ background: "#F6F8FC", borderRadius: 16, padding: 24, minWidth: 180 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Tamamlanan Görev</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#F7B801" }}>8</div>
          </div>
          <div style={{ background: "#F6F8FC", borderRadius: 16, padding: 24, minWidth: 180 }}>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Son Giriş</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#F7B801" }}>14.07.2024</div>
          </div>
        </div>
        {/* Yükleniyor animasyonu */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 16 }}>
            <div className="loader" style={{ width: 48, height: 48, border: "6px solid #f3f3f3", borderTop: "6px solid #F7B801", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <span style={{ color: "#7b8fa1", fontWeight: 700, fontSize: 18 }}>Yükleniyor...</span>
            <style>{`@keyframes spin {0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}</style>
          </div>
        ) : (
          <>
            {/* Grafik Placeholder veya Boş Veri Mesajı */}
            <div style={{ background: "#F6F8FC", borderRadius: 16, padding: 32, marginBottom: 32, minHeight: 200, textAlign: "center", color: "#bbb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {data.length === 0 ? (
                <div>
                  <div style={{ fontWeight: 700, color: "#e67e22", fontSize: 20, marginBottom: 8 }}>Henüz veri yok</div>
                  <div style={{ color: "#7b8fa1", fontWeight: 500, fontSize: 16 }}>Çocuğunuz oyun oynadıkça burada gelişim grafikleri gözükecek.</div>
                </div>
              ) : (
                "[Burada skor/görev grafiği olacak]"
              )}
            </div>
            {/* Tablo veya Boş Veri Mesajı */}
            <div style={{ background: "#F6F8FC", borderRadius: 16, padding: 24, minHeight: 120 }}>
              <div style={{ fontWeight: 600, marginBottom: 12 }}>Detaylı Liste</div>
              {data.length === 0 ? (
                <div style={{ color: "#7b8fa1", fontWeight: 500, fontSize: 16, padding: 24, textAlign: "center" }}>
                  Henüz raporlanacak veri yok.<br />
                  <span style={{ color: "#e67e22" }}>Çocuğunuz oyun oynadıkça ve görev tamamladıkça burada detaylar gözükecek.</span>
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#f0f0f0" }}>
                      <th style={{ padding: 8, borderRadius: 8, textAlign: "left" }}>Tarih</th>
                      <th style={{ padding: 8, borderRadius: 8, textAlign: "left" }}>Oyun</th>
                      <th style={{ padding: 8, borderRadius: 8, textAlign: "left" }}>Skor</th>
                      <th style={{ padding: 8, borderRadius: 8, textAlign: "left" }}>Görev</th>
                      <th style={{ padding: 8, borderRadius: 8, textAlign: "left" }}>Giriş Saati</th>
                      <th style={{ padding: 8, borderRadius: 8, textAlign: "left" }}>Çıkış Saati</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Örnek veriyle doldurulacak */}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
      {/* Sağ alt köşe: Raporu İndir butonu ve açılır menü */}
      <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 1000 }}>
        <button
          onClick={() => setShowDownloadOptions((v) => !v)}
          style={{
            background: "#F7B801",
            color: "#2c3e50",
            border: "none",
            borderRadius: 24,
            padding: "16px 32px",
            fontWeight: 800,
            fontSize: 18,
            boxShadow: "0 2px 12px #f7b80133",
            cursor: "pointer",
            transition: "all 0.2s",
            position: "relative"
          }}
        >
          Raporu İndir
        </button>
        {showDownloadOptions && (
          <div style={{
            position: "absolute",
            bottom: "110%",
            right: 0,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            background: "#fff",
            borderRadius: 16,
            boxShadow: "0 2px 12px #bbb",
            padding: 16,
            minWidth: 140,
            alignItems: "stretch"
          }}>
            <button style={{
              background: "#e74c3c",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "10px 0",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer"
            }}>
              PDF
            </button>
            <button style={{
              background: "#27ae60",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "10px 0",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer"
            }}>
              Excel
            </button>
            <button style={{
              background: "#2980b9",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "10px 0",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer"
            }}>
              Word
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RaporlarPage;