import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../features/products/productSlice';
import { getAllCategories } from '../features/category/categorySlice';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta';
import Container from '../components/Container';
import './ProductCategory.css';
import { useTranslation } from '../contexts/TranslationContext';
import { FaFilter, FaTh, FaList } from 'react-icons/fa';

const CategoryProducts = () => {
    const { categorySlug } = useParams();
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const [gridView, setGridView] = useState(true);

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
                    let products = productState.filter(product => {
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

                    // Appliquer les filtres supplémentaires
                    products = applyFilters(products, activeFilters);
                    
                    setFilteredProducts(products);
                    setLoading(false);
                }
            } else {
                // Catégorie non trouvée, rediriger vers toutes les catégories
                console.log(`Catégorie "${categorySlug}" non trouvée`);
                setLoading(false);
            }
        }
    }, [categoryState, productState, categorySlug, activeFilters]);

    const applyFilters = (products, filters) => {
        let filtered = [...products];

        // Filtre de prix
        if (filters.minPrice) {
            filtered = filtered.filter(p => parseFloat(p.price) >= parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
            filtered = filtered.filter(p => parseFloat(p.price) <= parseFloat(filters.maxPrice));
        }

        // Filtre de marque
        if (filters.brands && filters.brands.length > 0) {
            filtered = filtered.filter(p => filters.brands.includes(p.brand));
        }

        // Filtre de couleur
        if (filters.colors && filters.colors.length > 0) {
            filtered = filtered.filter(p => {
                let productColors = p.color;
                if (typeof productColors === 'string' && productColors !== 'null' && productColors !== '') {
                    try {
                        productColors = JSON.parse(productColors);
                    } catch (e) {
                        return false;
                    }
                }
                if (Array.isArray(productColors)) {
                    return productColors.some(c => filters.colors.includes(c?.title || c));
                }
                return false;
            });
        }

        return filtered;
    };

    const handleFilterChange = (newFilters) => {
        setActiveFilters(newFilters);
    };

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
                <div className="container-xxl">
                    {/* En-tête de la catégorie */}
                    <div className="category-header mb-4">
                        <div className="text-center">
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
                        </div>

                        {/* Barre de contrôles */}
                        <div className="controls-bar">
                            <button 
                                className="filter-toggle-btn d-lg-none"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <FaFilter /> Filtres
                            </button>
                            <div className="results-info">
                                <span className="product-count">
                                    {filteredProducts.length} {filteredProducts.length === 1 ? 'produit' : 'produits'}
                                </span>
                            </div>
                            <div className="view-toggles">
                                <button 
                                    className={`view-btn ${gridView ? 'active' : ''}`}
                                    onClick={() => setGridView(true)}
                                >
                                    <FaTh />
                                </button>
                                <button 
                                    className={`view-btn ${!gridView ? 'active' : ''}`}
                                    onClick={() => setGridView(false)}
                                >
                                    <FaList />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {/* Sidebar Filtres */}
                        <div className="col-lg-3">
                            <ProductFilters 
                                onFilterChange={handleFilterChange}
                                activeFilters={activeFilters}
                            />
                        </div>

                        {/* Grille de produits */}
                        <div className="col-lg-9">
                            {filteredProducts.length > 0 ? (
                                <div className="row">
                                    {filteredProducts.map((product, index) => (
                                        <div className="col-lg-4 col-md-6 col-sm-6 mb-4" key={product._id || index}>
                                            <ProductCard data={product} gridView={true} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-5">
                                    <div className="no-products-message">
                                        <div style={{ fontSize: '4rem', opacity: 0.3 }}>📦</div>
                                        <h3>{t('noProductsInCategory') || 'Aucun produit trouvé'}</h3>
                                        <p className="text-muted">
                                            {t('noProductsDesc') || 'Essayez de modifier vos filtres.'}
                                        </p>
                                        <button 
                                            className="btn btn-primary mt-3"
                                            onClick={() => {
                                                setActiveFilters({});
                                                navigate('/product');
                                            }}
                                        >
                                            {t('viewAllProducts') || 'Voir tous les produits'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default CategoryProducts;
