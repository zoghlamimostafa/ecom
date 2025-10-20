import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '../contexts/TranslationContext';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../features/products/productSlice';
import categoryService from '../services/categoryService';

const CategoryPage = () => {
  const { t } = useTranslation();
  const { slug } = useParams();
  const dispatch = useDispatch();
  const productState = useSelector((state) => state?.product?.product);
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        
        // Récupérer toutes les catégories depuis l'API
        const allCategories = await categoryService.getCategoriesWithSubcategories();
        
        // Trouver la catégorie par slug
        let foundCategory = null;
        for (const cat of allCategories) {
          if (cat.slug === slug) {
            foundCategory = cat;
            break;
          }
          // Chercher dans les sous-catégories
          if (cat.subcategories) {
            const subCat = cat.subcategories.find(sub => sub.slug === slug);
            if (subCat) {
              foundCategory = subCat;
              break;
            }
          }
        }
        
        if (foundCategory) {
          setCategory(foundCategory);
          
          // Si c'est une catégorie principale, récupérer ses sous-catégories
          if (foundCategory.subcategories && foundCategory.subcategories.length > 0) {
            setSubcategories(foundCategory.subcategories);
          }
        }
        
        // Récupérer tous les produits
        dispatch(getAllProducts());
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug, dispatch]);

  useEffect(() => {
    if (productState && category) {
      // Récupérer tous les IDs de catégories à filtrer (catégorie + sous-catégories)
      const categoryIdsToFilter = [category.id];
      if (subcategories && subcategories.length > 0) {
        categoryIdsToFilter.push(...subcategories.map(sub => sub.id));
      }
      
      console.log('🔍 Filtrage CategoryPage:', {
        categoryId: category.id,
        categoryTitle: category.title,
        subcategoriesCount: subcategories?.length || 0,
        allIdsToFilter: categoryIdsToFilter
      });
      
      // Filtrer les produits par catégorie ID ou sous-catégorie ID
      const filtered = productState.filter(product => {
        if (!product.category && !product.subcategory) return false;
        
        // Convertir en string pour comparaison fiable
        const productCategory = product.category ? product.category.toString() : '';
        const productSubcategory = product.subcategory ? product.subcategory.toString() : '';
        
        // Vérifier si le produit appartient à cette catégorie ou ses sous-catégories
        const matchesCategory = categoryIdsToFilter.some(catId => {
          const catIdStr = catId.toString();
          return productCategory === catIdStr || productSubcategory === catIdStr;
        });
        
        if (matchesCategory) {
          console.log(`   ✅ Produit trouvé: [ID: ${product.id}] ${product.title} (cat: ${productCategory}, subcat: ${productSubcategory})`);
        }
        
        return matchesCategory;
      });

      console.log(`   📊 Total produits trouvés: ${filtered.length}`);
      setFilteredProducts(filtered);
    }
  }, [productState, category, subcategories]);

  const getIconClass = (iconName) => {
    return iconName || 'fas fa-folder';
  };

  if (loading) {
    return (
      <div className="category-page-loading">
        <div className="container-xxl">
          <div className="loading-spinner">Chargement...</div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="category-not-found">
        <div className="container-xxl">
          <h2>Catégorie non trouvée</h2>
          <Link to="/" className="back-home-btn">{t('backToHome')}</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Meta title={category.title} />
      <BreadCrumb title={category.title} />
      
      <div className="category-page">
        <div className="container-xxl">
          {/* En-tête de la catégorie */}
          <div className="category-header">
            <div className="category-header-content">
              <div className="category-icon">
                <i className={getIconClass(category.icon)}></i>
              </div>
              <div className="category-info">
                <h1 className="category-title">{category.title}</h1>
                {category.description && (
                  <p className="category-description">{category.description}</p>
                )}
                <div className="category-stats">
                  <span className="product-count">
                    {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sous-catégories (si catégorie principale) */}
          {subcategories.length > 0 && (
            <div className="subcategories-section">
              <h3 className="subcategories-title">Parcourir par sous-catégorie</h3>
              <div className="subcategories-grid">
                {subcategories.map((subcategory) => (
                  <Link
                    key={subcategory.id}
                    to={`/category/${subcategory.slug}`}
                    className="subcategory-card"
                  >
                    <div className="subcategory-icon">
                      <i className={getIconClass(subcategory.icon)}></i>
                    </div>
                    <div className="subcategory-info">
                      <h4 className="subcategory-name">{subcategory.title}</h4>
                      {subcategory.description && (
                        <p className="subcategory-desc">{subcategory.description}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Contrôles d'affichage */}
          <div className="category-controls">
            <div className="category-controls-left">
              <span className="results-count">
                {filteredProducts.length} {t('productsFound') || 'produits trouvés'}
              </span>
            </div>
            
            <div className="category-controls-right">
              <div className="view-controls">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title={t('gridView')}
                >
                  <i className="fas fa-th"></i>
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title={t('listView')}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Liste des produits */}
          <div className="category-products">
            {filteredProducts.length > 0 ? (
              <div className={`products-container ${viewMode}`}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    description={product.description}
                    price={product.price}
                    brand={product.brand}
                    totalrating={product.totalrating}
                    sold={product.sold}
                    quantity={product.quantity}
                    images={product.images}
                    slug={product.slug}
                    wishlist={product.wishlist}
                    className={viewMode === 'list' ? 'list-view' : ''}
                  />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <div className="no-products-content">
                  <i className="fas fa-box-open"></i>
                  <h3>Aucun produit dans cette catégorie</h3>
                  <p>Il n'y a actuellement aucun produit disponible dans cette catégorie.</p>
                  <Link to="/product" className="browse-all-btn">
                    Parcourir tous les produits
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryPage;
