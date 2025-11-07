import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/TranslationContext';

const BlogCard = ({ id, title, description, date, image, category, featured }) => {
  const { t } = useTranslation();
  const imageUrl = image ? image.url : '/images/blog-1.jpg';
  
  // Nettoyer la description HTML
  const cleanDescription = (html) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = (tempDiv.textContent || tempDiv.innerText || '').replace(/\s+/g, ' ').trim();
    return featured ? text.substring(0, 200) : text.substring(0, 120);
  };
  
  const truncatedDescription = cleanDescription(description) + (description && description.length > 120 ? '...' : '');
  
  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className={`blog-card ${featured ? 'blog-card-featured' : ''}`}>
      <div className="blog-card-image-container">
        <img 
          src={imageUrl} 
          className="blog-card-image" 
          alt={title || t('blogArticle')} 
          onError={(e) => { e.target.src = '/images/blog-1.jpg'; }}
        />
        {category && <span className="blog-card-category">{category}</span>}
        {featured && (
          <span className="featured-badge">
            <i className="fas fa-star"></i>
            À la Une
          </span>
        )}
        <div className="blog-card-overlay">
          <Link to={`/blog/${id}`} className="blog-card-read-more" aria-label="Lire l'article">
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
      
      <div className="blog-card-content">
        <div className="blog-card-meta">
          <span className="blog-card-date">
            <i className="far fa-calendar-alt"></i>
            {formattedDate}
          </span>
        </div>
        
        <h3 className="blog-card-title">
          <Link to={`/blog/${id}`}>{title}</Link>
        </h3>
        
        <p className="blog-card-description">{truncatedDescription}</p>
        
        <div className="blog-card-footer">
          <Link to={`/blog/${id}`} className="blog-card-link">
            {t('readFullArticle') || 'Lire la suite'}
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
