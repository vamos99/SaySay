'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './utils/AuthContext';
import { FeatureCard } from '@/components/FeatureCard';
import Image from 'next/image';
import CustomGameIcon from '@/components/icons/CustomGameIcon';
import CustomFamilyIcon from '@/components/icons/CustomFamilyIcon';
import CustomLockIcon from '@/components/icons/CustomLockIcon';
import CustomBookIcon from '@/components/icons/CustomBookIcon';
import CustomClockIcon from '@/components/icons/CustomClockIcon';
import CustomChartIcon from '@/components/icons/CustomChartIcon';
import CustomMessageIcon from '@/components/icons/CustomMessageIcon';
import CustomProfileIcon from '@/components/icons/CustomProfileIcon';

export default function HomePage() {
  const { session, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && session) {
      router.replace('/portal');
    }
  }, [session, loading, router]);
  if (loading) return null;
  if (session) return null;
  return (
    <div className="page-container container">
      <div className="home-layout">
        <div className="home-left-column">
          <section className="hero-section">
            <div className="hero-say-say">
              <Image src="/saysay.png" alt="SAY SAY" width={500} height={200} className="hero-image" />
            </div>
            <div className="hero-nedir">
              <Image src="/nedir.png" alt="NEDİR" width={500} height={200} className="hero-image" />
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
              <FeatureCard icon={<CustomGameIcon />} title="Kavram Oyunları" color="#a9dff5" iconBgColor="#ffe6b3" description="Çocuğunuzun eğlenerek yeni kavramlar öğrenmesini sağlayan etkileşimli oyunlar."/>
              <FeatureCard icon={<CustomFamilyIcon />} title="Uzman Desteği" color="#f8c9d3" iconBgColor="#b3e6dd" description="Çocuk gelişimi uzmanlarından ve pedagoglardan anında profesyonel destek alın."/>
              <FeatureCard icon={<CustomLockIcon />} title="Ebeveyn Kontrolü" color="#d3c9f8" iconBgColor="#ffd6a9" description="Çocuğunuzun uygulama içi deneyimini güvenle yönetin ve zamanı kontrol edin."/>
              <FeatureCard icon={<CustomBookIcon />} title="Eğitim Kaynakları" color="#ffd6a9" iconBgColor="#b3dff5" description="Gelişimini destekleyecek zengin ve çeşitli eğitim materyalleri kütüphanesi."/>
              <FeatureCard icon={<CustomClockIcon />} title="Zaman Yönetimi" color="#bde6d3" iconBgColor="#f6c6ec" description="Ekran süresini sağlıklı bir şekilde yönetmek için zamanlayıcılar ve sınırlar belirleyin."/>
              <FeatureCard icon={<CustomChartIcon />} title="Gelişim Takibi" color="#f6c6ec" iconBgColor="#bde6d3" description="Çocuğunuzun ilerlemesini ve gelişimsel kilometre taşlarını kolayca takip edin."/>
              <FeatureCard icon={<CustomMessageIcon />} title="İletişim Panosu" color="#ffe6b3" iconBgColor="#d3c9f8" description="Çocuğunuzla, öğretmenlerle ve uzmanlarla güvenli bir şekilde iletişim kurun."/>
              <FeatureCard icon={<CustomProfileIcon />} title="Kişisel Profil" color="#b3e6dd" iconBgColor="#f8c9d3" description="Her çocuk için ilgi alanlarına ve ihtiyaçlarına göre kişiselleştirilmiş profiller oluşturun."/>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}