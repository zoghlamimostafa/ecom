import React from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import Container from './Container';
import '../styles/Testimonials.css';

const TestimonialsSection = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: "Sarah B.",
      role: t('verifiedBuyer'),
      content: t('testimonial1'),
      rating: 5
    },
    {
      name: "Mohamed A.",
      role: t('loyalCustomer'),
      content: t('testimonial2'),
      rating: 5
    },
    {
      name: "Leila R.",
      role: t('verifiedBuyer'),
      content: t('testimonial3'),
      rating: 5
    }
  ];

  return (
    <Container class1="testimonials-section py-5">
      <div className="row">
        <div className="col-12 text-center mb-5">
          <h2 className="section-title">{t('whatClientsSay')}</h2>
          <p className="section-subtitle">{t('testimonialSubtitle')}</p>
        </div>
      </div>
      <div className="row justify-content-center">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="col-lg-4 col-md-6 mb-4">
            <div className="testimonial-card" data-aos="fade-up" data-aos-delay={index * 100}>
              <div className="quote-icon">
                <FaQuoteLeft />
              </div>
              <div className="rating mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="star-icon" />
                ))}
              </div>
              <p className="testimonial-content">{testimonial.content}</p>
                            <div className="testimonial-author">
                <div className="author-info">
                  <h5 className="author-name">{testimonial.name}</h5>
                  <p className="author-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
};

export default TestimonialsSection;