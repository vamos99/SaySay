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
├── .env.local            # Supabase anahtarları (örnek: .env.local.example)
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
- Tüm kodlar clean code ve guideline.txt'ye tam uyumlu
- .env.local ile güvenli anahtar yönetimi
- Production-ready, gereksiz dosya ve kod yok

## Kurulum & Çalıştırma
```bash
cd frontend
npm install
npm run dev
# .env.local dosyanı oluşturmayı unutma!
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
- Kodlar guideline ve kullanıcı taleplerine %100 uyumlu, test edildi ve onaylandı.

---
Her türlü katkı, öneri ve geri bildirim için PR veya issue açabilirsin. 