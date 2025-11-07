import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import SEOEnhancer from '../components/SEOEnhancer';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from '../contexts/TranslationContext';
import { getAllProducts } from '../features/products/productSlice';
import { FaSearch, FaTh, FaList } from 'react-icons/fa';
import './OurStore.css';

const OurStore = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const location = useLocation();
    const productState = useSelector((state) => state?.product?.product);
    
    const [gridView, setGridView] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({});
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Récupérer les paramètres category et search de l'URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');
        
        if (categoryParam) {
            console.log('🔍 Paramètre URL détecté - category:', categoryParam);
            
            // Ajouter la catégorie aux filtres actifs
            setActiveFilters(prevFilters => ({
                ...prevFilters,
                categories: [parseInt(categoryParam)]
            }));
        }
        
        if (searchParam) {
            console.log('🔍 Paramètre URL détecté - search:', searchParam);
            setSearchTerm(searchParam);
        }
    }, [location.search]);

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    const handleFilterChange = (newFilters) => {
        setActiveFilters(newFilters);
    };

    // Fonction pour gérer les changements dans la barre de recherche
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        
        if (value.length >= 2 && productState && Array.isArray(productState) && productState.length > 0) {
            console.log('🔍 OurStore: Recherche pour:', value);
            console.log('📦 Produits disponibles:', productState.length);
            
            // Filtrer UNIQUEMENT par titre de produit
            const matchingProducts = productState
                .filter(product => 
                    product.title?.toLowerCase().includes(value.toLowerCase())
                )
                .map(product => ({
                    title: product.title,
                    slug: product.slug || product.id
                }))
                .slice(0, 8); // Maximum 8 suggestions
            
            console.log('✅ Produits trouvés:', matchingProducts.length);
            
            // Éliminer les doublons avec Map
            const uniqueSuggestions = Array.from(
                new Map(matchingProducts.map(item => [item.title, item])).values()
            );
            
            setSuggestions(uniqueSuggestions);
            setShowSuggestions(uniqueSuggestions.length > 0);
        } else {
            if (value.length >= 2) {
                console.log('⚠️ OurStore: Produits non disponibles', {
                    productState: productState,
                    isArray: Array.isArray(productState),
                    length: productState?.length
                });
            }
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Fonction pour gérer le clic sur une suggestion
    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.title);
        setShowSuggestions(false);
    };

    const applyFilters = (products, filters) => {
        let filtered = [...products];

        if (searchTerm) {
            filtered = filtered.filter(p => 
                p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.brand?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filters.minPrice) {
            filtered = filtered.filter(p => parseFloat(p.price) >= parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
            filtered = filtered.filter(p => parseFloat(p.price) <= parseFloat(filters.maxPrice));
        }

        if (filters.brands && filters.brands.length > 0) {
            filtered = filtered.filter(p => filters.brands.includes(p.brand));
        }

        if (filters.categories && filters.categories.length > 0) {
            filtered = filtered.filter(p => {
                // Convertir en string pour comparaison fiable
                const productCategory = p.category ? p.category.toString() : '';
                const productSubcategory = p.subcategory ? p.subcategory.toString() : '';
                
                // Vérifier catégorie principale OU sous-catégorie
                return filters.categories.some(catId => {
                    const catIdStr = catId ? catId.toString() : '';
                    return productCategory === catIdStr || productSubcategory === catIdStr;
                });
            });
        }

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

        // Filtrer par statut (tags)
        if (filters.tags && filters.tags.length > 0) {
            filtered = filtered.filter(p => {
                let productTags = p.tags;
                
                // Si tags est vide, null ou undefined
                if (!productTags || productTags === 'null' || productTags === '' || productTags === '[]' || productTags === '""') {
                    return false;
                }
                
                // Si c'est déjà un tableau
                if (Array.isArray(productTags)) {
                    return filters.tags.some(tag => productTags.includes(tag));
                }
                
                // Si c'est une chaîne
                if (typeof productTags === 'string') {
                    // Essayer de parser comme JSON
                    if (productTags.startsWith('[') || productTags.startsWith('{')) {
                        try {
                            const parsed = JSON.parse(productTags);
                            if (Array.isArray(parsed)) {
                                return filters.tags.some(tag => parsed.includes(tag));
                            }
                        } catch (e) {
                            // Continue avec la logique de chaîne simple
                        }
                    }
                    
                    // Si c'est une chaîne simple, vérifier les correspondances
                    const tagMap = {
                        'promo': 'promotion',
                        'promotion': 'promotion',
                        'new': 'new',
                        'nouveau': 'new',
                        'bestseller': 'bestseller',
                        'best-seller': 'bestseller',
                        'featured': 'featured',
                        'vedette': 'featured'
                    };
                    
                    const normalizedTag = productTags.toLowerCase().replace(/['"]/g, '').trim();
                    const mappedTag = tagMap[normalizedTag];
                    
                    return filters.tags.includes(mappedTag);
                }
                
                return false;
            });
        }

        // Suppression du filtre par taille

        if (filters.rating) {
            if (filters.rating === 'none') {
                filtered = filtered.filter(p => !p.totalrating || parseFloat(p.totalrating) === 0);
            } else {
                filtered = filtered.filter(p => parseFloat(p.totalrating || 0) >= filters.rating);
            }
        }

        if (filters.inStock) {
            filtered = filtered.filter(p => p.quantity > 0);
        }

        if (filters.onSale) {
            filtered = filtered.filter(p => p.tags && p.tags.includes('sale'));
        }

        return filtered;
    };

    const filteredProducts = applyFilters(productState || [], activeFilters);

    return (
        <>
            <SEOEnhancer 
                title={t('storePageTitle')}
                description={t('storePageDescription')}
                keywords={t('storePageKeywords')}
                pageType="product-list"
            />
            <Meta title={t('ourStore')} />
            <BrandCrumb title={t('ourStore')} />
            <div className="store-wrapper py-5">
                <div className="container-xxl">
                    <div className="store-header mb-4">
                        <div className="row align-items-center">
                            <div className="col-lg-6">
                                <div className="search-wrapper">
                                    <div className="search-input-container">
                                        <FaSearch className="search-icon" />
                                        <input
                                            type="text"
                                            placeholder={t('searchProducts') || 'Rechercher des produits...'}
                                            className="search-input"
                                            value={searchTerm}
                                            onChange={handleSearchChange}
                                            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                        />
                                        {showSuggestions && suggestions.length > 0 && (
                                            <div className="search-suggestions">
                                                {suggestions.map((suggestion, index) => (
                                                    <div
                                                        key={index}
                                                        className="suggestion-item"
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                    >
                                                        <FaSearch className="suggestion-icon" />
                                                        <span className="suggestion-title">{suggestion.title}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <div className="store-controls">
                                    <div className="view-toggle">
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
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-3">
                            <ProductFilters 
                                onFilterChange={handleFilterChange}
                                activeFilters={activeFilters}
                            />
                        </div>

                        <div className="col-lg-9">
                            <div className="sort-bar mb-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="results-count">
                                        {filteredProducts.length} {t('productsFound') || 'produits trouvés'}
                                    </span>
                                </div>
                            </div>

                            <div className="products-grid">
                                {gridView ? (
                                    <div className="row g-4">
                                        {filteredProducts && filteredProducts.map((item, index) => (
                                            <div className="col-lg-4 col-md-6 col-sm-6" key={index}>
                                                <ProductCard data={item} gridView={true} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="row">
                                        {filteredProducts && filteredProducts.map((item, index) => (
                                            <div className="col-12 mb-3" key={index}>
                                                <ProductCard data={item} gridView={false} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {filteredProducts.length === 0 && (
                                    <div className="no-products">
                                        <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.3 }}>🔍</div>
                                        <h4>{t('noProductsFound') || 'Aucun produit trouvé'}</h4>
                                        <p>{t('tryModifyingSearch') || 'Essayez de modifier vos critères'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OurStore;
