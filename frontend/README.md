# Frontend - SAY SAY Çocuk Gelişim Platformu

Bu klasör, SAY SAY çocuk gelişim platformunun frontend uygulamasını içerir.

## Teknolojiler

- **React 19** - Modern React kütüphanesi
- **TypeScript** - Tip güvenliği
- **Vite** - Hızlı build tool
- **CSS3** - Stil dosyaları

## Proje Yapısı

```
frontend/
├── src/                  # Kaynak kodlar
│   ├── components/       # Yeniden kullanılabilir bileşenler
│   ├── pages/           # Sayfa bileşenleri
│   ├── styles/          # Stil dosyaları
│   ├── assets/          # Görseller
│   ├── types/           # TypeScript tip tanımları
│   ├── utils/           # Yardımcı fonksiyonlar
│   ├── hooks/           # Custom React hooks
│   ├── App.tsx          # Ana uygulama bileşeni
│   └── main.tsx         # Uygulama giriş noktası
├── index.html           # HTML şablonu
├── package.json         # Proje bağımlılıkları
├── tsconfig.json        # TypeScript yapılandırması
├── vite.config.ts       # Vite yapılandırması
├── .gitignore           # Git ignore dosyası
└── README.md            # Bu dosya
```

### Detaylı Yapı

```
src/
├── components/          # Yeniden kullanılabilir bileşenler
│   ├── Header.tsx       # Navigasyon header'ı
│   ├── FeatureCard.tsx  # Özellik kartları
│   └── DidYouKnowCard.tsx # Bilgi kartı
├── pages/              # Sayfa bileşenleri
│   ├── HomePage.tsx     # Ana sayfa
│   ├── LoginPage.tsx    # Giriş sayfası
│   ├── RegisterPage.tsx # Kayıt sayfası
│   └── ContactPage.tsx  # İletişim sayfası
├── styles/             # Stil dosyaları
│   └── index.css       # Ana CSS dosyası
├── assets/             # Görseller
│   ├── saysay.png      # SAY SAY logosu
│   ├── nedir.png       # NEDİR logosu
│   ├── kid.png         # Çocuk görseli
│   ├── dog.png         # Köpek görseli
│   └── comment.png     # Yorum simgesi
├── types/              # TypeScript tip tanımları
│   └── index.ts        # Interface'ler
├── utils/              # Yardımcı fonksiyonlar
│   └── constants.ts    # Sabit değerler
├── hooks/              # Custom React hooks
│   └── useNavigation.ts # Navigation hook'u
├── App.tsx             # Ana uygulama bileşeni
└── main.tsx            # Uygulama giriş noktası
```

## Özellikler

### 🎮 **Ana Sayfa**
- Platform tanıtımı
- Özellik kartları
- Hero bölümü

### 🔐 **Giriş Sayfası**
- Kullanıcı girişi
- Bilgi kartı animasyonu
- Responsive tasarım

### 📝 **Kayıt Sayfası**
- Yeni hesap oluşturma
- Form validasyonu
- Kişisel bilgi girişi

### 📞 **İletişim Sayfası**
- İletişim formu
- Mesaj gönderme

## Mimari Özellikler

### **Component-Based Architecture**
- Yeniden kullanılabilir bileşenler
- Tek sorumluluk prensibi
- Props ile veri aktarımı

### **Custom Hooks**
- `useNavigation` - Sayfa yönlendirme
- State yönetimi
- Side effect handling

### **TypeScript**
- Tip güvenliği
- Interface tanımları
- IntelliSense desteği

### **Clean Code**
- Temiz kod prensipleri
- Separation of concerns
- DRY principle

## Geliştirme

### Kurulum
```bash
cd frontend
npm install
```

### Geliştirme Sunucusu
```bash
cd frontend
npm run dev
```

### Build
```bash
cd frontend
npm run build
```

### Preview
```bash
cd frontend
npm run preview
```

## Çalıştırma

Bu frontend uygulaması bağımsız olarak çalışır. Ana dizinden frontend klasörüne geçerek komutları çalıştırın:

```bash
# Ana dizinden
cd frontend

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışacaktır.

## Stil Rehberi

### Renkler
- `--primary-yellow`: #FFD600
- `--primary-blue`: #a9dff5
- `--dark-text`: #2c3e50
- `--light-text`: #5a6a78

### Fontlar
- **Nunito**: Ana metin
- **Fredoka One**: Logo

### Responsive Breakpoints
- Desktop: 992px+
- Tablet: 768px-991px
- Mobile: 480px-767px

## Gelecek Planları

- [ ] Backend entegrasyonu
- [ ] State management (Redux/Zustand)
- [ ] Unit testler
- [ ] E2E testler
- [ ] PWA desteği
- [ ] Dark mode
- [ ] Çoklu dil desteği 