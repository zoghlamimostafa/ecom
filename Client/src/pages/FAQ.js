import React, { useState } from 'react';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta';
import Container from '../components/Container';
import HeroSection from '../components/HeroSection';
import { FaChevronDown, FaChevronUp, FaQuestionCircle, FaPhone, FaEnvelope, FaClock, FaUserFriends } from 'react-icons/fa';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "Comment passer une commande sur Sanny Store ?",
      answer: "Pour passer une commande, ajoutez simplement les produits souhaités à votre panier, puis cliquez sur 'Passer commande'. Vous devrez créer un compte ou vous connecter, renseigner vos informations de livraison et choisir votre mode de paiement."
    },
    {
      question: "Quels sont les modes de paiement acceptés ?",
      answer: "Nous acceptons les cartes bancaires (Visa, MasterCard), les virements bancaires et le paiement à la livraison dans certaines zones. Tous les paiements sont sécurisés par cryptage SSL."
    },
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Les délais de livraison varient selon votre localisation : 24-48h pour les grandes villes, 2-5 jours ouvrables pour les autres zones. Pour les commandes urgentes, nous proposons une livraison express en 24h."
    },
    {
      question: "Comment suivre ma commande ?",
      answer: "Une fois votre commande expédiée, vous recevrez un email avec un numéro de suivi. Vous pouvez également suivre votre commande depuis votre espace client dans la section 'Mes commandes'."
    },
    {
      question: "Quelle est votre politique de retour ?",
      answer: "Vous disposez de 14 jours pour retourner un article non conforme ou défectueux. Les produits doivent être dans leur emballage d'origine. Les frais de retour sont à votre charge sauf en cas de produit défectueux."
    },
    {
      question: "Comment obtenir un remboursement ?",
      answer: "Pour obtenir un remboursement, contactez notre service client avec votre numéro de commande. Après vérification, le remboursement sera effectué sous 5-10 jours ouvrables sur votre mode de paiement initial."
    },
    {
      question: "Puis-je modifier ou annuler ma commande ?",
      answer: "Vous pouvez modifier ou annuler votre commande dans les 2 heures suivant sa validation, en contactant notre service client. Passé ce délai, la commande sera en cours de préparation."
    },
    {
      question: "Livrez-vous à l'international ?",
      answer: "Actuellement, nous livrons principalement en Tunisie. Pour les commandes internationales, veuillez nous contacter directement pour étudier les possibilités et les frais de port."
    },
    {
      question: "Comment contacter le service client ?",
      answer: "Notre service client est disponible du lundi au vendredi de 9h à 18h. Vous pouvez nous contacter par email à Sannyshop02@gmail.com, par téléphone au +216 99 249 987, ou via notre formulaire de contact."
    },
    {
      question: "Les produits sont-ils garantis ?",
      answer: "Tous nos produits bénéficient de la garantie constructeur. En plus, nous offrons une garantie satisfaction : si vous n'êtes pas satisfait, retournez le produit dans les 14 jours pour un remboursement complet."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <Meta title="FAQ - Questions Fréquentes | Sanny Store" />
      <div className="faq-hero-section">
        <div className="faq-hero-background">
          <div className="faq-hero-overlay"></div>
          <div className="faq-hero-content">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8 text-center">
                  <div className="faq-hero-icon">
                    <FaQuestionCircle />
                  </div>
                  <h1 className="faq-hero-title">Centre d'Aide & FAQ</h1>
                  <p className="faq-hero-subtitle">
                    Trouvez rapidement les réponses à toutes vos questions sur Sanny Store
                  </p>
                  <div className="faq-hero-stats">
                    <div className="faq-stat">
                      <FaUserFriends />
                      <span>+10,000 clients satisfaits</span>
                    </div>
                    <div className="faq-stat">
                      <FaQuestionCircle />
                      <span>Questions les plus fréquentes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <BreadCrumb title="FAQ" />
      <Container class1="faq-wrapper py-5">
        <div className="row">
          <div className="col-12">
            <div className="faq-intro-section">
              <div className="row align-items-center">
                <div className="col-lg-6">
                  <h2 className="faq-intro-title">Comment pouvons-nous vous aider ?</h2>
                  <p className="faq-intro-text">
                    Notre équipe a rassemblé les réponses aux questions les plus fréquemment posées 
                    pour vous aider à profiter pleinement de votre expérience Sanny Store.
                  </p>
                </div>
                <div className="col-lg-6">
                  <div className="faq-quick-contact">
                    <h4>Support Direct</h4>
                    <div className="quick-contact-item">
                      <FaPhone />
                      <span>+216 99 249 987</span>
                    </div>
                    <div className="quick-contact-item">
                      <FaEnvelope />
                      <span>Sannyshop02@gmail.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="faq-content">
              {faqData.map((faq, index) => (
                <div 
                  key={index} 
                  className={`faq-item ${activeIndex === index ? 'active' : ''}`}
                >
                  <div 
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                  >
                    <h3>{faq.question}</h3>
                    <span className="faq-icon">
                      {activeIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </div>
                  <div className={`faq-answer ${activeIndex === index ? 'show' : ''}`}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="faq-contact-section">
              <div className="row">
                <div className="col-lg-8 mx-auto">
                  <div className="faq-contact-card">
                    <div className="faq-contact-header">
                      <h2>Besoin d'aide supplémentaire ?</h2>
                      <p>Notre équipe de support dédiée est là pour vous accompagner</p>
                    </div>
                    <div className="faq-contact-options">
                      <div className="contact-option">
                        <div className="contact-icon">
                          <FaEnvelope />
                        </div>
                        <div className="contact-info">
                          <h4>Email Support</h4>
                          <p>Sannyshop02@gmail.com</p>
                          <span className="response-time">Réponse sous 24h</span>
                        </div>
                      </div>
                      <div className="contact-option">
                        <div className="contact-icon">
                          <FaPhone />
                        </div>
                        <div className="contact-info">
                          <h4>Support Téléphonique</h4>
                          <p>+216 99 249 987</p>
                          <span className="response-time">Disponible immédiatement</span>
                        </div>
                      </div>
                      <div className="contact-option">
                        <div className="contact-icon">
                          <FaClock />
                        </div>
                        <div className="contact-info">
                          <h4>Horaires d'ouverture</h4>
                          <p>Lundi - Vendredi</p>
                          <span className="response-time">9h00 - 18h00</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default FAQ;
