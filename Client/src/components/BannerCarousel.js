import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const BannerCarousel = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Slider {...settings}>
      {images.map((imageUrl, index) => (
        <div key={index}>
          <img src={imageUrl} alt={`Image ${index + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto' }} />
        </div>
      ))}
    </Slider>
  );
};

export default BannerCarousel;
