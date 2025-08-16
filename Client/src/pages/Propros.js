import React from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import Container from '../components/Container';

const AboutPage = () => {
  return (
    <>
      <Meta title={"À propos"} />
      <BrandCrumb title="À propos" />
      <Container class1='policy-wrapper py-5 home-wrapper-2'>
        <div className='row'>
          <div className='col-12'>
          <div className='policy'>
              <h1 className="text-center mb-5">À propos de nous</h1>
              <div className="policy-content">

              <p>Nous sommes une entreprise passionnée par la fourniture de produits de haute qualité et de services exceptionnels à nos clients. Notre objectif est de rendre votre expérience de magasinage aussi agréable et transparente que possible.</p>
              <p>Nous nous engageons à offrir une large gamme de produits allant des produits électroniques aux vêtements, en passant par les produits de beauté et bien plus encore. Notre équipe est dévouée à répondre à vos besoins et à vous fournir les meilleures solutions possibles.</p>
              <p>Nous croyons en la transparence, l'intégrité et le service clientèle de premier ordre. Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter. Nous sommes là pour vous aider.</p>
              <p>Merci de faire confiance à notre entreprise pour vos besoins d'achat en ligne. Nous sommes impatients de vous servir et de vous offrir une expérience de magasinage exceptionnelle.</p>
            </div>
            /</div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default AboutPage;
