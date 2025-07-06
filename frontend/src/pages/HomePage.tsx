import React from 'react';
import { FeatureCard } from '../components/FeatureCard';
import saysayImg from '../assets/saysay.png';
import nedirImg from '../assets/nedir.png';
import commentImg from '../assets/comment.png';
import kidImg from '../assets/kid.png';

export const HomePage: React.FC = () => {
  return (
    <div className="page-container container">
      <div className="home-layout">
        <div className="home-left-column">
          <section className="hero-section">
            <div className="hero-say-say">
              <img src={saysayImg} alt="SAY SAY" className="hero-image" />
            </div>
            <div className="hero-nedir">
              <img src={nedirImg} alt="NEDİR" className="hero-image" />
            </div>
          </section>

          <section className="about-section">
            <h2 className="about-title">Çocuğunuzun sesini duyun, gelişimini destekleyin!</h2>
            <p>
              Biz, her çocuğun anlaşılmayı hak ettiğine inanıyoruz. Bu platformu, teknoloji ve pedagojiyi bir araya getirerek, ebeveynlerin rehberliğinde, çocukların kendi hızlarında ve kendi ilgi alanları doğrultusunda gelişebilecekleri güvenli bir alan yaratmak için tasarladık. Amacımız, sadece bir araç sunmak değil, aynı zamanda siz ve çocuğunuz arasında daha güçlü bir anlayış ve iletişim köprüsü kurmaktır.
            </p>
          </section>
        </div>
        <div className="home-right-column">
          <section className="features-section">
            <div className="features-grid">
              <FeatureCard icon="🎮" title="Kavram Oyunları" color="#a9dff5" description="Çocuğunuzun eğlenerek yeni kavramlar öğrenmesini sağlayan etkileşimli oyunlar."/>
              <FeatureCard icon="👨‍👩‍👧‍👦" title="Uzman Desteği" color="#f8c9d3" description="Çocuk gelişimi uzmanlarından ve pedagoglardan anında profesyonel destek alın."/>
              <FeatureCard icon="🔒" title="Ebeveyn Kontrolü" color="#d3c9f8" description="Çocuğunuzun uygulama içi deneyimini güvenle yönetin ve zamanı kontrol edin."/>
              <FeatureCard icon="📚" title="Eğitim Kaynakları" color="#f8e4c9" description="Gelişimini destekleyecek zengin ve çeşitli eğitim materyalleri kütüphanesi."/>
              <FeatureCard icon="⏱️" title="Zaman Yönetimi" color="#fef9e7" description="Ekran süresini sağlıklı bir şekilde yönetmek için zamanlayıcılar ve sınırlar belirleyin."/>
              <FeatureCard icon="📊" title="Gelişim Takibi" color="#bde6d3" description="Çocuğunuzun ilerlemesini ve gelişimsel kilometre taşlarını kolayca takip edin."/>
              <FeatureCard icon={<img src={commentImg} alt="İletişim" className="feature-icon" />} title="İletişim Panosu" color="#fef9e7" description="Çocuğunuzla, öğretmenlerle ve uzmanlarla güvenli bir şekilde iletişim kurun."/>
              <FeatureCard icon={<img src={kidImg} alt="Kişisel Profil" className="feature-icon" />} title="Kişisel Profil" color="#f8c9d3" description="Her çocuk için ilgi alanlarına ve ihtiyaçlarına göre kişiselleştirilmiş profiller oluşturun."/>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}; 