import React, { useEffect, useState } from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import SEOEnhancer from '../components/SEOEnhancer';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from '../contexts/TranslationContext';
import { getAllProducts } from '../features/products/productSlice';
import { FaSearch, FaTh, FaList, FaSort } from 'react-icons/fa';
import './OurStore.css';

const OurStore = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const productState = useSelector((state) => state?.product?.product);
    
    const [gridView, setGridView] = useState(true);
    const [sort, setSort] = useState('-createdAt');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState({});

    useEffect(() => {
        dispatch(getAllProducts());
    }, [dispatch]);

    const handleFilterChange = (newFilters) => {
        setActiveFilters(newFilters);
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
            filtered = filtered.filter(p => filters.categories.includes(p.category));
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

        if (filters.sizes && filters.sizes.length > 0) {
            filtered = filtered.filter(p => {
                let productSizes = p.size || p.sizes;
                if (typeof productSizes === 'string') {
                    try {
                        productSizes = JSON.parse(productSizes);
                    } catch (e) {
                        return false;
                    }
                }
                if (Array.isArray(productSizes)) {
                    return productSizes.some(s => filters.sizes.includes(s));
                }
                return false;
            });
        }

        if (filters.rating) {
            filtered = filtered.filter(p => parseFloat(p.totalrating || 0) >= filters.rating);
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
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
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
                                    <div className="sort-dropdown">
                                        <FaSort style={{ marginRight: '8px', color: '#6c757d' }} />
                                        <select 
                                            value={sort} 
                                            onChange={(e) => setSort(e.target.value)}
                                            className="sort-select"
                                        >
                                            <option value="-createdAt">{t('newest') || 'Plus récents'}</option>
                                            <option value="createdAt">{t('oldest') || 'Plus anciens'}</option>
                                            <option value="title">{t('alphabeticalAZ') || 'A-Z'}</option>
                                            <option value="-title">{t('alphabeticalZA') || 'Z-A'}</option>
                                            <option value="price">{t('priceAscending') || 'Prix croissant'}</option>
                                            <option value="-price">{t('priceDescending') || 'Prix décroissant'}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="products-grid">
                                {gridView ? (
                                    <div className="row g-4">
                                        {filteredProducts && filteredProducts.map((item, index) => (
                                            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6" key={index}>
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
