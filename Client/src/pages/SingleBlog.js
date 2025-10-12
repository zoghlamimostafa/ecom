import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from '../contexts/TranslationContext';
import { getABlog } from '../features/blogs/blogSlice';
import Meta from '../components/Meta';
import BrandCrumb from '../components/BrandCrumb';
import Container from '../components/Container';

const SingleBlog = () => {
  const { t } = useTranslation();
  const blogState = useSelector((state) => state.blog.singleBlog);
  const isLoading = useSelector((state) => state.blog.isLoading);
  const isError = useSelector((state) => state.blog.isError);
  const location = useLocation();
  const getBlogSlug = location.pathname.split('/')[2]; // This now gets the slug instead of ID
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getABlog(getBlogSlug));
  }, [dispatch, getBlogSlug]);

  return (
    <>
      <Meta title={blogState?.title || t('blogArticle')} />
      <BrandCrumb title={blogState?.title || t('blogArticle')} />
      <Container class1='single-blog-wrapper py-5'>
        <div className='row justify-content-center'>
          <div className='col-lg-8 col-md-10 col-12'>
            <article className='single-blog-article'>
              <div className="single-blog-header">
                <Link to="/blogs" className='back-to-blogs-link'>
                  <HiOutlineArrowSmLeft /> 
                  <span>{t('backToArticles')}</span>
                </Link>
              </div>
              
              {isLoading && (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Chargement de l'article...</p>
                </div>
              )}
              
              {isError && (
                <div className="error-state">
                  <i className="fas fa-exclamation-triangle"></i>
                  <h4>Erreur de chargement</h4>
                  <p>Impossible de charger l'article. Veuillez réessayer.</p>
                  <Link to="/blogs" className="btn btn-primary">{t('backToArticles')}</Link>
                </div>
              )}
              
              {!isLoading && !isError && blogState && (
                <>
                  <header className="article-header">
                    <h1 className='article-title'>{blogState?.title}</h1>
                    
                    <div className="article-meta">
                      <span className="article-date">
                        <i className="far fa-calendar-alt"></i>
                        {new Date(blogState?.createdAt).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      {blogState?.category && (
                        <span className="article-category">
                          <i className="fas fa-tag"></i>
                          {blogState.category}
                        </span>
                      )}
                    </div>
                  </header>
                  
                  <div className="article-image-container">
                    <img 
                      src={blogState?.images && blogState?.images[0] ? blogState.images[0].url : "/images/blog-1.jpg"} 
                      className='article-image' 
                      alt={blogState?.title || t('articleImage')}
                    />
                  </div>
                  
                  <div className="article-content">
                    <div dangerouslySetInnerHTML={{ __html: blogState?.description }}></div>
                  </div>
                  
                  <footer className="article-footer">
                    <div className="article-actions">
                      <Link to="/blogs" className="btn btn-outline-primary">
                        <i className="fas fa-arrow-left"></i>
                        {t('seeMoreArticles')}
                      </Link>
                    </div>
                  </footer>
                </>
              )}
              
              {!isLoading && !isError && !blogState && (
                <div className="not-found-state">
                  <i className="fas fa-search"></i>
                  <h4>Article introuvable</h4>
                  <p>{t('articleNotFound')}</p>
                  <Link to="/blogs" className="btn btn-primary">{t('discoverArticles')}</Link>
                </div>
              )}
            </article>
          </div>
        </div>
      </Container>
    </>
  );
}

export default SingleBlog;
