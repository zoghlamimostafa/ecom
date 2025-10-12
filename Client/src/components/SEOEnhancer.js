import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from '../contexts/TranslationContext';

const SEOEnhancer = ({ 
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  article = null
}) => {
  const { t, currentLanguage } = useTranslation();

  // Utiliser les traductions par défaut si aucun titre/description n'est fourni
  const seoTitle = title || t('siteTitle');
  const seoDescription = description || t('siteDescription');
  const seoKeywords = keywords || t('siteKeywords');
  const seoImage = image || '/images/sanny-store-logo.png';
  const seoUrl = url || window.location.href;

  return (
    <Helmet>
      {/* Titre de base */}
      <title>{seoTitle}</title>
      
      {/* Meta descriptions */}
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      
      {/* Language et locale */}
      <html lang={currentLanguage} />
      <meta property="og:locale" content={
        currentLanguage === 'fr' ? 'fr_FR' : 
        currentLanguage === 'ar' ? 'ar_AR' : 'en_US'
      } />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />
      <meta property="og:url" content={seoUrl} />
      <meta property="og:site_name" content={t('siteName')} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Article spécifique */}
      {article && (
        <>
          <meta property="article:author" content={article.author} />
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:section" content={article.section} />
          {article.tags && article.tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Données structurées JSON-LD pour le commerce électronique */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": t('siteName'),
          "description": t('siteDescription'),
          "url": seoUrl,
          "logo": {
            "@type": "ImageObject",
            "url": seoImage
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+216-XX-XXX-XXX",
            "contactType": "customer service",
            "availableLanguage": ["French", "English", "Arabic"]
          },
          "sameAs": [
            "https://www.facebook.com/sannystore",
            "https://www.instagram.com/sannystore",
            "https://twitter.com/sannystore"
          ],
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${window.location.origin}/product?search={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
      
      {/* Données structurées pour le site e-commerce */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": t('siteName'),
          "description": t('siteDescription'),
          "url": window.location.origin,
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": `${window.location.origin}/product?search={search_term_string}`
            },
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
      
      {/* Balises robots et canonique */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={seoUrl} />
      
      {/* Balises pour le mobile */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Balises pour les moteurs de recherche */}
      <meta name="author" content="el-makina.tn" />
      <meta name="generator" content="Sanny Store - el-makina.tn" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Géolocalisation pour la Tunisie */}
      <meta name="geo.region" content="TN" />
      <meta name="geo.placename" content="Tunisia" />
      <meta name="geo.position" content="33.886917;9.537499" />
      <meta name="ICBM" content="33.886917, 9.537499" />
    </Helmet>
  );
};

export default SEOEnhancer;