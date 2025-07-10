'use client';

import React, { useState, useEffect } from 'react';
import { FACTS } from '@/constants';
import Image from 'next/image';
import CustomSparkle from './icons/CustomSparkle';

export const DidYouKnowCard: React.FC = () => {
  const [factIndex, setFactIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setFactIndex(prev => (prev + 1) % FACTS.length);
        setIsTransitioning(false);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentFact = FACTS[factIndex];

  return (
    <div className="did-you-know-card">
      <div className="sparkle top-left"><CustomSparkle /></div>
      <div className="card-header">
        <div className="card-dots"><span></span><span></span><span></span></div>
        <span>🔊</span>
      </div>
      <div className={`card-content ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        <h3>{currentFact.title}</h3>
        <p>{currentFact.text}</p>
      </div>
      <Image
        key={factIndex}
        src={`/${currentFact.image}`}
        alt="Bilgi görseli"
        width={150}
        height={150}
        className={`fact-image ${currentFact.image.includes('kid') ? 'fact-image-kid' : 'fact-image-dog'} ${isTransitioning ? 'fade-out' : 'fade-in'}`}
      />
      <div className="card-footer">&lt;ooo&gt;</div>
      <div className="sparkle bottom-right"><CustomSparkle /></div>
    </div>
  );
};