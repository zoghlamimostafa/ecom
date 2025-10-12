import React from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import Container from '../components/Container';

const ShippingPolicy = () => {
  return (
    <>
      <Meta title={"Politique de livraison"} />
      <BrandCrumb title="Politique de livraison" />
      <Container class1='policy-wrapper py-5 home-wrapper-2'>
        <div className='row'>
          <div className='col-12'>
            <div className='policy'>
              <h1 className="text-center mb-5">Politique de livraison</h1>

              <div className="policy-content">
                <h2>Délais de livraison</h2>
                <p>Nous nous efforçons de livrer vos commandes dans les plus brefs délais. Les délais de livraison peuvent varier en fonction de votre emplacement et des restrictions de livraison.</p>
                <p>Vous pouvez consulter les détails de livraison spécifiques à votre commande lors du processus de paiement.</p>

                <h2>Frais de livraison</h2>
                <p>Les frais de livraison sont calculés en fonction du poids de votre commande, de votre emplacement et de l'option de livraison que vous choisissez.</p>
                <p>Les frais de livraison exacts seront affichés lors du processus de paiement.</p>

                <h2>Suivi de commande</h2>
                <p>Une fois votre commande expédiée, vous recevrez un numéro de suivi par e-mail. Vous pouvez utiliser ce numéro pour suivre l'état de votre commande en temps réel.</p>

                <h2>Retours et échanges</h2>
                <p>Pour des informations sur les retours et les échanges, veuillez consulter notre politique de retour.</p>

                <h2>Contactez-nous</h2>
                <p>Si vous avez des questions concernant notre politique de livraison, veuillez nous contacter :</p>
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

export default ShippingPolicy;
