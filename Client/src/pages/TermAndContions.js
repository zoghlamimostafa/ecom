import React from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import Container from '../components/Container';

const TermAndConditions = () => {
  return (
    <>
      <Meta title={"Termes et conditions"} />
      <BrandCrumb title="Termes et conditions" />
      <Container class1='policy-wrapper py-5 home-wrapper-2'>
        <div className='row'>
          <div className='col-12'>
            <div className='policy'>
              <h1 className="text-center mb-5">Termes et conditions</h1>

              <div className="policy-content">
                <h2>Introduction</h2>
                <p>Ces termes et conditions régissent votre utilisation de ce site Web; en utilisant ce site Web, vous acceptez ces termes et conditions dans leur intégralité. Si vous n'acceptez pas ces termes et conditions ou une partie de ces termes et conditions, vous ne devez pas utiliser ce site Web.</p>

                <h2>License to use website</h2>
                <p>Sauf indication contraire, nous ou nos concédants de licence détenons les droits de propriété intellectuelle sur le site Web et le matériel sur le site Web. Sous réserve de la licence ci-dessous, tous ces droits de propriété intellectuelle sont réservés.</p>

                <h2>Restrictions</h2>
                <p>Vous ne devez pas :</p>
                <ul>
                  <li>Republier du matériel à partir de ce site Web (y compris republication sur un autre site Web);</li>
                  <li>Vendre, louer ou sous-licencier du matériel à partir du site Web;</li>
                  <li>Montrer tout matériel du site Web en public;</li>
                  <li>Reproduire, dupliquer, copier ou exploiter à d'autres fins tout matériel sur notre site Web;</li>
                  <li>Réutiliser quelque matériel que ce soit sur notre site Web à des fins commerciales;</li>
                  <li>Modifier ou modifier tout matériel sur le site Web; ou</li>
                  <li>Redistribuer le contenu de ce site (à l'exception du contenu spécifiquement et expressément mis à disposition pour redistribution).</li>
                </ul>

                <h2>Remarques spéciales pour les enseignants</h2>
                <p>Si vous êtes enseignant, vous pouvez imprimer ou télécharger du matériel à partir du site Web à des fins pédagogiques, à condition que vous ne modifiiez pas le contenu et que vous conserviez tous les avis de droits d'auteur et autres avis de propriété contenus dans le matériel d'origine.</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default TermAndConditions;
