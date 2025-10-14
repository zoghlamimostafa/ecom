import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaTimes } from 'react-icons/fa';
import categoryService from '../services/categoryService';
import './CategoriesDropdown.css';

const CategoriesDropdown = ({ isOpen, onClose }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [hoveredSubcategory, setHoveredSubcategory] = useState(null);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                console.log('🔄 Chargement des catégories...');
                const data = await categoryService.getCategoriesWithSubcategories();
                console.log('✅ Catégories chargées:', data.length);
                console.log('📋 Titres:', data.map(c => c.title).join(', '));
                setCategories(data);
            } catch (error) {
                console.error('❌ Erreur:', error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            loadCategories();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay pour fermer en cliquant à l'extérieur */}
            <div className="categories-overlay" onClick={onClose}></div>
            
            {/* Menu principal */}
            <div className="categories-dropdown-container">
                <div className="categories-dropdown-header">
                    <h3>Toutes les catégories</h3>
                    <button className="close-btn" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                {loading ? (
                    <div className="categories-loading">
                        <div className="spinner"></div>
                        <p>Chargement des catégories...</p>
                    </div>
                ) : categories.length === 0 ? (
                    <div className="categories-empty">
                        <p>Aucune catégorie disponible</p>
                    </div>
                ) : (
                    <div className="categories-content">
                        {/* Colonne des catégories principales */}
                        <div className="main-categories-column">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className={`main-category-item ${hoveredCategory === category.id ? 'active' : ''}`}
                                    onMouseEnter={() => setHoveredCategory(category.id)}
                                >
                                    <Link
                                        to={`/product-category/${category.slug}`}
                                        className="category-link"
                                        onClick={onClose}
                                    >
                                        <i className={category.icon}></i>
                                        <span>{category.title}</span>
                                    </Link>
                                    {category.subcategories && category.subcategories.length > 0 && (
                                        <FaChevronRight className="arrow-icon" />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Colonne des sous-catégories (niveau 1) */}
                        {hoveredCategory && (
                            <div className="subcategories-column">
                                {categories
                                    .find(cat => cat.id === hoveredCategory)
                                    ?.subcategories?.map((subcategory) => (
                                        <div
                                            key={subcategory.id}
                                            className={`subcategory-item ${hoveredSubcategory === subcategory.id ? 'active' : ''}`}
                                            onMouseEnter={() => setHoveredSubcategory(subcategory.id)}
                                        >
                                            <Link
                                                to={`/product-category/${subcategory.slug}`}
                                                className="subcategory-link"
                                                onClick={onClose}
                                            >
                                                <i className={subcategory.icon}></i>
                                                <span>{subcategory.title}</span>
                                            </Link>
                                            {subcategory.subcategories && subcategory.subcategories.length > 0 && (
                                                <FaChevronRight className="arrow-icon" />
                                            )}
                                        </div>
                                    ))}
                            </div>
                        )}

                        {/* Colonne des sous-sous-catégories (niveau 2) */}
                        {hoveredCategory && hoveredSubcategory && (
                            <div className="sub-subcategories-column">
                                {categories
                                    .find(cat => cat.id === hoveredCategory)
                                    ?.subcategories?.find(sub => sub.id === hoveredSubcategory)
                                    ?.subcategories?.map((subSubcategory) => (
                                        <div
                                            key={subSubcategory.id}
                                            className="sub-subcategory-item"
                                        >
                                            <Link
                                                to={`/product-category/${subSubcategory.slug}`}
                                                className="sub-subcategory-link"
                                                onClick={onClose}
                                            >
                                                <i className={subSubcategory.icon}></i>
                                                <span>{subSubcategory.title}</span>
                                            </Link>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default CategoriesDropdown;
