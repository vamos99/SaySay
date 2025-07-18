"use client";
import React, { useEffect, useState } from "react";
import { PortalSidebar } from "@/components/PortalSidebar";
import { useRouter } from "next/navigation";
import { supabase } from "../../../utils/supabaseClient";
import LoadingScreen from "@/components/LoadingScreen";
import { ExpandSidebarIcon } from '@/components/icons/ExpandSidebarIcon';

export default function Oyun1Page() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [child, setChild] = useState<any>(null);
  const [roadmap, setRoadmap] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState<null|"dogru"|"yanlis"|"disabled">(null);
  const [questionText, setQuestionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kullanıcıdan seçili çocuk id'sini al
  useEffect(() => {
    const selectedId = typeof window !== 'undefined' ? localStorage.getItem('selected_child_id') : null;
    if (!selectedId) { router.push('/portal'); return; }
    setLoading(true);
    setError(null);
    Promise.all([
      supabase.from('children').select('id, theme, age, wants_tts').eq('id', selectedId).single(),
      supabase.from('concept_roadmap').select('concepts_order').eq('child_id', selectedId).single()
    ]).then(async ([childRes, roadmapRes]) => {
      if (!childRes.data) { setError('Çocuk bulunamadı.'); router.push('/portal'); return; }
      setChild(childRes.data);
      const conceptIds = roadmapRes.data?.concepts_order || [];
      if (!conceptIds.length) { setLoading(false); setError('Kavram bulunamadı.'); return; }
      const { data: categories, error: catErr } = await supabase.from('categories').select('id, name').in('id', conceptIds);
      if (catErr) { setError('Kavramlar yüklenemedi.'); setLoading(false); return; }
      setRoadmap(categories || []);
      const firstConcept = categories?.[0];
      if (!firstConcept) { setLoading(false); setError('Kavram bulunamadı.'); return; }
      const { data: itemsData, error: itemsErr } = await supabase.from('items').select('id, name, is_correct, themes, category_id, image_url').eq('category_id', firstConcept.id).contains('themes', [childRes.data.theme]);
      if (itemsErr) { setError('Seçenekler yüklenemedi.'); setLoading(false); return; }
      setItems(itemsData && itemsData.length > 1 ? shuffleArray(itemsData) : (itemsData || []));
      setLoading(false);
    }).catch(() => {
      setError('Veri yüklenirken hata oluştu.');
      setLoading(false);
    });
  }, [router]);

  // Shuffle sadece veri ilk çekildiğinde yapılır, ekstra useEffect yok
  function shuffleArray(array: any[]) {
    return array.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
  }

  // Dinamik prompt oluşturucu
  function createDynamicPrompt({ theme, concept, items, age }: { theme: string, concept: string, items: string[], age: number }) {
    return `Sen bir çocuk oyun asistanısın. ${age} yaşında bir çocuk için, tema: ${theme}, kavram: ${concept}, seçenekler: ${items.join(", ")}. Sadece 1 kısa, eğlenceli ve anlaşılır soru üret. Maksimum 20 kelime, tek cümle, çocuk dostu, Türkçe. Sadece soruyu döndür, açıklama veya hikaye ekleme.`;
  }

  // Soru ve sesli anlatım üretimi (değişmedi)
  useEffect(() => {
    async function generateQuestion() {
      if (!child || !roadmap.length || !items.length) return;
      setIsLoading(true);
      setError(null);
      try {
        const prompt = createDynamicPrompt({
          theme: child.theme,
          concept: roadmap[0]?.name,
          items: items.map(i => i.name),
          age: child.age || 5
        });
        const text = await fetchGeminiText(prompt);
        setQuestionText(text);
        // Seslendirme: window.speechSynthesis ile
        if (child.wants_tts && text) {
          const utter = new window.SpeechSynthesisUtterance(text);
          utter.lang = 'tr-TR';
          utter.rate = 1;
          utter.pitch = 1.1;
          window.speechSynthesis.speak(utter);
        }
      } catch (e) {
        setError('Soru oluşturulamadı.');
      }
      setIsLoading(false);
    }
    generateQuestion();
    // eslint-disable-next-line
  }, [child, roadmap, items]);

  // Cevap seçimi
  const handleSelect = (item: any) => {
    if (feedback === 'disabled') return;
    const isCorrect = typeof item.is_correct === 'boolean' ? item.is_correct : item.id === items[0]?.id;
    if (isCorrect) {
      setFeedback("dogru");
      setTimeout(() => { setFeedback(null); setCurrent(c => c+1); }, 1200);
    } else {
      setFeedback("yanlis");
      setTimeout(() => setFeedback("disabled"), 400); // kısa süreli disable
      setTimeout(() => setFeedback(null), 1200);
    }
  };

  if (loading) return <LoadingScreen />;
  if (error) return <div style={{padding:40, color:'#e74c3c', fontWeight:700}}>{error}</div>;
  if (!child || !roadmap.length || !items.length) return <div style={{padding:40}}>Oynamak için önce kavram ve tema seçmelisiniz.</div>;

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'var(--light-blue-bg)'}}>
      <PortalSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      {!sidebarOpen && (
        <button
          className="sidebar-expand-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Menüyü Aç"
        >
          <ExpandSidebarIcon />
        </button>
      )}
      <main style={{flex:1,padding:'40px 0 0 0',minHeight:'100vh',background:'var(--light-blue-bg)'}}>
        <div style={{maxWidth:700,margin:'0 auto',padding:'0 24px'}}>
          <h1 style={{fontWeight:900,fontSize:'2rem',color:'var(--dark-text)',marginBottom:24}}>Kavram Oyunu</h1>
          <div style={{marginBottom:24,fontWeight:700,fontSize:20,color:'var(--primary-yellow)'}}>Kavram: {roadmap[0]?.name} | Tema: {child.theme}</div>
          {isLoading ? (
            <div className="question-loading">Soru hazırlanıyor...</div>
          ) : (
            <div className="question-text">{questionText}</div>
          )}
          <div style={{display:'flex',gap:32,flexWrap:'wrap',justifyContent:'center'}}>
            {items.map((item:any, i:number) => (
              <button key={item.id} onClick={()=>handleSelect(item)} disabled={feedback==='disabled'} style={{background:'#fff',border:'2.5px solid #e0b97d',borderRadius:18,padding:24,minWidth:160,minHeight:160,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:20,boxShadow:'0 2px 8px #f0f0f0',color:'#2c3e50',cursor:feedback==='disabled'?'not-allowed':'pointer',transition:'all 0.2s',outline:feedback && item.is_correct && feedback==='dogru' ? '3px solid #4CAF50' : feedback && !item.is_correct && feedback==='yanlis' ? '3px solid #e74c3c' : 'none',opacity:feedback && !item.is_correct && feedback==='dogru' ? 0.5 : 1}}>
                <img src={item.image_url} alt={item.name} style={{width:80,height:80,marginBottom:12}} />
                {item.name}
              </button>
            ))}
          </div>
          {feedback === 'dogru' && <div style={{marginTop:32,fontWeight:900,fontSize:28,color:'#4CAF50'}}>Doğru! 🎉</div>}
          {feedback === 'yanlis' && <div style={{marginTop:32,fontWeight:900,fontSize:28,color:'#e74c3c'}}>Yanlış! Tekrar dene.</div>}
        </div>
      </main>
    </div>
  );
}

