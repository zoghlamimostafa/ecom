import React from 'react';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta';
import Container from '../components/Container';
import HeroSection from '../components/HeroSection';
import { FaGavel, FaShieldAlt, FaUserSecret, FaCopyright } from 'react-icons/fa';

const LegalNotice = () => {
  return (
    <>
      <Meta title="Mentions Légales | Sanny Store" />
      <HeroSection 
        title="Mentions Légales" 
        subtitle="Informations légales et réglementaires concernant Sanny Store"
      />
      <BreadCrumb title="Mentions Légales" />
      <Container class1="legal-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="legal-header">
              <h1>Mentions Légales</h1>
              <p>Informations légales et réglementaires concernant Sanny Store</p>
            </div>

            <div className="legal-content">
              {/* Identification de l'entreprise */}
              <div className="legal-section">
                <div className="section-icon">
                  <FaGavel />
                </div>
                <h2>1. Identification de l'entreprise</h2>
                <div className="section-content">
                  <p><strong>Raison sociale :</strong> Sanny Store SARL</p>
                  <p><strong>Forme juridique :</strong> Société à Responsabilité Limitée</p>
                  <p><strong>Capital social :</strong> 10 000 TND</p>
                  <p><strong>Siège social :</strong> Avenue Habib Bourguiba, 1000 Tunis, Tunisie</p>
                  <p><strong>Registre du commerce :</strong> B123456789</p>
                  <p><strong>Numéro d'identification fiscale :</strong> 1234567/A/M/000</p>
                  <p><strong>Téléphone :</strong> +216 XX XXX XXX</p>
                  <p><strong>Email :</strong> contact@sannystore.com</p>
                </div>
              </div>

              {/* Directeur de publication */}
              <div className="legal-section">
                <div className="section-icon">
                  <FaUserSecret />
                </div>
                <h2>2. Directeur de publication</h2>
                <div className="section-content">
                  <p><strong>Nom :</strong> M. Sanny Ben Ahmed</p>
                  <p><strong>Qualité :</strong> Gérant de la société</p>
                  <p><strong>Email :</strong> direction@sannystore.com</p>
                </div>
              </div>

              {/* Hébergement */}
              <div className="legal-section">
                <div className="section-icon">
                  <FaShieldAlt />
                </div>
                <h2>3. Hébergement du site</h2>
                <div className="section-content">
                  <p><strong>Hébergeur :</strong> Hostinger International Ltd.</p>
                  <p><strong>Adresse :</strong> 61 Lordou Vironos Street, 6023 Larnaca, Chypre</p>
                  <p><strong>Téléphone :</strong> +357 25 255 255</p>
                </div>
              </div>

              {/* Propriété intellectuelle */}
              <div className="legal-section">
                <div className="section-icon">
                  <FaCopyright />
                </div>
                <h2>4. Propriété intellectuelle</h2>
                <div className="section-content">
                  <p>
                    L'ensemble du contenu du site Sanny Store (textes, images, logos, vidéos, etc.) 
                    est protégé par le droit d'auteur et appartient à Sanny Store ou à ses partenaires. 
                    Toute reproduction, même partielle, est interdite sans autorisation préalable.
                  </p>
                  <p>
                    Les marques et logos présents sur le site sont des marques déposées de leurs 
                    propriétaires respectifs. Leur utilisation sans autorisation est strictement interdite.
                  </p>
                </div>
              </div>

              {/* Données personnelles */}
              <div className="legal-section">
                <h2>5. Protection des données personnelles</h2>
                <div className="section-content">
                  <p>
                    Conformément à la loi tunisienne sur la protection des données personnelles, 
                    vous disposez d'un droit d'accès, de rectification et de suppression des données 
                    vous concernant.
                  </p>
                  <p>
                    Pour exercer ces droits, vous pouvez nous contacter à l'adresse : 
                    <strong> privacy@sannystore.com</strong>
                  </p>
                  <p>
                    Nos pratiques de collecte et d'utilisation des données sont détaillées dans 
                    notre politique de confidentialité.
                  </p>
                </div>
              </div>

              {/* Conditions d'utilisation */}
              <div className="legal-section">
                <h2>6. Conditions d'utilisation</h2>
                <div className="section-content">
                  <p>
                    L'utilisation du site Sanny Store implique l'acceptation pleine et entière 
                    des conditions générales d'utilisation et de vente.
                  </p>
                  <p>
                    L'utilisateur s'engage à utiliser le site de manière loyale et à ne pas 
                    porter atteinte à l'ordre public et aux bonnes mœurs.
                  </p>
                </div>
              </div>

              {/* Responsabilité */}
              <div className="legal-section">
                <h2>7. Limitation de responsabilité</h2>
                <div className="section-content">
                  <p>
                    Sanny Store met tout en œuvre pour offrir aux utilisateurs des informations 
                    et/ou des outils disponibles et vérifiés, mais ne saurait être tenu pour 
                    responsable des erreurs, d'une absence de disponibilité des informations et/ou 
                    de la présence de virus sur son site.
                  </p>
                  <p>
                    Les informations fournies le sont à titre indicatif et ne sauraient dispenser 
                    l'utilisateur d'une analyse complémentaire et personnalisée.
                  </p>
                </div>
              </div>

              {/* Droit applicable */}
              <div className="legal-section">
                <h2>8. Droit applicable et juridiction</h2>
                <div className="section-content">
                  <p>
                    Les présentes mentions légales sont soumises au droit tunisien. 
                    Tout litige relatif à l'utilisation du site sera de la compétence 
                    exclusive des tribunaux de Tunis.
                  </p>
                </div>
              </div>

              {/* Modification */}
              <div className="legal-section">
                <h2>9. Modification des mentions légales</h2>
                <div className="section-content">
                  <p>
                    Sanny Store se réserve le droit de modifier à tout moment les présentes 
                    mentions légales. Les utilisateurs sont invités à les consulter régulièrement.
                  </p>
                  <p><strong>Dernière mise à jour :</strong> 1er septembre 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default LegalNotice;
