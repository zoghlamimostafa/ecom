import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { temporaryCategories } from '../utils/temporaryCategories';

const HorizontalCategoryMenu = () => {
  const [showCategories, setShowCategories] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  
  // Afficher toutes les catégories principales
  const allCategories = temporaryCategories;

  const handleButtonClick = () => {
    setShowCategories(!showCategories);
  };

  const handleButtonHover = () => {
    setShowCategories(true);
  };

  const handleMenuLeave = () => {
    setShowCategories(false);
    setHoveredCategory(null);
  };

  return (
    <div className="horizontal-category-menu">
      <div className="category-menu-container">
        <div 
          className="categories-button-wrapper"
          onMouseEnter={handleButtonHover}
          onMouseLeave={handleMenuLeave}
        >
          <button 
            className="categories-main-button"
            onClick={handleButtonClick}
          >
            <i className="fas fa-th-large"></i>
            <span>Nos Catégories</span>
            <i className={`fas fa-chevron-down arrow-icon ${showCategories ? 'active' : ''}`}></i>
          </button>

          {/* Dropdown des catégories */}
          {showCategories && (
            <div className="categories-dropdown-menu">
              <div className="categories-grid">
                {allCategories.map(category => (
                  <div 
                    key={category._id}
                    className="category-dropdown-item"
                    onMouseEnter={() => setHoveredCategory(category._id)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <Link
                      to={`/category/${category.slug}`}
                      className="category-main-link"
                    >
                      <i className={category.icon}></i>
                      <span>{category.title}</span>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <i className="fas fa-chevron-right subcategory-arrow"></i>
                      )}
                    </Link>
                    
                    {/* Sous-catégories */}
                    {hoveredCategory === category._id && category.subcategories && category.subcategories.length > 0 && (
                      <div className="subcategories-side-menu">
                        <div className="subcategories-header">
                          <h4>{category.title}</h4>
                          <p>{category.description}</p>
                        </div>
                        <div className="subcategories-list">
                          {category.subcategories.map(subcategory => (
                            <Link
                              key={subcategory._id}
                              to={`/category/${subcategory.slug}`}
                              className="subcategory-link-item"
                            >
                              <i className={subcategory.icon}></i>
                              <div className="subcategory-info">
                                <span className="subcategory-name">{subcategory.title}</span>
                                <span className="subcategory-desc">{subcategory.description}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HorizontalCategoryMenu;
