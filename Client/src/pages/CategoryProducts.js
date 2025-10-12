import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../features/products/productSlice';
import { getAllCategories } from '../features/category/categorySlice';
import ProductCard from '../components/ProductCard';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta';
import Container from '../components/Container';
import './ProductCategory.css';
import { useTranslation } from '../contexts/TranslationContext';

const CategoryProducts = () => {
    const { categorySlug } = useParams();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    const productState = useSelector((state) => state?.product?.products);
    const categoryState = useSelector((state) => state?.category?.categories);

    useEffect(() => {
        dispatch(getAllProducts());
        dispatch(getAllCategories());
    }, [dispatch]);

    useEffect(() => {
        if (categoryState && categoryState.length > 0 && categorySlug) {
            // Trouver la catégorie par slug
            const category = categoryState.find(cat => cat.slug === categorySlug);
            
            if (category) {
                setCategoryInfo(category);
                
                // Filtrer les produits par catégorie
                if (productState && productState.length > 0) {
                    const products = productState.filter(product => {
                        // Vérifier si le produit appartient à cette catégorie (ID ou title)
                        const productCategory = product.category;
                        
                        if (typeof productCategory === 'string') {
                            // Comparer par nom ou ID de catégorie
                            return productCategory === category.title || 
                                   productCategory === category._id || 
                                   productCategory === category.id;
                        } else if (typeof productCategory === 'object' && productCategory !== null) {
                            // Si c'est un objet, comparer l'ID
                            return productCategory._id === category._id || 
                                   productCategory.id === category.id ||
                                   productCategory.title === category.title;
                        }
                        return false;
                    });
                    
                    setFilteredProducts(products);
                    setLoading(false);
                }
            } else {
                // Catégorie non trouvée, rediriger vers toutes les catégories
                console.log(`Catégorie "${categorySlug}" non trouvée`);
                setLoading(false);
            }
        }
    }, [categoryState, productState, categorySlug]);

    if (loading) {
        return (
            <Container class1="home-wrapper-2 py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="mt-3">{t('loading') || 'Chargement des produits...'}</p>
                </div>
            </Container>
        );
    }

    if (!categoryInfo) {
        return (
            <Container class1="home-wrapper-2 py-5">
                <div className="text-center">
                    <h2>{t('categoryNotFound') || 'Catégorie non trouvée'}</h2>
                    <p>{t('categoryNotFoundDesc') || 'La catégorie demandée n\'existe pas.'}</p>
                    <button 
                        className="btn btn-primary mt-3"
                        onClick={() => navigate('/categories')}
                    >
                        {t('viewAllCategories') || 'Voir toutes les catégories'}
                    </button>
                </div>
            </Container>
        );
    }

    return (
        <>
            <Meta title={categoryInfo.title || 'Produits'} />
            <BreadCrumb title={categoryInfo.title || 'Catégorie'} />
            
            <Container class1="store-wrapper home-wrapper-2 py-5">
                <div className="new-informatique-container">
                    {/* En-tête de la catégorie */}
                    <div className="text-center mb-4">
                        {categoryInfo.icon && (
                            <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>
                                {categoryInfo.icon}
                            </span>
                        )}
                        <h1 className="page-title">{categoryInfo.title}</h1>
                        {categoryInfo.description && (
                            <p className="category-description text-muted">
                                {categoryInfo.description}
                            </p>
                        )}
                        <p className="product-count">
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'produit' : 'produits'}
                        </p>
                    </div>

                    {/* Grille de produits */}
                    {filteredProducts.length > 0 ? (
                        <div className="new-informatique-grid">
                            {filteredProducts.map((product, index) => (
                                <div key={product._id || index} className="new-informatique-card">
                                    <ProductCard data={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <div className="no-products-message">
                                <svg 
                                    width="100" 
                                    height="100" 
                                    viewBox="0 0 100 100" 
                                    fill="none" 
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ margin: '0 auto 2rem', opacity: 0.3 }}
                                >
                                    <circle cx="50" cy="50" r="40" stroke="#ddd" strokeWidth="2"/>
                                    <path d="M30 50 L70 50 M50 30 L50 70" stroke="#ddd" strokeWidth="2"/>
                                </svg>
                                <h3>{t('noProductsInCategory') || 'Aucun produit dans cette catégorie'}</h3>
                                <p className="text-muted">
                                    {t('noProductsDesc') || 'Les produits seront bientôt disponibles.'}
                                </p>
                                <button 
                                    className="btn btn-primary mt-3"
                                    onClick={() => navigate('/product')}
                                >
                                    {t('viewAllProducts') || 'Voir tous les produits'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </>
    );
};

export default CategoryProducts;
