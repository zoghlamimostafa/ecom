import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/TranslationContext';

const HeroSection = ({ title, subtitle, className = "" }) => {
  const { t } = useTranslation();
  const [currentImage, setCurrentImage] = useState(1);
  const totalImages = 8; // hero1.jpg à hero8.jpg

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev >= totalImages ? 1 : prev + 1));
    }, 4000); // Change d'image toutes les 4 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`hero-section ${className}`}>
      <div className="hero-background">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
          <div
            key={num}
            className={`hero-image ${currentImage === num ? 'active' : ''}`}
            style={{
              backgroundImage: `url(/images/heros${num}.jpg)`
            }}
          />
        ))}
        <div className="hero-overlay" />
      </div>
      
      <div className="hero-content">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="hero-title">{title}</h1>
              {subtitle && <p className="hero-subtitle">{subtitle}</p>}
              
              <div className="hero-buttons">
                <Link to="/product" className="btn btn-hero btn-primary">
                  {t('discoverOurStore')}
                </Link>
                <Link to="/about" className="btn btn-hero btn-outline">
                  {t('aboutUs')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hero-indicators">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
          <button
            key={num}
            className={`indicator ${currentImage === num ? 'active' : ''}`}
            onClick={() => setCurrentImage(num)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
