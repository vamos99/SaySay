import React from 'react';

export const GameStyles: React.FC = () => (
  <style jsx>{`
    @keyframes correctPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.02); background: #c3e6cb; border-color: #20c997; }
  100% { transform: scale(1); }
}

@keyframes wrongShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

@keyframes bounceIn {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

@keyframes shakeIn {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.3) rotate(-5deg); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1) rotate(2deg); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1) rotate(0deg); }
}

@keyframes happyBounce {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.05); }
  50% { transform: scale(1.1); }
  75% { transform: scale(1.05); }
}

@keyframes encourageBounce {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.03); }
  50% { transform: scale(1.06); }
  75% { transform: scale(1.03); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

@keyframes celebrationBounce {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1) rotate(180deg); }
}

@keyframes rainbow {
  0% { background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3); }
  100% { background: linear-gradient(45deg, #ff9ff3, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57); }
}

@keyframes trophyGlow {
  0%, 100% { filter: drop-shadow(0 0 5px #ffd700); }
  50% { filter: drop-shadow(0 0 20px #ffd700) drop-shadow(0 0 30px #ffed4e); }
}

@keyframes starTwinkle {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

@keyframes confetti {
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

@keyframes balloonFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes firework {
  0% { transform: scale(0); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
}
  `}</style>
); 