// Yeni yardımcı fonksiyonlar
// Gemini 2.5 Flash text endpoint ile metin üretimi
async function fetchGeminiText(prompt: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { response_mime_type: 'text/plain' }
  };
  try {
    const response = await fetch(endpoint + '?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const err = await response.text();
      console.log('Gemini Text Hatası:', err);
      return '';
    }
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (e) {
    console.log('Gemini Text Hatası:', e);
    return '';
  }
}

// Base64 to Blob yardımcı fonksiyonu
function b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
}

async function fetchGeminiQuestionAndTTS({ theme, concept, items }: { theme: string, concept: string, items: string[] }): Promise<{text: string, audioUrl: string}> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  // Prompt otomatik oluşturuluyor
  const prompt = `Tema: ${theme}\nKavram: ${concept}\nGörseller: ${items.join(', ')}\nLütfen 5 yaşındaki bir çocuğa, hangi ${items[0].toLowerCase()} daha büyük olduğunu soran, sevecen ve eğlenceli bir soru üret.`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  };
  try {
    const response = await fetch(endpoint + '?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    // Sadece metin döner
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return { text, audioUrl: '' };
  } catch (e) {
    return { text: '', audioUrl: '' };
  }
}

// Oyun akışında, yeni soru geldiğinde çağır:
// örnek kullanım:
// const { text, audioUrl } = await fetchGeminiQuestionAndTTS({ theme: child.theme, concept: roadmap[0]?.name, items: items.map(i=>i.name) });
// setQuestionText(text); new Audio(audioUrl).play(); 
// setQuestionText(text); new Audio(audioUrl).play(); 