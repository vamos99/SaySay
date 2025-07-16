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
          <section className="about-section" style={{ marginTop: 32, marginBottom: 40 }}>
            <h2 className="about-title" style={{ fontSize: '1.65rem', fontWeight: 700, marginBottom: 14 }}>
              Her çocuğun sesi duyulsun, gelişimi desteklensin!
            </h2>
            <p style={{ fontSize: '1.08rem', lineHeight: 1.55, fontWeight: 500, maxWidth: 520, marginBottom: 24 }}>
              Teknoloji ve pedagojiyi bir araya getirerek, ebeveynlerin rehberliğinde çocukların kendi hızlarında ve ilgi alanlarında gelişebileceği güvenli bir alan sunuyoruz. Amacımız, siz ve çocuğunuz arasında güçlü bir iletişim ve anlayış köprüsü kurmak.
            </p>
          </section>
        </div>
        <div className="home-right-column" style={{ marginTop: 18, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
          <section className="features-section" style={{ marginTop: 0, marginBottom: 16, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
            <div
              className="features-grid"
              style={{
                display: 'grid',
                gap: 16,
                padding: 0,
                gridTemplateColumns: 'repeat(2, 1fr)',
                justifyItems: 'center',
                alignItems: 'center',
                marginTop: 0,
                marginBottom: 0,
                width: '100%',
              }}
            >
              <FeatureCard icon={<CustomGameIcon />} title="Kavram Oyunları" color="#a9dff5" iconBg="#e3f4fb" description="Çocuğunuzun eğlenerek yeni kavramlar öğrenmesini sağlayan etkileşimli oyunlar."/>
              <FeatureCard icon={<CustomFamilyIcon />} title="Uzman Desteği" color="#f8c9d3" iconBg="#fbe8ee" description="Çocuk gelişimi uzmanlarından ve pedagoglardan anında profesyonel destek alın."/>
              <FeatureCard icon={<CustomLockIcon />} title="Ebeveyn Kontrolü" color="#d3c9f8" iconBg="#edeafd" description="Çocuğunuzun uygulama içi deneyimini güvenle yönetin ve zamanı kontrol edin."/>
              <FeatureCard icon={<CustomBookIcon />} title="Eğitim Kaynakları" color="#ffd6a9" iconBg="#fff2e0" description="Gelişimini destekleyecek zengin ve çeşitli eğitim materyalleri kütüphanesi."/>
              <FeatureCard icon={<CustomClockIcon />} title="Zaman Yönetimi" color="#bde6d3" iconBg="#e6f5ee" description="Ekran süresini sağlıklı bir şekilde yönetmek için zamanlayıcılar ve sınırlar belirleyin."/>
              <FeatureCard icon={<CustomChartIcon />} title="Gelişim Takibi" color="#f6c6ec" iconBg="#fbeaf7" description="Çocuğunuzun ilerlemesini ve gelişimsel kilometre taşlarını kolayca takip edin."/>
              <FeatureCard icon={<CustomMessageIcon />} title="İletişim Panosu" color="#ffe6b3" iconBg="#fff7e0" description="Çocuğunuzla, öğretmenlerle ve uzmanlarla güvenli bir şekilde iletişim kurun."/>
              <FeatureCard icon={<CustomProfileIcon />} title="Kişisel Profil" color="#b3e6dd" iconBg="#e0f7f2" description="Her çocuk için ilgi alanlarına ve ihtiyaçlarına göre kişiselleştirilmiş profiller oluşturun."/>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}