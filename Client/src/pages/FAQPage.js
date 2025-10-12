import React from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import Container from '../components/Container';

const FAQPage = () => {
  return (
    <>
      <Meta title={"FAQ"} />
      <BrandCrumb title="FAQ" />
      <Container class1='faq-wrapper py-5 home-wrapper-2'>
        <div className='row'>
          <div className='col-12'>
            <div className='faq-content'>
              <h1 className="text-center mb-5">Foire Aux Questions (FAQ)</h1>
              <div className="accordion" id="faqAccordion">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Quels sont les modes de paiement acceptés ?
                    </button>
                  </h2>
                  <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Nous acceptons les cartes de crédit et les virements bancaires.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                      Quels sont les délais de livraison ?
                    </button>
                  </h2>
                  <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Les délais de livraison varient en fonction de votre emplacement. Habituellement, les commandes sont livrées dans un délai de 3 à 7 jours ouvrables.
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                      Puis-je retourner un produit ?
                    </button>
                  </h2>
                  <div id="collapseThree" className="accordion-collapse collapse" aria-labelledby="headingThree" data-bs-parent="#faqAccordion">
                    <div className="accordion-body">
                      Oui, nous acceptons les retours dans les 30 jours suivant l'achat, à condition que le produit soit dans son état d'origine.
                    </div>
                  </div>
                </div>
                {/* Ajoutez d'autres questions et réponses ici */}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default FAQPage;
