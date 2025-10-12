import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta';
import categoryService from '../services/categoryService';
import '../styles/CategoryDetailPage.css';

const CategoryDetailPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategory = async () => {
      try {
        setLoading(true);
        // Charger toutes les catégories
        const categories = await categoryService.getCategoriesWithSubcategories();
        setAllCategories(categories);
        
        // Trouver la catégorie actuelle
        const currentCat = categories.find(cat => cat.id === parseInt(categoryId));
        setCategory(currentCat);
      } catch (error) {
        console.error('Erreur chargement catégorie:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="category-detail-loading">
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="category-detail-error">
        <h2>Catégorie non trouvée</h2>
        <Link to="/categories" className="back-link">← Retour aux catégories</Link>
      </div>
    );
  }

  return (
    <>
      <Meta title={category.title} />
      <BreadCrumb title={category.title} />
      
      <div className="category-detail-container">
        <div className="container-xxl">
          {/* En-tête de la catégorie */}
          <div className="category-header">
            <div className="category-icon-large">
              <i className={categoryService.getCategoryIcon(category.title)}></i>
            </div>
            <div className="category-info">
              <h1>{category.title}</h1>
              {category.description && <p className="category-description">{category.description}</p>}
              <div className="category-stats">
                <span className="stat-item">
                  <i className="fas fa-layer-group"></i>
                  {category.subcategories?.length || 0} sous-catégories
                </span>
              </div>
            </div>
          </div>

          {/* Liste des sous-catégories */}
          {category.subcategories && category.subcategories.length > 0 ? (
            <div className="subcategories-section">
              <h2 className="section-title">Sous-catégories</h2>
              <div className="subcategories-grid-detail">
                {category.subcategories.map((subcat) => (
                  <div key={subcat.id} className="subcategory-card">
                    <Link to={`/product?category=${subcat.id}`} className="subcategory-link">
                      <div className="subcategory-card-header">
                        <div className="subcategory-icon">
                          <i className={categoryService.getCategoryIcon(subcat.title)}></i>
                        </div>
                        <h3>{subcat.title}</h3>
                      </div>
                      
                      {/* Sous-sous-catégories */}
                      {subcat.subcategories && subcat.subcategories.length > 0 && (
                        <div className="sub-subcategories-list-detail">
                          <div className="sub-subcategories-header">
                            <i className="fas fa-list"></i>
                            <span>{subcat.subcategories.length} options</span>
                          </div>
                          <ul>
                            {subcat.subcategories.slice(0, 5).map((subsubcat) => (
                              <li key={subsubcat.id}>
                                <Link to={`/product?category=${subsubcat.id}`}>
                                  {subsubcat.title}
                                </Link>
                              </li>
                            ))}
                            {subcat.subcategories.length > 5 && (
                              <li className="more-items">
                                + {subcat.subcategories.length - 5} autres
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                      
                      <div className="subcategory-arrow">
                        <i className="fas fa-arrow-right"></i>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="no-subcategories">
              <i className="fas fa-inbox"></i>
              <p>Aucune sous-catégorie disponible</p>
              <Link to={`/product?category=${category.id}`} className="view-products-btn">
                Voir les produits
              </Link>
            </div>
          )}

          {/* Voir tous les produits */}
          <div className="view-all-section">
            <Link to={`/product?category=${category.id}`} className="view-all-products-btn">
              <i className="fas fa-shopping-bag"></i>
              Voir tous les produits de {category.title}
            </Link>
          </div>

          {/* Catégories connexes */}
          {allCategories.length > 1 && (
            <div className="related-categories-section">
              <h2 className="section-title">Autres catégories</h2>
              <div className="related-categories-grid">
                {allCategories
                  .filter(cat => cat.id !== category.id)
                  .slice(0, 6)
                  .map((cat) => (
                    <Link 
                      key={cat.id} 
                      to={`/category/${cat.id}`}
                      className="related-category-card"
                    >
                      <i className={categoryService.getCategoryIcon(cat.title)}></i>
                      <span>{cat.title}</span>
                      <small>{cat.subcategories?.length || 0} sous-catégories</small>
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoryDetailPage;
