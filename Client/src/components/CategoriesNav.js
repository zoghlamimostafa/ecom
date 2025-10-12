import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategories } from '../features/category/categorySlice';
import './CategoriesNav.css';

const CategoriesNav = () => {
    const dispatch = useDispatch();
    const categoryState = useSelector((state) => state?.category?.categories);

    useEffect(() => {
        dispatch(getAllCategories());
    }, [dispatch]);

    // Filtrer seulement les catégories principales (level 0)
    const mainCategories = categoryState?.filter(cat => cat.level === 0 || cat.parentId === null) || [];

    // Trier par sortOrder
    const sortedCategories = mainCategories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    return (
        <div className="categories-nav">
            <div className="categories-nav-container">
                <h3 className="categories-nav-title">
                    <span>📦</span> Catégories
                </h3>
                <div className="categories-nav-grid">
                    {sortedCategories.map((category) => (
                        <Link
                            key={category._id || category.id}
                            to={`/categorie/${category.slug}`}
                            className="category-nav-item"
                        >
                            {category.icon && (
                                <span className="category-icon">{category.icon}</span>
                            )}
                            <span className="category-name">{category.title}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoriesNav;
