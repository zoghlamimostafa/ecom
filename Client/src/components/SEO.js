import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ 
  title = "Sanny Shop - Boutique en Ligne",
  description = "Découvrez nos produits de qualité : smartphones, électronique, mode et accessoires aux meilleurs prix.",
  keywords = "boutique en ligne, e-commerce, smartphones, électronique, mode, accessoires",
  image = "/logosanny.png",
  url = window.location.href,
  type = "website"
}) => {
  const fullTitle = title.includes('Sanny Shop') ? title : `${title} | Sanny Shop`;
  const baseUrl = window.location.origin;
  const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`;
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};

export default SEO;
