import React, { useEffect, useState } from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import BlogCard from '../components/BlogCard';
import Container from '../components/Container';
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import { useTranslation } from '../contexts/TranslationContext';
import './Blogs.css';

const Blogs = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const blogState = useSelector((state) => state.blog.blog);
  
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categories, setCategories] = useState([
    { id: 'all', name: 'Tous les articles', icon: 'fas fa-th' }
  ]);

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  // Créer les catégories dynamiquement depuis les blogs
  useEffect(() => {
    if (blogState && Array.isArray(blogState) && blogState.length > 0) {
      console.log('📰 Blogs reçus:', blogState);
      
      // Extraire les catégories uniques
      const uniqueCategories = [...new Set(
        blogState
          .map(blog => blog.category)
          .filter(cat => cat && cat.trim() !== '')
      )];

      console.log('📁 Catégories uniques:', uniqueCategories);

      // Mapper les catégories avec des icônes
      const categoryIcons = {
        'nouveautes': 'fas fa-star',
        'nouveautés': 'fas fa-star',
        'tendances': 'fas fa-fire',
        'guides': 'fas fa-book',
        'guide': 'fas fa-book',
        'conseils': 'fas fa-lightbulb',
        'actualites': 'fas fa-newspaper',
        'actualités': 'fas fa-newspaper',
        'mode': 'fas fa-tshirt',
        'tech': 'fas fa-laptop',
        'technologie': 'fas fa-laptop',
        'sport': 'fas fa-running',
        'maison': 'fas fa-home',
        'animaux': 'fas fa-paw',
        'cuisine': 'fas fa-utensils',
        'voyage': 'fas fa-plane',
      };

      const dynamicCategories = uniqueCategories.map(cat => ({
        id: cat.toLowerCase(),
        name: cat.charAt(0).toUpperCase() + cat.slice(1),
        icon: categoryIcons[cat.toLowerCase()] || 'fas fa-tag'
      }));

      setCategories([
        { id: 'all', name: 'Tous les articles', icon: 'fas fa-th' },
        ...dynamicCategories
      ]);
    }
  }, [blogState]);

  // Filtrer les articles selon la catégorie sélectionnée
  useEffect(() => {
    if (blogState && Array.isArray(blogState) && blogState.length > 0) {
      if (selectedCategory === 'all') {
        setFilteredBlogs(blogState);
        console.log('✅ Affichage de tous les blogs:', blogState.length);
      } else {
        const filtered = blogState.filter(
          blog => blog.category?.toLowerCase() === selectedCategory.toLowerCase()
        );
        setFilteredBlogs(filtered);
        console.log(`✅ Blogs filtrés (${selectedCategory}):`, filtered.length);
      }
    } else {
      setFilteredBlogs([]);
      console.log('⚠️ Aucun blog disponible');
    }
  }, [blogState, selectedCategory]);

  // Séparer l'article vedette du reste
  const featuredBlog = filteredBlogs.length > 0 ? filteredBlogs[0] : null;
  const regularBlogs = filteredBlogs.length > 1 ? filteredBlogs.slice(1) : [];
  const recommendedBlogs = regularBlogs.slice(0, 3);

  return (
    <>
      <Meta title={t('blogPageTitle') || 'Blog - Sanny Store'} />
      <BrandCrumb title={t('blog') || 'Blog'} />
      <Container class1="blog-wrapper page-wrapper py-5">
        <div className="row">
          <div className="col-12">
            {/* Header */}
            <div className="blog-header text-center mb-5">
              <h2 className="blog-main-title">
                {t('ourBlog') || 'Notre Blog'}
              </h2>
              <p className="blog-subtitle">
                {t('blogSubtitle') || 'Découvrez nos derniers articles, conseils et tendances pour vous inspirer'}
              </p>
              <div className="blog-divider"></div>
            </div>

            {/* Filtres de Catégories */}
            <div className="blog-categories">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <i className={cat.icon}></i>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Stats Bar */}
            {filteredBlogs.length > 0 && (
              <div className="blog-stats-bar">
                <div className="blog-count">
                  <i className="fas fa-file-alt"></i>
                  {filteredBlogs.length} {filteredBlogs.length > 1 ? 'articles trouvés' : 'article trouvé'}
                </div>
                <div className="blog-count">
                  <i className="fas fa-filter"></i>
                  Catégorie: {categories.find(c => c.id === selectedCategory)?.name}
                </div>
              </div>
            )}

            {/* Article Vedette + Grille d'Articles */}
            {filteredBlogs.length > 0 ? (
              <>
                <div className="blog-grid">
                  {/* Article Vedette */}
                  {featuredBlog && (
                    <BlogCard
                      key={featuredBlog.id}
                      id={featuredBlog.slug || featuredBlog.id}
                      title={featuredBlog.title}
                      description={featuredBlog.description}
                      image={featuredBlog.images && featuredBlog.images[0]}
                      date={featuredBlog.createdAt}
                      category={featuredBlog.category}
                      featured={true}
                    />
                  )}

                  {/* Articles Normaux */}
                  {regularBlogs.map((item) => (
                    <BlogCard
                      key={item.id}
                      id={item.slug || item.id}
                      title={item.title}
                      description={item.description}
                      image={item.images && item.images[0]}
                      date={item.createdAt}
                      category={item.category}
                      featured={false}
                    />
                  ))}
                </div>

                {/* Section Articles Recommandés */}
                {recommendedBlogs.length > 0 && (
                  <div className="recommended-section">
                    <div className="recommended-header">
                      <h3 className="recommended-title">
                        <i className="fas fa-star"></i> Articles Recommandés
                      </h3>
                      <p className="recommended-subtitle">
                        D'autres contenus qui pourraient vous intéresser
                      </p>
                    </div>
                    <div className="blog-grid">
                      {recommendedBlogs.map((item) => (
                        <BlogCard
                          key={item.id}
                          id={item.slug || item.id}
                          title={item.title}
                          description={item.description}
                          image={item.images && item.images[0]}
                          date={item.createdAt}
                          category={item.category}
                          featured={false}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="no-blogs-message">
                <i className="fas fa-search"></i>
                <h4>{t('noBlogsMessage') || 'Aucun article trouvé'}</h4>
                <p>{t('noBlogsDescription') || 'Essayez de sélectionner une autre catégorie'}</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default Blogs;
