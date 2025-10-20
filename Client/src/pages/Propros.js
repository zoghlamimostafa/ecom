import React from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import Container from '../components/Container';
import { FaCheckCircle, FaHeart, FaShieldAlt, FaTruck } from 'react-icons/fa';

const AboutPage = () => {
  return (
    <>
      <Meta title={"À propos"} />
      <BrandCrumb title="À propos" />
      <Container class1='policy-wrapper py-5 home-wrapper-2'>
        <div className='row'>
          <div className='col-12'>
            <div className='policy'>
              <h1 className="text-center mb-4">À propos de nous</h1>
              
              {/* Introduction */}
              <div className="about-intro">
                <p className="lead-text">
                  Bienvenue chez <strong>Sanny Store</strong>, votre destination privilégiée pour le shopping en ligne. 
                  Nous sommes passionnés par la fourniture de produits de haute qualité et de services exceptionnels.
                </p>
              </div>

              {/* Notre Mission */}
              <div className="about-section">
                <h2 className="section-title">Notre Mission</h2>
                <p>
                  Notre objectif est de rendre votre expérience de magasinage aussi agréable et transparente que possible. 
                  Nous nous engageons à offrir une large gamme de produits allant des produits électroniques aux vêtements, 
                  en passant par les produits de beauté et bien plus encore.
                </p>
              </div>

              {/* Nos Valeurs */}
              <div className="about-section">
                <h2 className="section-title">Nos Valeurs</h2>
                <div className="values-grid">
                  <div className="value-card">
                    <div className="value-icon">
                      <FaCheckCircle />
                    </div>
                    <h3>Qualité</h3>
                    <p>Nous sélectionnons rigoureusement chaque produit pour garantir la meilleure qualité à nos clients.</p>
                  </div>
                  <div className="value-card">
                    <div className="value-icon">
                      <FaHeart />
                    </div>
                    <h3>Satisfaction Client</h3>
                    <p>Votre satisfaction est notre priorité. Nous sommes à votre écoute pour répondre à tous vos besoins.</p>
                  </div>
                  <div className="value-card">
                    <div className="value-icon">
                      <FaShieldAlt />
                    </div>
                    <h3>Confiance</h3>
                    <p>Nous croyons en la transparence et l'intégrité dans toutes nos relations avec nos clients.</p>
                  </div>
                  <div className="value-card">
                    <div className="value-icon">
                      <FaTruck />
                    </div>
                    <h3>Livraison Rapide</h3>
                    <p>Nous nous engageons à livrer vos commandes rapidement et en toute sécurité.</p>
                  </div>
                </div>
              </div>

              {/* Notre Engagement */}
              <div className="about-section">
                <h2 className="section-title">Notre Engagement</h2>
                <p>
                  Notre équipe dévouée travaille sans relâche pour vous fournir les meilleures solutions possibles. 
                  Nous sommes constamment à la recherche de nouveaux produits et services pour améliorer votre expérience d'achat.
                </p>
                <p>
                  Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter. 
                  Nous sommes là pour vous aider et vous accompagner à chaque étape de votre parcours d'achat.
                </p>
              </div>

              {/* Remerciements */}
              <div className="about-footer">
                <p>
                  <strong>Merci de faire confiance à Sanny Store</strong> pour vos besoins d'achat en ligne. 
                  Nous sommes impatients de vous servir et de vous offrir une expérience de magasinage exceptionnelle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default AboutPage;
