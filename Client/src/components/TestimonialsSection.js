import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '../contexts/TranslationContext';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import Container from './Container';
import { getAllRatings } from '../features/products/productSlice';
import '../styles/Testimonials.css';

const TestimonialsSection = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const allRatings = useSelector((state) => state.product.allRatings);

  // Charger les avis au montage du composant
  useEffect(() => {
    dispatch(getAllRatings());
  }, [dispatch]);

  // Avis par défaut si aucun avis réel n'est disponible
  const defaultTestimonials = [
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

  // Utiliser les vrais avis s'ils existent, sinon utiliser les avis par défaut
  // Prendre les 3 derniers avis avec les meilleures notes (4 ou 5 étoiles)
  const realTestimonials = allRatings
    ?.filter(rating => rating.star >= 4) // Seulement les avis 4 et 5 étoiles
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Trier par date (plus récent d'abord)
    ?.slice(0, 3) // Prendre les 3 premiers
    ?.map(rating => ({
      name: rating.postedby?.firstname && rating.postedby?.lastname 
        ? `${rating.postedby.firstname} ${rating.postedby.lastname.charAt(0)}.`
        : 'Client anonyme',
      role: t('verifiedBuyer'),
      content: rating.comment,
      rating: rating.star,
      productTitle: rating.product?.title
    })) || [];

  // Utiliser les vrais avis s'il y en a au moins 3, sinon utiliser les avis par défaut
  const testimonials = realTestimonials.length >= 3 ? realTestimonials : defaultTestimonials;

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
              {testimonial.productTitle && (
                <p className="testimonial-product">
                  <small>Produit : {testimonial.productTitle}</small>
                </p>
              )}
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