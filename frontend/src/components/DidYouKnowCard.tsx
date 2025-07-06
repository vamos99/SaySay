import React, { useState, useEffect } from 'react';
import { FACTS } from '../utils/constants';
import dogImg from '../assets/dog.png';
import kidImg from '../assets/kid.png';

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
      <div className="sparkle top-left">✨</div>
      <div className="card-header">
        <div className="card-dots"><span></span><span></span><span></span></div>
        <span>🔊</span>
      </div>
      <div className={`card-content ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        <h3>{currentFact.title}</h3>
        <p>{currentFact.text}</p>
      </div>
                  <img
              key={factIndex}
              src={currentFact.image.includes('kid') ? kidImg : dogImg}
              alt="Bilgi görseli"
              className={`fact-image ${currentFact.image.includes('kid') ? 'fact-image-kid' : 'fact-image-dog'} ${isTransitioning ? 'fade-out' : 'fade-in'}`}
            />
      <div className="card-footer">&lt;ooo&gt;</div>
      <div className="sparkle bottom-right">✨</div>
    </div>
  );
}; 