import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const BrandCarousel = ({ brands }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 3000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    pauseOnHover: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      }
    ]
  };

  // URLs des logos des marques populaires (vous pouvez les remplacer par vos propres logos)
  const brandLogos = {
    samsung: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/512px-Samsung_Logo.svg.png',
    apple: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/512px-Apple_logo_black.svg.png',
    nike: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/512px-Logo_NIKE.svg.png',
    adidas: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/512px-Adidas_Logo.svg.png',
    sony: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/512px-Sony_logo.svg.png',
    lg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/LG_logo_%282015%29.svg/512px-LG_logo_%282015%29.svg.png',
    zara: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/512px-Zara_Logo.svg.png',
    'h&m': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/H%26M-Logo.svg/512px-H%26M-Logo.svg.png'
  };

  // Marques par défaut si aucune marque dans la base de données
  const defaultBrands = [
    { _id: 'default-1', title: 'Samsung' },
    { _id: 'default-2', title: 'Apple' },
    { _id: 'default-3', title: 'Nike' },
    { _id: 'default-4', title: 'Adidas' },
    { _id: 'default-5', title: 'Sony' },
    { _id: 'default-6', title: 'LG' },
    { _id: 'default-7', title: 'Zara' },
    { _id: 'default-8', title: 'H&M' },
  ];

  const displayBrands = brands && brands.length > 0 ? brands : defaultBrands;

  return (
    <div className="brand-carousel-wrapper">
      <Slider {...settings}>
        {displayBrands.map((brand, index) => (
          <div key={brand.id || index} className="brand-slide">
            <div className="brand-card">
              <div className="brand-logo">
                <img 
                  src={brandLogos[brand.title?.toLowerCase()] || `https://via.placeholder.com/200x100/f8f9fa/6c757d?text=${brand.title}`} 
                  alt={`Logo ${brand.title}`}
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/200x100/f8f9fa/6c757d?text=${brand.title}`;
                  }}
                />
              </div>
              <h4 className="brand-name">{brand.title}</h4>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BrandCarousel;
