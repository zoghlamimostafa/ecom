import React from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import Container from '../components/Container';

const PrivacyPolicy = () => {
  return (
    <>
      <Meta title={"Politique de confidentialité"} />
      <BrandCrumb title="Politique de confidentialité" />
      <Container class1='policy-wrapper py-5 home-wrapper-2'>
        <div className='row'>
          <div className='col-12'>
            <div className='policy'>
              <h1 className="text-center mb-5">Politique de confidentialité</h1>

              <div className="policy-content">
                <h2>Collecte des informations</h2>
                <p>Nous recueillons des informations lorsque vous vous inscrivez sur notre site, passez une commande, vous abonnez à notre newsletter, répondez à un sondage ou remplissez un formulaire.</p>
                <p>Les informations recueillies incluent votre nom, votre adresse e-mail, votre adresse postale, votre numéro de téléphone. En outre, nous recevons et enregistrons automatiquement des informations à partir de votre ordinateur et navigateur, y compris votre adresse IP, vos logiciels et votre matériel, et la page que vous demandez.</p>

                <h2>Utilisation des informations</h2>
                <p>Toutes les informations que nous recueillons auprès de vous peuvent être utilisées pour :</p>
                <ul>
                  <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
                  <li>Fournir un contenu publicitaire personnalisé</li>
                  <li>Améliorer notre site Web</li>
                  <li>Améliorer le service client et vos besoins de prise en charge</li>
                  <li>Vous contacter par e-mail</li>
                  <li>Administrer un concours, une promotion, ou un enquête</li>
                </ul>

                <h2>Divulgation à des tiers</h2>
                <p>Nous ne vendons, n'échangeons et ne transférons pas vos informations personnelles identifiables à des tiers. Cela ne comprend pas les tierce parties de confiance qui nous aident à exploiter notre site Web ou à mener nos affaires, tant que ces parties conviennent de garder ces informations confidentielles.</p>

                <h2>Protection des informations</h2>
                <p>Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les informations sensibles transmises en ligne. Nous protégeons également vos informations hors ligne. Seuls les employés qui ont besoin d'effectuer un travail spécifique (par exemple, la facturation ou le service à la clientèle) ont accès aux informations personnelles identifiables.</p>

                <h2>Consentement</h2>
                <p>En utilisant notre site, vous consentez à notre politique de confidentialité en ligne.</p>

                <h2>Modification de notre politique de confidentialité</h2>
                <p>Si nous décidons de modifier notre politique de confidentialité, nous mettrons à jour les modifications sur cette page.</p>

                <h2>Contactez-nous</h2>
                <p>Si vous avez des questions concernant cette politique de confidentialité, vous pouvez nous contacter en utilisant les informations ci-dessous :</p>
                <p>Nom de l'entreprise<br />
                  Adresse de l'entreprise<br />
                  Ville, Pays<br />
                  Email : contact@entreprise.com<br />
                  Téléphone : +123456789</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default PrivacyPolicy;
