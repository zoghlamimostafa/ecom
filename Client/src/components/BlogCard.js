import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../contexts/TranslationContext';

const BlogCard = ({ id, title, description, date, image, category, featured }) => {
  const { t } = useTranslation();
  const imageUrl = image ? image.url : '/images/blog-1.jpg';
  const truncatedDescription = description ? `${description.substr(0, 120)}...` : '';
  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <article className={`blog-card ${featured ? 'blog-card-featured' : ''}`}>
      <div className="blog-card-image-container">
        <img src={imageUrl} className="blog-card-image" alt={title || t('blogArticle')} />
        {category && <span className="blog-card-category">{category}</span>}
        <div className="blog-card-overlay">
          <Link to={`/blog/${id}`} className="blog-card-read-more">
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
        
        <div className="blog-card-description" dangerouslySetInnerHTML={{ __html: truncatedDescription }}></div>
        
        <div className="blog-card-footer">
          <Link to={`/blog/${id}`} className="blog-card-link">
            {t('readFullArticle')}
            <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
