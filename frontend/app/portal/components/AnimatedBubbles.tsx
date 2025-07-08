import React from 'react';

export const AnimatedBubbles: React.FC = () => (
  <>
    <div style={{position:'absolute',top:'-30px',left:'20%',zIndex:0,animation:'bubble1 6s infinite alternate'}}>
      <svg width="60" height="60"><circle cx="30" cy="30" r="28" fill="#f8c9d3" opacity="0.18" /></svg>
    </div>
    <div style={{position:'absolute',top:'60px',left:'70%',zIndex:0,animation:'bubble2 7s infinite alternate'}}>
      <svg width="40" height="40"><circle cx="20" cy="20" r="18" fill="#a9dff5" opacity="0.16" /></svg>
    </div>
    <div style={{position:'absolute',top:'180px',left:'10%',zIndex:0,animation:'bubble3 8s infinite alternate'}}>
      <svg width="50" height="50"><circle cx="25" cy="25" r="23" fill="#bde6d3" opacity="0.14" /></svg>
    </div>
    <div style={{position:'absolute',top:'220px',left:'80%',zIndex:0,animation:'bubble4 9s infinite alternate'}}>
      <svg width="30" height="30"><circle cx="15" cy="15" r="13" fill="#ffe6b3" opacity="0.13" /></svg>
    </div>
    <style>{`
      @keyframes bubble1 {0%{transform:translateY(0)}100%{transform:translateY(30px)}}
      @keyframes bubble2 {0%{transform:translateY(0)}100%{transform:translateY(-24px)}}
      @keyframes bubble3 {0%{transform:translateY(0)}100%{transform:translateY(18px)}}
      @keyframes bubble4 {0%{transform:translateY(0)}100%{transform:translateY(-12px)}}
    `}</style>
  </>
); 