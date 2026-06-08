<div align="center">

# **SaySay**

**Public demo:** yeni hosting kararı verilene kadar kapalıdır.

SaySay, çocukların kavram öğrenimini destekleyen interaktif bir platformdur. Ebeveynler çocuklarının gelişimini takip edebilir, çocuklar ise eğlenceli oyunlar ile öğrenir.

![Proje Logosu](./assets/logo.png)

*Çocuğunuzun sesini duyun, gelişimini destekleyin!*

![Scope](https://img.shields.io/badge/Scope-Bootcamp_Project-informational.svg)
![Stack](https://img.shields.io/badge/Stack-Next.js_FastAPI-blue.svg)
![Checks](https://img.shields.io/badge/Checks-Typecheck_Compile-green.svg)
![Demo](https://img.shields.io/badge/Public_Demo-Disabled-lightgrey.svg)

</div>

---

## **Portfolio ve Mühendislik Notu**

Bu repo bir bootcamp takım projesi olarak geliştirilmiştir. Portfolio açısından öne çıkan kısımlar:

- Next.js App Router ile ebeveyn portalı, çocuk profili ve oyun akışları
- Supabase Auth/DB kullanımı ve çocuk bazlı içerik yönetimi
- Gemini destekli içerik üretimi için server-side API route yaklaşımı
- Python/FastAPI generator servisi ile AI içerik, TTS ve Supabase işlemleri
- CI ile frontend typecheck ve backend Python compile kontrolü
- Mimari ve servis akışı: [`docs/architecture.md`](docs/architecture.md)
- Ürün analitiği event sözlüğü: [`docs/analytics-events.md`](docs/analytics-events.md)
- Prompt registry ve KPI sözlüğü: [`docs/prompt-registry.md`](docs/prompt-registry.md) / [`docs/parent-dashboard-kpis.md`](docs/parent-dashboard-kpis.md)
- GitHub Issues/Projects için hafif sprint ve backlog akışı: [Live Project Board](https://github.com/users/vamos99/projects/4) / [`docs/project-management.md`](docs/project-management.md)
- Vercel kapatma ve yeni hosting hazırlığı: [`docs/deployment-handoff.md`](docs/deployment-handoff.md)

Gizli değerler repoya eklenmez. Lokal kurulum için `frontend/.env.example` ve
`backend/generator/config.env.example` dosyalarını örnek alarak kendi ortam
değişkenlerinizi oluşturun. GitHub Actions veya seçilen deployment platformu
için aynı değerler secret veya environment variable olarak tanımlanmalıdır.

---

## **🏆 Takım Bilgileri**

<div align="center">

### **`Grup 206`**

</div>

### **👥 Takım Elemanları**

| İsim | Rol | Sosyal Medya |
|------|-----|--------------|
| Muhammed Yuşa Güler | Product Owner | <a href="https://github.com/yusaglr" target="_blank"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="20"/></a> <a href="http://linkedin.com/in/yusa-guler" target="_blank"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" width="20"/></a> |
| Halil Kıyak | Scrum Master | <a href="https://github.com/vamos99" target="_blank"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="20"/></a> <a href="https://tr.linkedin.com/in/halilkiyak" target="_blank"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" width="20"/></a> |
| Sevde Altunköse | Developer | <a href="https://github.com/SevdeAltunkose" target="_blank"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="20"/></a> <a href="https://tr.linkedin.com/in/sevde-altunk%C3%B6se-608450312" target="_blank"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" width="20"/></a> |
| Eray İnan | Developer | <a href="https://github.com/erayinn" target="_blank"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="20"/></a> <a href="https://www.linkedin.com/in/eray-inan-b022392a9/" target="_blank"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" width="20"/></a> |
| Muhammet Yusuf Aydın | Developer | <a href="https://github.com/yayd1n" target="_blank"><img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" width="20"/></a> <a href="https://www.linkedin.com/in/muhammet-yusuf-ayd%C4%B1n/" target="_blank"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg" width="20"/></a> |

---

## **📱 SaySay Nedir?**

SaySay, özellikle **3-7 yaş aralığında olup, otizm gibi iletişim farklılıkları yaşayan veya dil ve iletişim gelişiminde desteğe ihtiyaç duyan** çocuklara yönelik tasarlanmış, kişiselleştirilebilir bir web platformudur.

Amacımız, ebeveynlerin, bakım verenlerin ve uzmanların (özel eğitimciler, dil terapistleri) rehberliğinde, çocukların kendi hızlarında ve ilgi alanlarına göre gelişebilecekleri güvenli ve etkileşimli bir ortam sunmaktır. Platformumuz, çocuğunuzun öğrenme ve iletişim sürecini somut verilerle yönetmenizi ve aranızda daha güçlü bir iletişim köprüsü kurmanızı sağlar.

---

## **🚀 Temel Özellikler**

### ✨ **Ana Özellikler**

#### 🎮 **Kişiselleştirilmiş Kavram Oyunları**
"Büyük/küçük", "renkler" gibi temel kavramları, çocuğunuzun ilgi alanlarına (korsanlar, uzay vb.) göre dinamik olarak şekillenen eğlenceli ve etkileşimli oyunlarla öğretir.

#### 🤖 **AI Destekli Öğrenme**
Gemini API ile kişiselleştirilmiş öğrenme deneyimi ve akıllı içerik önerileri.

#### 🔒 **Ebeveyn Kontrol Paneli**
Tüm oyun ve iletişim ayarlarını yönetebileceğiniz, çocuğunuzun gelişimini somut veriler ve grafiklerle takip edebileceğiniz merkezi kontrol paneli.

### 📋 **Gelecek Planları**
- 📚 Eğitim Kaynakları Kütüphanesi
- ⏱️ Zaman Yönetimi Sistemi
- 🎯 Akıllı Değerlendirme Araçları

---

## **🛠️ Teknoloji Stack**

| Frontend | Backend | Veritabanı | AI | Hosting |
|----------|---------|------------|----|------------|
| Next.js, React, TypeScript | FastAPI, Python | Supabase PostgreSQL | Gemini | Platform bağımsız, public demo kapalı |

---

<details open>
<summary><h2>🏃‍♂️ Sprint 1</h2></summary>

### Sprint Notları
Bu sprint'in ana hedefi, projenin temel frontend arayüzlerini kodlayarak görsel bir prototip oluşturmaktı. Hızlı başlangıç için Vite ile React + TypeScript projesi kuruldu ve statik sayfalar (Ana Sayfa, Giriş/Kayıt, İletişim) hayata geçirildi. Tüm bu sayfaların mobil ve masaüstü cihazlarla uyumlu responsive tasarımı tamamlandı. Sprint sonunda, projenin ölçeklenebilirliği için Next.js'e geçiş yapılmasına stratejik olarak karar verildi.

---

### Sprint İçinde Tamamlanması Tahmin Edilen Puan
**Hedeflenen Puan:** 21 Puan  
**Tamamlanan Puan:** 21 Puan

---

### Puan Tamamlama Mantığı
Proje boyunca tamamlanması gereken toplam backlog puanı 131’dir. İlk Sprint için bitirilmesi istenilen puan sayısı 21 olarak belirlenmiştir ve hedefe ulaşılmıştır.

Puanlama, görevlerin karmaşıklığı, gerektirdiği efor ve barındırdığı belirsizliklere göre Fibonacci serisi (1, 2, 3, 5, 8, ...) kullanılarak belirlenmektedir. Bir görev, tüm gereksinimleri karşılayıp "Done" sütununa taşındığında, o göreve atanan puan tamamlanmış sayılır.

---

<details>
<summary><h4>Daily Scrum</h4></summary>

Daily Scrum toplantılarında ekip, önceki gün yapılanlar, o günün planı ve karşılaşılan engelleri paylaşmıştır.

Aşağıdaki görselde UI/UX ve uygulama özellikleri üzerine yapılan tartışmadan bir kesit yer almaktadır.

![alt text](./assets/sprint1/wp%20konuşma.png)

</details>

<details>
<summary><h4>Sprint Board</h4></summary>

**Sprint Board Linki:** [https://trello.com/b/gMziIBP7/saysay](https://trello.com/b/gMziIBP7/saysay)

![alt text](./assets/sprint1/Sprint%201%20To%20Do.png)
![alt text](./assets/sprint1/Sprint%201%20Done.png)

</details>

<details>
<summary><h4>Uygulama Ekran Görüntüleri</h4></summary>

| Ana Sayfa | Giriş | Kayıt | İletişim |
|-----------|-------|-------|----------|
| ![Ana Sayfa](assets/sprint1/app-hompage.png) | ![Giriş](assets/sprint1/app-login.png) | ![Kayıt](assets/sprint1/app-register.png) | ![İletişim](assets/sprint1/app-contact.png) |

</details>

<details>
<summary><h4>Sprint Review</h4></summary>

<strong>Review (Neler Başarıldı?):</strong>

✅ (3 Puan) Vite ile React + TypeScript projesi başarıyla kuruldu.

✅ (5 Puan) Ana Sayfa ve İletişim Sayfası UI kodlaması tamamlandı.

✅ (5 Puan) Giriş ve Kayıt Sayfaları UI kodlaması tamamlandı.

✅ (8 Puan) Tüm sayfalar için responsive tasarım yapıldı.

</details>

<details>
<summary><h4>Sprint Retrospective</h4></summary>

<strong>Retrospective (Neler Öğrendik?):</strong>

Takım içi iletişim ve Vite kullanarak hızlı başlangıç yapmamız çok iyi gitti.

Bazı UI görevlerinin tahminimizden uzun sürdüğünü fark ettik. Bir sonraki sprint için daha dikkatli planlama yapma kararı aldık.

</details>

</details>

<details open>
<summary><h2>🏃‍♂️ Sprint 2</h2></summary>

**Sprint 2 demo durumu:** eski public demo kapatılacaktır; ekran görüntüleri repo içinde korunur.

### Sprint Notları
Bu sprint'in ana hedefi, Next.js 15'e geçiş yaparak modern folder structure oluşturmak ve temel portal özelliklerini geliştirmekti. Supabase entegrasyonu ile veritabanı bağlantısı kuruldu, çocuk ekleme modalı ve profil yönetimi tamamlandı. Kavram oyunları için temel altyapı hazırlandı ve kullanıcı deneyimi iyileştirmeleri yapıldı.

**Teknik Geliştirmeler:**
- Next.js 15'e başarılı geçiş yapıldı ve modern App Router yapısı benimsendi
- Supabase PostgreSQL veritabanı entegrasyonu tamamlandı
- Authentication sistemi (login, register, forgot-password, reset-password) geliştirildi
- Responsive tasarım ve mobil uyumluluk iyileştirildi
- Component-based mimari ile yeniden kullanılabilir bileşenler oluşturuldu

**Portal Özellikleri:**
- Çocuk ekleme ve profil yönetimi modalı geliştirildi
- Portal ana sayfası ve sidebar navigasyonu tamamlandı
- Çocuk listesi ve detay sayfaları oluşturuldu
- Kavram oyunları için temel altyapı hazırlandı
- Roadmap sistemi ve kavram takibi implementasyonu başlatıldı

**UI/UX İyileştirmeleri:**
- LoadingScreen reusable component oluşturuldu
- Avatar component SVG desteği eklendi
- Portal children horizontal layout düzenlendi
- Global UI/UX iyileştirmeleri yapıldı
- Responsive tasarım optimizasyonları tamamlandı

**Süreç Değişiklikleri:**
- Sprint Board için Notion'a geçiş yapıldı. Tüm ekip üyeleri, Notion'un kullanım kolaylığı ve aşinalığı nedeniyle bu değişikliği oybirliğiyle kabul etti.
- Git workflow ve environment setup süreçleri standardize edildi
- Code cleanup ve dead comment temizliği yapıldı

---

### Sprint İçinde Tamamlanması Tahmin Edilen Puan
**Hedeflenen Puan:** 73 Puan  
**Tamamlanan Puan:** 55 Puan

---

### Puan Tamamlama Mantığı
Sprint 2 için toplam 73 puan hedeflenmiş, 55 puan tamamlanmıştır. Kalan 18 puan Sprint 3'e aktarılmıştır. Puanlama, görevlerin karmaşıklığı, gerektirdiği efor ve barındırdığı belirsizliklere göre Fibonacci serisi (1, 2, 3, 5, 8, ...) kullanılarak belirlenmektedir.

---

<details>
<summary><h4>Daily Scrum</h4></summary>

Daily Scrum toplantılarında ekip, önceki gün yapılanlar, o günün planı ve karşılaşılan engelleri paylaşmıştır.

Aşağıdaki görsellerde Sprint 2 sürecinde yapılan toplantılardan kesitler yer almaktadır. Özellikle görsel oluşturma teknolojileri üzerine yapılan tartışmalar ve Google Cloud Vertex AI'nin projemiz için değerlendirilmesi konuları ele alınmıştır. Ücretsiz kredi ile üye olma süreci ve AI entegrasyonu planları detaylandırılmıştır.

<div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; margin: 20px 0;">

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Toplantı 1:** Görsel oluşturma teknolojileri ve AI entegrasyonu planları

![Daily Scrum Meeting 1](./assets/sprint2/Sprint%202%20meet%201.png)

</div>

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Toplantı 2:** Google Cloud Vertex AI değerlendirmesi ve ücretsiz kredi süreci

![Daily Scrum Meeting 2](./assets/sprint2/Sprint%202%20meet%202.jpeg)

</div>

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Toplantı 3:** AI entegrasyonu teknik detayları ve implementasyon planları

![Daily Scrum Meeting 3](./assets/sprint2/Sprint%202%20meet%203.jpeg)

</div>

</div>

</details>

<details>
<summary><h4>Sprint Board</h4></summary>

<div style="display:flex; gap:8px; flex-wrap:wrap;">
  <img src="./assets/sprint2/Sprint%202%20To%20Do.png" alt="Sprint 2 To Do" width="45%"/>
  <img src="./assets/sprint2/timeline.png" alt="Sprint 2 Zaman Çizelgesi" width="45%"/>
  <img src="./assets/sprint2/ToDo2.png" alt="Sprint 2 ToDo Listesi 2" width="45%"/>
</div>

</details>

<details>
<summary><h4>Uygulama Ekran Görüntüleri</h4></summary>

| Ana Sayfa | Giriş | Kayıt | Portal |
|-----------|-------|-------|--------|
| ![Ana Sayfa](./assets/sprint2/homepage.png) | ![Giriş](./assets/sprint2/login.png) | ![Kayıt](./assets/sprint2/register.png) | ![Portal](./assets/sprint2/portal.png) |

| Çocuklar | Oyunlar | Raporlar | Ayarlar |
|----------|---------|----------|---------|
| ![Çocuklar](./assets/sprint2/kids.png) | ![Oyunlar](./assets/sprint2/games.png) | ![Raporlar](./assets/sprint2/report.png) | ![Ayarlar](./assets/sprint2/setting.png) |

</details>

<details>
<summary><h4>Sprint Review</h4></summary>

<strong>Review (Neler Başarıldı?):</strong>

**✅ Teknik Başarılar:**
- Next.js 15'e geçiş yapıldı ve App Router yapısı kullanılmaya başlandı
- Supabase PostgreSQL entegrasyonu kuruldu; canlı doğrulama env yapılandırmasına bağlıdır
- Component-based mimari ile LoadingScreen, Avatar, PortalSidebar gibi yeniden kullanılabilir bileşenler oluşturuldu
- Responsive tasarım için mobil ve masaüstü temel kontroller yapıldı

**✅ Portal Özellikleri:**
- Çocuk ekleme modalı ve profil yönetimi demo akışı için hazırlandı
- Portal ana sayfası ve sidebar navigasyonu kullanıcı dostu şekilde tasarlandı
- Çocuk listesi ve detay sayfaları Supabase ile entegre edildi
- Kavram oyunları için temel altyapı hazırlandı (oyun1 sayfası oluşturuldu)
- Roadmap sistemi için veritabanı yapısı kuruldu

**✅ UI/UX İyileştirmeleri:**
- LoadingScreen component'i tüm sayfalarda tutarlı şekilde kullanılıyor
- Avatar component'i SVG desteği ile esnek hale getirildi
- Portal children horizontal layout ile daha iyi kullanıcı deneyimi sağlandı
- Global UI/UX iyileştirmeleri ile tutarlı tasarım dili oluşturuldu

**✅ Süreç İyileştirmeleri:**
- Notion'a geçiş ile ekip içi iletişim ve görev takibi kolaylaştı
- Git workflow standardize edildi ve environment setup süreçleri otomatikleştirildi
- Code cleanup ile kod kalitesi artırıldı ve maintainability iyileştirildi

</details>

<details>
<summary><h4>Sprint Retrospective</h4></summary>

<strong>Retrospective (Neler Öğrendik?):</strong>

**🎯 Pozitif Deneyimler:**
- Next.js 15'e geçiş sürecinde App Router pratikleri denendi
- Supabase entegrasyonu ile auth ve veri erişimi için temel akışlar kuruldu
- Component-based yaklaşım ile kod tekrarı azaldı ve geliştirme hızı arttı
- Takım içi iletişim ve görev dağılımı daha net hale geldi

**⚠️ Gelişim Alanları:**
- Bazı görevlerin tahminimizden uzun sürdüğünü fark ettik (özellikle UI/UX iyileştirmeleri)
- Supabase ile ilgili bazı edge case'lerde zaman kaybı yaşandı
- Kavram oyunları altyapısı için daha detaylı planlama gerekli
- Test süreçleri için daha sistematik yaklaşım benimsenmeli

**📋 Gelecek Sprint İçin Alınan Kararlar:**
- Sprint 3'te daha gerçekçi puanlama yapılacak ve buffer süreleri artırılacak
- Kavram oyunları için detaylı teknik planlama yapılacak
- Test süreçleri için otomatik test yazımı başlatılacak
- Performance optimizasyonları için monitoring araçları entegre edilecek
- Code review süreçleri daha sıkı hale getirilecek

**🚀 Teknik Öğrenilenler:**
- Next.js App Router'ın avantajları ve best practices
- Supabase RLS (Row Level Security) implementasyonu
- Component-based mimarinin önemi ve reusability
- Responsive tasarım için modern CSS teknikleri
- Git workflow ve environment management best practices

</details>

</details>

<details open>
<summary><h2>🏃‍♂️ Sprint 3</h2></summary>

**Sprint 3 demo durumu:** eski public demo kapatılacaktır; lokal kurulum ve ekran görüntüleri referans alınır.

### Sprint Notları
Bu sprint'te final demo için ana oyun akışları, Gemini destekli içerik üretimi denemeleri ve FastAPI generator servisi üzerine odaklanıldı. Canlı entegrasyonlar API key ve servis yapılandırmasına bağlıdır; repo şu an public demo yerine lokal kurulum ve dokümantasyon üzerinden değerlendirilir.

**AI Entegrasyonu:**
- Gemini API üzerinden kişiselleştirilmiş içerik üretimi prototipi
- Soru-cevap ve kavram anlatımı için prompt tabanlı backend akışları
- Text-to-Speech (TTS) ile sesli öğrenme desteği denemesi
- Kavram oyunları için görsel içerik üretimi denemeleri

**Kavram Oyunları Geliştirmeleri:**
- Gelişmiş oyun algoritmaları ve zorluk seviyeleri
- Çoklu kavram desteği ve kategorize edilmiş içerik
- Oyun istatistikleri ve ilerleme takibi
- Çocuk dostu oyun arayüzleri ve animasyonlar
- Oyun sonuçları ve başarı rozetleri sistemi

**Backend İyileştirmeleri:**
- FastAPI backend geliştirmesi ve API optimizasyonu
- Veritabanı performans iyileştirmeleri
- Güvenlik ve authentication güçlendirmeleri
- Docker containerization ve deployment optimizasyonu
- API rate limiting ve caching mekanizmaları

**UI/UX Geliştirmeleri:**
- Oyun arayüzlerinin iyileştirilmesi
- Responsive tasarım optimizasyonları
- Kullanıcı deneyimi iyileştirmeleri
- Çocuk dostu renk paleti ve tipografi
- Erişilebilirlik (accessibility) iyileştirmeleri

**Performans ve Güvenlik:**
- Frontend performans optimizasyonları
- Backend API response time iyileştirmeleri
- Secret/env yönetimi ve güvenli deployment checklist'i
- Veri gizliliği ve erişim kontrolü kontrolleri
- Error handling ve logging sistemi

---

### Sprint İçinde Tamamlanması Tahmin Edilen Puan
**Hedeflenen Puan:** 164 Puan  
**Tamamlanan Puan:** 164 Puan

---

### Puan Tamamlama Mantığı
Sprint 3 puanları bootcamp teslim kapsamındaki görev takibine göre tutulmuştur. AI entegrasyonu, kavram oyunları ve backend iyileştirmeleri demo/prototip seviyesinde ele alınmıştır. Puanlama, görevlerin karmaşıklığı, gerektirdiği efor ve barındırdığı belirsizliklere göre Fibonacci serisi (1, 2, 3, 5, 8, ...) kullanılarak belirlenmektedir.

**Tamamlanan Ana Görevler:**
- AI API entegrasyonu (8 puan) ✅
- Kavram oyunları geliştirme (8 puan) ✅
- Backend API optimizasyonu (5 puan) ✅
- UI/UX iyileştirmeleri (5 puan) ✅
- Test ve güvenlik (3 puan) ✅
- Dokümantasyon (2 puan) ✅

---

<details>
<summary><h4>Daily Scrum</h4></summary>

Daily Scrum toplantılarında ekip, önceki gün yapılanlar, o günün planı ve karşılaşılan engelleri paylaşmıştır.

Bu sprint'te AI entegrasyonu ve kavram oyunları geliştirmeleri üzerine odaklanılacaktır. Ekip üyeleri, Gemini API entegrasyonu ve oyun algoritmaları konularında işbirliği yapacaktır.

**Ekip Dağılımı:**
- **AI Entegrasyonu:** Muhammed Yuşa Güler, Halil Kıyak
- **Kavram Oyunları:** Sevde Altunköse, Muhammet Yusuf Aydın
- **Backend & DevOps:** Halil Kıyak

**Haftalık Hedefler:**
- **Hafta 1:** AI API entegrasyonu ve temel backend altyapısı
- **Hafta 2:** Kavram oyunları geliştirme ve UI iyileştirmeleri
- **Hafta 3:** Test, optimizasyon ve deployment

<div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; margin: 20px 0;">

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Toplantı 1:** AI entegrasyonu ve kavram oyunları planlaması

![Daily Scrum Meeting 1](./assets/sprint3/s3toplantı.jpeg)

</div>

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Toplantı 2:** Teknik implementasyon detayları ve API entegrasyonu

![Daily Scrum Meeting 2](./assets/sprint3/s3toplantı2.jpeg)

</div>

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Toplantı 3:** Sprint progress review ve gelecek hedefler

![Daily Scrum Meeting 3](./assets/sprint3/s3toplantı3.jpeg)

</div>

</div>

</details>

<details>
<summary><h4>Sprint Board</h4></summary>

Sprint 3 board'u Notion'da yönetilmektedir. Ekip üyeleri, görev takibi ve ilerleme raporları için Notion platformunu kullanmaya devam etmektedir.

**Board Kategorileri:**
- 📋 **To Do:** Henüz başlanmamış görevler
- 🔄 **In Progress:** Aktif olarak geliştirilen özellikler
- 🧪 **Testing:** Test aşamasında olan özellikler
- ✅ **Done:** Tamamlanan görevler
- 🚫 **Blocked:** Engellenen görevler

**Önemli Metrikler:**
- Sprint Velocity: 37 puan hedef
- Burndown Chart: Günlük ilerleme takibi
- Team Capacity: Haftalık kapasite planlaması

<div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; margin: 20px 0;">

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Sprint Board 1:** Sprint 3 görev planlaması ve sprint board yapısı

![Sprint Board 1](./assets/sprint3/spring%20board.jpeg)

</div>

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Sprint Board 2:** Sprint 3 detaylı görev dağılımı ve progress tracking

![Sprint Board 2](./assets/sprint3/spring%20board2.jpeg)

</div>

</div>

</details>

<details>
<summary><h4>Uygulama Ekran Görüntüleri</h4></summary>

<div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; margin: 20px 0;">

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Ana Sayfa:** SaySay platform ana sayfası

![Ana Sayfa](./assets/sprint3/Screenshot%202025-08-03%20at%2020.31.19.png)

</div>

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Giriş Sayfası:** Kullanıcı giriş ekranı

![Giriş Sayfası](./assets/sprint3/Screenshot%202025-08-03%20at%2020.31.30.png)

</div>

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Çocuk Portalı:** Çocuk kullanıcı arayüzü

![Çocuk Portalı](./assets/sprint3/Screenshot%202025-08-03%20at%2020.31.46.png)

</div>

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Ebeveyn Paneline Geçiş:** PIN ekranı

![Ebeveyn Paneline Geçiş](./assets/sprint3/Screenshot%202025-08-03%20at%2020.31.51.png)

</div>

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Ebeveyn Portalı Ana Sayfa:** Ebeveyn dashboard'u

![Ebeveyn Portalı Ana Sayfa](./assets/sprint3/Screenshot%202025-08-03%20at%2020.32.00.png)

</div>

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Çocuklarım:** Çocuk listesi ve yönetimi

![Çocuklarım](./assets/sprint3/Screenshot%202025-08-03%20at%2020.32.04.png)

</div>

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Çocuk Ekleme:** Yeni çocuk profili oluşturma

![Çocuk Ekleme](./assets/sprint3/Screenshot%202025-08-03%20at%2020.32.10.png)

</div>

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Oyunlar (Ebeveyn):** Ebeveyn panelindeki oyun yönetimi

![Oyunlar (Ebeveyn)](./assets/sprint3/Screenshot%202025-08-03%20at%2020.32.22.png)

</div>

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Raporlar:** Çocuk gelişim raporları

![Raporlar](./assets/sprint3/Screenshot%202025-08-03%20at%2020.32.31.png)

</div>

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Kavram Oyunu (Ebeveyn):** Ebeveyn panelinden oyun yönetimi

![Kavram Oyunu (Ebeveyn)](./assets/sprint3/Screenshot%202025-08-03%20at%2020.32.57.png)

</div>

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Oyun 2 - Nesne Eylem:** İkinci kavram oyunu

![Oyun 2 - Nesne Eylem](./assets/sprint3/Screenshot%202025-08-03%20at%2020.33.09.png)

</div>

<div style="border: 2px solid #e0b97d; border-radius: 12px; padding: 15px; background: #fff; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

**Oyun 3 - İletişim Panosu:** Üçüncü kavram oyunu

![Oyun 3 - İletişim Panosu](./assets/sprint3/Screenshot%202025-08-03%20at%2020.33.16.png)

</div>

</div>

</details>

<details>
<summary><h4>Sprint Review</h4></summary>

<strong>Review (Neler Başarıldı?):</strong>

**✅ AI Entegrasyonu Çıktıları:**
- Gemini API ile kişiselleştirilmiş içerik üretimi için prototip akış eklendi
- Soru-cevap ve kavram anlatımı için backend endpointleri hazırlandı
- Text-to-Speech (TTS) ile sesli öğrenme desteği denendi
- Kavram oyunları için görsel içerik üretimi akışı hazırlandı

**✅ Kavram Oyunları Geliştirmeleri:**
- 3 farklı kavram oyunu (Oyun 1, 2, 3) için demo akışları hazırlandı
- Zorluk seviyesi ve çoklu kavram desteği için temel oyun mantığı eklendi
- Oyun istatistikleri ve ilerleme takibi için portal ekranları hazırlandı
- Çocuk dostu oyun arayüzleri ve animasyonlar eklendi

**✅ Backend İyileştirmeleri:**
- FastAPI generator servisi oyun içerik üretimi için düzenlendi
- Supabase veri erişimi ve fallback davranışları ayrıştırıldı
- Error handling ve logging tarafında temel iyileştirmeler yapıldı

**✅ UI/UX Geliştirmeleri:**
- Portal dashboard'u ve oyun ekranları demo sunumu için düzenlendi
- Responsive tasarım mobil ve masaüstü kullanım için iyileştirildi
- Çocuk dostu renk paleti ve tipografi uygulandı
- Oyun arayüzlerinin modern tasarım ile yenilenmesi

**✅ Konfigürasyon ve Güvenlik Notları:**
- Gizli değerler env dosyalarına ve deployment secret'larına bırakıldı
- Public demo kapalı tutuldu; yeni hosting öncesi health/readiness kontrolü önerildi
- Hata durumları ve eksik env senaryoları için kullanıcıya görünür uyarılar eklendi

**✅ Portal Özellikleri:**
- Çocuk profil yönetimi ve detay sayfaları geliştirildi
- Roadmap sistemi ve kavram takibi için temel ekranlar hazırlandı
- Raporlar ve istatistik sayfaları detaylandırıldı
- Ayarlar sayfası ve kullanıcı tercihleri sistemi eklendi
- Oyun ayarları ve konfigürasyon sistemi kuruldu

</details>

<details>
<summary><h4>Sprint Retrospective</h4></summary>

<strong>Retrospective (Neler Öğrendik?):</strong>

**🎯 Pozitif Deneyimler:**
- Gemini API ile hızlı prototipleme yapılabildi
- Kavram oyunları geliştirme sürecinde component-based yaklaşımın faydası görüldü
- Backend servislerini frontend'den ayırmanın bakım kolaylığı sağladığı görüldü
- Takım içi görev dağılımı ve sprint takibi daha düzenli hale geldi
- UI/UX iyileştirmeleri demo akışlarını daha anlaşılır yaptı

**⚠️ Gelişim Alanları:**
- AI API entegrasyonunda bazı edge case'lerde zaman kaybı yaşandı, daha detaylı test planlaması gerekli
- Kavram oyunları için daha kapsamlı test senaryoları hazırlanmalı
- Performance optimization süreçlerinde daha sistematik yaklaşım benimsenmeli
- Dokümantasyon süreçleri daha düzenli hale getirilmeli

**📋 Proje Tamamlanma Süreci:**
- Sprint 3 sonunda ana demo akışları ve temel portal ekranları hazırlandı
- AI entegrasyonu ve kavram oyunları için prototip seviyesinde çalışma yapıldı
- Public demo kapalıdır; canlı kullanım için env, secret ve hosting kontrolleri gerekir
- Canlı kullanım iddiası yerine deployment handoff ve readiness notları tutulmaktadır

**🚀 Teknik Öğrenilenler:**
- Gemini API entegrasyonu ve prompt yönetimi temel pratikleri
- FastAPI ile ayrı backend servisi geliştirme
- Component-based game development ve state management
- Responsive tasarım ve oyun ekranı layout kararları
- Env/secret yönetimi ve eksik konfigürasyon davranışları
- Error handling ve logging için temel servis pratikleri

**💡 Takım Gelişimi:**
- Cross-functional collaboration ve knowledge sharing süreçleri güçlendi
- Agile methodology ve sprint planning süreçleri daha etkili hale geldi
- Technical debt management ve code quality standards iyileştirildi
- User feedback integration ve iterative development yaklaşımı benimsendi

</details>

</details>

<div align="center">

[![Scrum](https://img.shields.io/badge/Methodology-Scrum-orange?style=for-the-badge&logo=scrum)](https://scrum.org/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/vamos99/SaySay)

</div>
