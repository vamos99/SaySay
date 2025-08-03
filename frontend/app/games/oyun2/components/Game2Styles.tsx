import React from 'react';

export const Game2Styles: React.FC = () => {
  return (
    <style jsx global>{`
      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.1);
          opacity: 0.7;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
        60% {
          transform: translateY(-5px);
        }
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @keyframes slideIn {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(0);
        }
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .game2-container {
        animation: fadeIn 0.5s ease-out;
      }

      .game2-section {
        animation: slideIn 0.6s ease-out;
      }

      .game2-card-hover {
        transition: all 0.3s ease;
      }

      .game2-card-hover:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .game2-sentence {
        animation: bounce 0.6s ease-out;
      }

      .game2-audio-button {
        transition: all 0.3s ease;
      }

      .game2-audio-button:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 15px rgba(224, 185, 125, 0.4);
      }

      .game2-audio-button:active {
        transform: scale(0.95);
      }

      .game2-loading {
        animation: pulse 1.5s ease-in-out infinite;
      }

      .game2-error {
        animation: shake 0.5s ease-in-out;
      }

      @keyframes shake {
        0%, 100% {
          transform: translateX(0);
        }
        25% {
          transform: translateX(-5px);
        }
        75% {
          transform: translateX(5px);
        }
      }
    `}</style>
  );
}; 