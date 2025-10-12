import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoryService from '../services/categoryService';
import './CategoriesGrid.css';

const CategoriesGrid = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const data = await categoryService.getCategoriesWithSubcategories();
                setCategories(data);
            } catch (error) {
                console.error('❌ Erreur chargement catégories:', error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    if (loading) {
        return (
            <div className="categories-grid-loading">
                <div className="spinner"></div>
                <p>Chargement des catégories...</p>
            </div>
        );
    }

    return (
        <section className="categories-grid-section">
            <div className="container-xxl">
                <div className="categories-grid-header">
                    <h2>Explorez nos catégories</h2>
                    <p>Découvrez notre large gamme de produits</p>
                </div>

                <div className="categories-grid-container">
                    {categories.map((category) => (
                        <Link
                            key={category._id || category.id}
                            to={`/category/${category.id}`}
                            className="category-card"
                        >
                            <div className="category-icon-wrapper">
                                <i className={categoryService.getCategoryIcon(category.title)}></i>
                            </div>
                            <div className="category-info">
                                <h3>{category.title}</h3>
                                {category.subcategories && category.subcategories.length > 0 && (
                                    <span className="category-count">
                                        {category.subcategories.length} sous-catégories
                                    </span>
                                )}
                            </div>
                            <div className="category-arrow">
                                <i className="fas fa-arrow-right"></i>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoriesGrid;
