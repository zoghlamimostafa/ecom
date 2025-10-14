import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import categoryService from '../services/categoryService';
import './CategoriesNav.css';

const CategoriesNav = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error('Erreur chargement catégories:', error);
            }
        };
        fetchCategories();
    }, []);

    return (
        <nav className="categories-nav">
            <div className="container">
                <ul className="categories-list">
                    {categories.map(category => (
                        <li key={category.id}>
                            <Link to={`/category/${category.slug || category.id}`}>
                                {category.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default CategoriesNav;
