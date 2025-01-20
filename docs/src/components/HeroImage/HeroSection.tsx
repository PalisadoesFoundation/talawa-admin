import './HeroSection.css';
import React, { useEffect } from 'react';

export default function HeroSection() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://unpkg.com/@lottiefiles/lottie-player@2.0.8/dist/lottie-player.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <section className="hero-image-section section-container">
      <div className="hero-image">
        {/* React.createElement is used to suppress TypeScript errors as VS code throws an error for lottie-player othe  */}
        {React.createElement('lottie-player', {
          src: 'https://lottie.host/c3d8ee59-5c73-46f7-8c4e-a66763f5eba3/80bnwExY98.json',
          background: 'transparent',
          speed: '1',
          loop: true,
          autoplay: true,
          style: { height: '100%' },
        })}
      </div>
    </section>
  );
}
