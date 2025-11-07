import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useTranslation } from '../contexts/TranslationContext';
import { createQuery } from '../features/contact/contactSlice';
import Meta from '../components/Meta';
import SEOEnhancer from '../components/SEOEnhancer';
import BrandCrumb from '../components/BrandCrumb';
import Container from '../components/Container';
import CONTACT_INFO from '../config/contactInfo';
import { 
  FaHome, 
  FaPhone, 
  FaEnvelope, 
  FaInfoCircle, 
  FaUser, 
  FaComments,
  FaMapMarkerAlt,
  FaClock,
  FaPaperPlane
} from 'react-icons/fa';

const getContactSchema = (t) => yup.object({
  name: yup.string().required(t('nameRequired')),
  email: yup.string().email(t('invalidEmail')).required(t('emailRequired')),
  mobile: yup.string().required(t('phoneRequired')),
  address: yup.string().required(t('addressRequired')),
  comment: yup.string().required(t('messageRequired')),
});

const Contact = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobile: '',
      address: '',
      comment: '',
    },
    validationSchema: getContactSchema(t),
    onSubmit: (values, { resetForm }) => {
      dispatch(createQuery(values));
      resetForm();
    },
  });

  return (
    <>
      <SEOEnhancer 
        title={t('contactPageTitle')}
        description={t('contactPageDescription')}
        keywords={t('contactPageKeywords')}
        pageType="contact"
      />
      <Meta title={t('contactUs')} />
      <BrandCrumb title={t('contactUs')} />
      
      {/* Section héro */}
      <section className="contact-hero">
        <Container class1="py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-content">
                <h1 className="hero-title">Restons en Contact</h1>
                <p className="hero-subtitle">
                  Nous sommes là pour vous aider ! Contactez-nous pour toute question 
                  ou demande concernant nos produits et services.
                </p>
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">24h</span>
                    <span className="stat-label">Réponse rapide</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">7j/7</span>
                    <span className="stat-label">Support client</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Satisfaction</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-image">
                <div className="contact-illustration">
                  <FaComments className="floating-icon" />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Section principale */}
      <Container class1="contact-wrapper py-5">
        {/* Carte interactive */}
        <div className="row mb-5">
          <div className="col-12">
            <div className="map-container">
              <div className="map-overlay">
                <h3>Notre Localisation</h3>
                <p>Visitez-nous à notre siège social en Tunisie</p>
              </div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6783609.113773861!2d4.2692090130773375!3d33.88169138230417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x125595448316a4e1%3A0x3a84333aaa019bef!2sTunisie!5e0!3m2!1sfr!2stn!4v1709173941590!5m2!1sfr!2stn"
                width="100%"
                height="400"
                className="contact-map"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Notre localisation en Tunisie"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Formulaire et informations */}
        <div className="row g-5">
          {/* Formulaire de contact */}
          <div className="col-lg-8">
            <div className="contact-form-container">
              <div className="form-header">
                <h2 className="form-title">Envoyez-nous un message</h2>
                <p className="form-subtitle">
                  Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
              
              <form onSubmit={formik.handleSubmit} className="contact-form">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <FaUser className="label-icon" />
                        Nom complet
                      </label>
                      <input
                        type="text"
                        className={`form-input ${formik.touched.name && formik.errors.name ? 'error' : ''}`}
                        placeholder="Votre nom complet"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className="error-message">{formik.errors.name}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="form-label">
                        <FaEnvelope className="label-icon" />
                        Adresse email
                      </label>
                      <input
                        type="email"
                        className={`form-input ${formik.touched.email && formik.errors.email ? 'error' : ''}`}
                        placeholder="votre@email.com"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className="error-message">{formik.errors.email}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">
                        <FaPhone className="label-icon" />
                        Numéro de téléphone
                      </label>
                      <input
                        type="tel"
                        className={`form-input ${formik.touched.mobile && formik.errors.mobile ? 'error' : ''}`}
                        placeholder="+216 XX XXX XXX"
                        name="mobile"
                        value={formik.values.mobile}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.mobile && formik.errors.mobile && (
                        <div className="error-message">{formik.errors.mobile}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">
                        <FaMapMarkerAlt className="label-icon" />
                        Adresse physique
                      </label>
                      <input
                        type="text"
                        className={`form-input ${formik.touched.address && formik.errors.address ? 'error' : ''}`}
                        placeholder={t('yourCompleteAddress')}
                        name="address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.address && formik.errors.address && (
                        <div className="error-message">{formik.errors.address}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">
                        <FaComments className="label-icon" />
                        Votre message
                      </label>
                      <textarea
                        className={`form-textarea ${formik.touched.comment && formik.errors.comment ? 'error' : ''}`}
                        rows="5"
                        placeholder={t('describeYourRequest')}
                        name="comment"
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      ></textarea>
                      {formik.touched.comment && formik.errors.comment && (
                        <div className="error-message">{formik.errors.comment}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-12">
                    <button className="submit-btn" type="submit">
                      <FaPaperPlane className="btn-icon" />
                      {t('send')}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="col-lg-4">
            <div className="contact-info-container">
              <div className="info-header">
                <h3 className="info-title">Nos Coordonnées</h3>
                <p className="info-subtitle">Plusieurs façons de nous contacter</p>
              </div>
              
              <div className="contact-info-cards">
                <div className="info-card highlight-card">
                  <div className="info-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <div className="info-content">
                    <h4>Adresse</h4>
                    <p>Avenue Habib Bourguiba<br />Tunis, Tunisie 1000</p>
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="info-icon">
                    <FaPhone />
                  </div>
                  <div className="info-content">
                    <h4>Téléphone</h4>
                    <p><a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`}>{CONTACT_INFO.phoneFormatted}</a></p>
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="info-icon">
                    <FaEnvelope />
                  </div>
                  <div className="info-content">
                    <h4>Email</h4>
                    <p><a href={`mailto:${CONTACT_INFO.email}`}>{CONTACT_INFO.email}</a></p>
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="info-icon">
                    <FaClock />
                  </div>
                  <div className="info-content">
                    <h4>Horaires d'ouverture</h4>
                    <p>Lundi - Vendredi: 9h - 18h</p>
                    <p>Samedi: 9h - 14h</p>
                    <p>Dimanche: Fermé</p>
                  </div>
                </div>
              </div>
              
              <div className="contact-cta">
                <h4>Besoin d'aide immédiate ?</h4>
                <p>Notre équipe de support est disponible pour vous aider</p>
                <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="cta-btn">
                  <FaPhone /> Appelez maintenant
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Contact;
