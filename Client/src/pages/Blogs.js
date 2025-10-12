import React, { useEffect } from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import BlogCard from '../components/BlogCard';
import Container from '../components/Container';
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import { useTranslation } from '../contexts/TranslationContext';

const Blogs = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const blogState = useSelector((state) => state.blog.blog);

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  return (
    <>
      <Meta title={t('blogPageTitle')} />
      <BrandCrumb title={t('blog')} />
      <Container class1="blog-wrapper page-wrapper py-5">
        <div className="row">
          <div className="col-12">
            <div className="blog-header text-center mb-5">
              <h2 className="blog-main-title">{t('ourBlog')}</h2>
              <p className="blog-subtitle">
                {t('blogSubtitle')}
              </p>
              <div className="blog-divider"></div>
            </div>
            
            <div className="blog-grid">
              {blogState && blogState.length > 0 ? (
                blogState.map((item, index) => (
                  <BlogCard
                    key={item._id}
                    id={item.slug || item._id}
                    title={item.title}
                    description={item.description}
                    image={item.images && item.images[0]}
                    date={item.createdAt}
                    category={item.category}
                    featured={index === 0}
                  />
                ))
              ) : (
                <div className="no-blogs-message">
                  <i className="fas fa-blog"></i>
                  <h4>{t('noBlogsMessage')}</h4>
                  <p>{t('noBlogsDescription')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Blogs;
