# SAY SAY Çocuk Gelişim Platformu - Frontend

## Teknolojiler
- **Next.js 15 (App Router)**
- **TypeScript**
- **Supabase** (Auth & DB)
- **Vercel** (deploy için önerilir)
- **Modern CSS (custom, responsive, animasyonlu)**

## Klasör Yapısı
```
frontend/
├── app/                  # Next.js app router kökü
│   ├── components/       # Ortak bileşenler (Header, Sidebar, Kartlar, Iconlar)
│   │   └── icons/        # Tüm custom SVG ikonlar
│   ├── portal/           # Portal ve çocuk yönetimi (ve alt componentleri)
│   │   └── components/   # Portal'a özel componentler (modal, kart, animasyon)
│   ├── contact/          # İletişim sayfası
│   ├── login/            # Giriş sayfası
│   ├── register/         # Kayıt sayfası
│   ├── styles/           # Ana CSS dosyası
│   ├── types/            # TypeScript tipleri
│   ├── utils/            # AuthContext, Supabase client vb.
│   └── constants.ts      # Sabitler
├── public/               # Statik dosyalar ve görseller
├── .env.example          # Lokal env şablonu
├── .env.local            # Lokal gizli değerler (commit edilmez)
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md
```

## Özellikler
- Supabase Auth ile ebeveyn girişi, çocuk profili yönetimi
- Rol bazlı yönlendirme, global session yönetimi (AuthContext)
- Responsive, modern ve animasyonlu custom UI/UX
- Tüm ikonlar ve loading ekranı custom SVG, emoji yok
- Portal/Sidebar yapısı, açılır/kapanır, animasyonlu
- Çocuk ekleme, modal ve localStorage ile ilk giriş kontrolü
- .env.local ile güvenli anahtar yönetimi
- Server-only Gemini key kullanımı için `/api/oyun3/generate` route'u

## Kurulum & Çalıştırma

### Frontend
```bash
cd frontend
npm install
npm run typecheck
npm run dev
```

`.env.local` dosyasını `frontend/.env.example` üzerinden oluşturun.

### Backend (Oyun2 için gerekli)
```bash
cd backend/generator
pip install -r requirements.txt
python -m uvicorn api:app --reload --host 0.0.0.0 --port 8000
```

### Ortam Değişkenleri
Frontend için `frontend/.env.local` dosyasını oluşturun:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
GEMINI_API_KEY=your_gemini_api_key
```

Backend için `backend/generator/config.env` dosyasını `config.env.example`
üzerinden oluşturun:
```env
GOOGLE_AI_API_KEY=your_google_ai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GCP_PROJECT_ID=your_gcp_project_id
```

## Build & Deploy
```bash
npm run build
# Vercel veya dilediğin Next.js hosting ile kolayca deploy edebilirsin
```

## Notlar
- Tüm gereksiz dosya ve eski Vite/React yapısı kaldırıldı.
- Klasörler ve componentler modern Next.js mimarisine göre ayrıldı.
- .env.local, .next, node_modules, guideline.txt vb. .gitignore'a eklendi.
- Servis anahtarları lokal env veya deployment secret olarak yönetilmelidir.

---
Her türlü katkı, öneri ve geri bildirim için PR veya issue açabilirsin. 
