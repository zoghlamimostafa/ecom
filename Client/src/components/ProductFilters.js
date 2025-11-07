import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import './ProductFilters.css';
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ProductFilters = ({ onFilterChange, activeFilters = {}, horizontal = false }) => {
    const [isOpen, setIsOpen] = useState({
        price: true,
        brands: true,
        categories: true,
        colors: true,
    // sizes: true,
        rating: true,
        availability: true,
        discount: true
    });

    const [localFilters, setLocalFilters] = useState({
        minPrice: '',
        maxPrice: '',
        brands: [],
        categories: [],
        colors: [],
    // sizes: [],
        rating: '',
        inStock: false,
        onSale: false
    });

    const productState = useSelector((state) => state?.product?.products);
    const categoryState = useSelector((state) => state?.category?.categories);

    // Extract unique values
    const brands = [...new Set(productState?.map(p => p.brand).filter(Boolean))] || [];
    const colors = [...new Set(productState?.flatMap(p => {
        let colorArray = p.color;
        if (typeof colorArray === 'string' && colorArray !== 'null' && colorArray !== '') {
            try {
                colorArray = JSON.parse(colorArray);
            } catch (e) {
                return [];
            }
        }
        return Array.isArray(colorArray) ? colorArray.map(c => c?.title || c).filter(Boolean) : [];
    }))] || [];
    
    // const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    // ✅ FIX: Utiliser {id, title} au lieu de juste title pour avoir l'ID
    const categories = categoryState?.filter(cat => cat.level === 0).map(cat => ({
        id: cat.id,
        title: cat.title
    })) || [];

    const toggleSection = (section) => {
        setIsOpen(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handlePriceChange = (type, value) => {
        const newFilters = {
            ...localFilters,
            [type]: value
        };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const toggleArrayFilter = (type, value) => {
        const newArray = localFilters[type].includes(value)
            ? localFilters[type].filter(item => item !== value)
            : [...localFilters[type], value];
        
        const newFilters = {
            ...localFilters,
            [type]: newArray
        };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleRatingChange = (value) => {
        const newFilters = {
            ...localFilters,
            rating: localFilters.rating === value ? '' : value
        };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const toggleBooleanFilter = (type) => {
        const newFilters = {
            ...localFilters,
            [type]: !localFilters[type]
        };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearAllFilters = () => {
        const emptyFilters = {
            minPrice: '',
            maxPrice: '',
            brands: [],
            categories: [],
            colors: [],
            sizes: [],
            rating: '',
            inStock: false,
            onSale: false
        };
        setLocalFilters(emptyFilters);
        onFilterChange(emptyFilters);
    };

    const activeFiltersCount = 
        (localFilters.minPrice ? 1 : 0) +
        (localFilters.maxPrice ? 1 : 0) +
        localFilters.brands.length +
        localFilters.categories.length +
        localFilters.colors.length +
    // localFilters.sizes.length +
        (localFilters.rating ? 1 : 0) +
        (localFilters.inStock ? 1 : 0) +
        (localFilters.onSale ? 1 : 0);

    return (
        <div className={`product-filters-sidebar ${horizontal ? 'horizontal-filters' : ''}`}>
            <div className="filters-header">
                <h3 className="filters-title">
                    <FaFilter /> Filtres
                </h3>
                {activeFiltersCount > 0 && (
                    <button className="clear-all-btn" onClick={clearAllFilters}>
                        <FaTimes /> Effacer tout ({activeFiltersCount})
                    </button>
                )}
            </div>

            {/* Prix */}
            <div className="filter-section">
                <button 
                    className="filter-section-header"
                    onClick={() => toggleSection('price')}
                >
                    <span>💰 Prix</span>
                    {isOpen.price ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {isOpen.price && (
                    <div className="filter-content">
                        <div className="price-inputs">
                            <div className="price-input-wrapper">
                                <label className="price-label">Prix Min</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={localFilters.minPrice}
                                    onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                                    className="price-input"
                                />
                            </div>
                            <div className="price-input-wrapper">
                                <label className="price-label">Prix Max</label>
                                <input
                                    type="number"
                                    placeholder="1000"
                                    value={localFilters.maxPrice}
                                    onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                                    className="price-input"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Catégories */}
            {categories.length > 0 && (
                <div className="filter-section">
                    <button 
                        className="filter-section-header"
                        onClick={() => toggleSection('categories')}
                    >
                        <span>📦 Catégories</span>
                        {isOpen.categories ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    {isOpen.categories && (
                        <div className="filter-content">
                            <div className="filter-checkboxes">
                                {categories.slice(0, 8).map((category, index) => (
                                    <label key={category.id || index} className="filter-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={localFilters.categories.includes(category.id)}
                                            onChange={() => toggleArrayFilter('categories', category.id)}
                                        />
                                        <span className="checkbox-text">{category.title}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Marques */}
            {brands.length > 0 && (
                <div className="filter-section">
                    <button 
                        className="filter-section-header"
                        onClick={() => toggleSection('brands')}
                    >
                        <span>🏷️ Marques</span>
                        {isOpen.brands ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    {isOpen.brands && (
                        <div className="filter-content">
                            <div className="filter-checkboxes">
                                {brands.slice(0, 10).map((brand, index) => (
                                    <label key={index} className="filter-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={localFilters.brands.includes(brand)}
                                            onChange={() => toggleArrayFilter('brands', brand)}
                                        />
                                        <span className="checkbox-text">{brand}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Couleurs */}
            {colors.length > 0 && (
                <div className="filter-section">
                    <button 
                        className="filter-section-header"
                        onClick={() => toggleSection('colors')}
                    >
                        <span>🎨 Couleurs</span>
                        {isOpen.colors ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    {isOpen.colors && (
                        <div className="filter-content">
                            <div className="color-chips">
                                {colors.slice(0, 12).map((color, index) => (
                                    <button
                                        key={index}
                                        className={`color-chip ${localFilters.colors.includes(color) ? 'active' : ''}`}
                                        onClick={() => toggleArrayFilter('colors', color)}
                                        title={color}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Taille supprimée */}

            {/* Note moyenne */}
            <div className="filter-section">
                <button 
                    className="filter-section-header"
                    onClick={() => toggleSection('rating')}
                >
                    <span>⭐ Note minimum</span>
                    {isOpen.rating ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {isOpen.rating && (
                    <div className="filter-content">
                        <div className="rating-options">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <label key={star} className="filter-checkbox-label">
                                    <input
                                        type="radio"
                                        name="rating"
                                        checked={localFilters.rating === star}
                                        onChange={() => handleRatingChange(star)}
                                    />
                                    <span className="checkbox-text">
                                        {'⭐'.repeat(star)} {star} étoiles et +
                                    </span>
                                </label>
                            ))}
                            <label className="filter-checkbox-label">
                                <input
                                    type="radio"
                                    name="rating"
                                    checked={localFilters.rating === 'none'}
                                    onChange={() => handleRatingChange('none')}
                                />
                                <span className="checkbox-text">Pas de note encore</span>
                            </label>
                        </div>
                    </div>
                )}
            </div>

            {/* Disponibilité */}
            <div className="filter-section">
                <button 
                    className="filter-section-header"
                    onClick={() => toggleSection('availability')}
                >
                    <span>📦 Disponibilité</span>
                    {isOpen.availability ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {isOpen.availability && (
                    <div className="filter-content">
                        <label className="filter-checkbox-label">
                            <input
                                type="checkbox"
                                checked={localFilters.inStock}
                                onChange={() => toggleBooleanFilter('inStock')}
                            />
                            <span className="checkbox-text">✅ En stock uniquement</span>
                        </label>
                    </div>
                )}
            </div>

            {/* Promotions */}
            <div className="filter-section">
                <button 
                    className="filter-section-header"
                    onClick={() => toggleSection('discount')}
                >
                    <span>🔥 Promotions</span>
                    {isOpen.discount ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                {isOpen.discount && (
                    <div className="filter-content">
                        <label className="filter-checkbox-label">
                            <input
                                type="checkbox"
                                checked={localFilters.onSale}
                                onChange={() => toggleBooleanFilter('onSale')}
                            />
                            <span className="checkbox-text">💰 En promotion uniquement</span>
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductFilters;
