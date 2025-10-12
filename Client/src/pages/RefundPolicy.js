import React from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import Container from '../components/Container';

const RefundPolicy = () => {
  return (
    <>
      <Meta title={"Politique de remboursement"} />
      <BrandCrumb title="Politique de remboursement" />
      <Container class1='policy-wrapper py-5 home-wrapper-2'>
        <div className='row'>
          <div className='col-12'>
            <div className='policy'>
              <h1 className="text-center mb-5">Politique de remboursement</h1>

              <div className="policy-content">
                <h2>Demande de remboursement</h2>
                <p>Vous pouvez demander un remboursement dans les 30 jours suivant votre achat pour tout produit non utilisé.</p>
                <p>Pour être éligible à un remboursement, votre article doit être dans le même état que vous l'avez reçu, non utilisé et dans son emballage d'origine.</p>

                <h2>Processus de remboursement</h2>
                <p>Pour demander un remboursement, veuillez contacter notre service clientèle. Nous vous fournirons un formulaire de demande de remboursement à remplir.</p>
                <p>Une fois votre demande de remboursement approuvée, nous procéderons au remboursement sur votre mode de paiement d'origine dans les 7 jours ouvrables.</p>

                <h2>Exceptions</h2>
                <p>Les articles soldés ne sont généralement pas remboursables. Seuls les articles à prix régulier peuvent être remboursés.</p>
                <p>Les articles en promotion ou en liquidation ne peuvent pas être remboursés.</p>

                <h2>Contactez-nous</h2>
                <p>Si vous avez des questions concernant notre politique de remboursement, veuillez nous contacter :</p>
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

export default RefundPolicy;
