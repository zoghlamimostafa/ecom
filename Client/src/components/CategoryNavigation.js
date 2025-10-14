import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaBars } from 'react-icons/fa';
import { getAllCategoriesWithSubs } from '../utils/temporaryCategories';

const CategoryNavigation = () => {
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    // Charger les catégories temporaires
    const categories = getAllCategoriesWithSubs();
    setCategoriesTree(categories);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveCategory(null);
        setIsCategoriesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Les catégories sont déjà organisées dans categoriesTree depuis useEffect

  const handleCategoryHover = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleCategoryLeave = () => {
    setActiveCategory(null);
  };

  const toggleCategoriesDropdown = () => {
    setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen);
    setActiveCategory(null);
  };

  const getIconClass = (iconName) => {
    return iconName || 'fas fa-folder';
  };

  return (
    <nav className="category-navigation" ref={menuRef}>
      {/* Version Desktop */}
      <div className="category-nav-desktop">
        <div className="container-xxl">
          <div className="category-nav-inner">
            <div 
              className="category-nav-toggle"
              onClick={toggleCategoriesDropdown}
            >
              <FaBars />
              <span>Toutes les catégories</span>
              <FaChevronDown className={`dropdown-arrow ${isCategoriesDropdownOpen ? 'rotate' : ''}`} />
            </div>
            
            <ul className={`category-nav-list ${isCategoriesDropdownOpen ? 'show' : ''}`}>
              {categoriesTree.map((category) => (
                <li 
                  key={category.id}
                  className={`category-nav-item ${activeCategory === category.id ? 'active' : ''}`}
                  onMouseEnter={() => handleCategoryHover(category.id)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <Link 
                    to={`/category/${category.slug}`}
                    className="category-nav-link"
                  >
                    <div className="category-nav-link-content">
                      <i className={getIconClass(category.icon)}></i>
                      <span>{category.title}</span>
                    </div>
                    {category.subcategories && category.subcategories.length > 0 && (
                      <FaChevronDown className="dropdown-arrow" />
                    )}
                  </Link>
                  
                  {/* Sous-menu dropdown */}
                  {category.subcategories && category.subcategories.length > 0 && (
                    <div className={`category-dropdown ${activeCategory === category.id ? 'show' : ''}`}>
                      <div className="category-dropdown-inner">
                        <div className="dropdown-header">
                          <h4>{category.title}</h4>
                          <p>{category.description}</p>
                        </div>
                        <div className="subcategories-grid">
                          {category.subcategories.map((subcategory) => (
                            <Link
                              key={subcategory.id}
                              to={`/category/${subcategory.slug}`}
                              className="subcategory-item"
                            >
                              <i className={getIconClass(subcategory.icon)}></i>
                              <div className="subcategory-info">
                                <span className="subcategory-title">{subcategory.title}</span>
                                <span className="subcategory-desc">{subcategory.description}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="dropdown-footer">
                          <Link to={`/category/${category.slug}`} className="view-all-btn">
                            Voir tous les produits de {category.title}
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Version Mobile */}
      <div className="category-nav-mobile">
        <button 
          className="mobile-category-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FaBars />
          <span>Catégories</span>
        </button>
        
        <div className={`mobile-category-menu ${isMenuOpen ? 'show' : ''}`}>
          {categoriesTree.map((category) => (
            <div key={category.id} className="mobile-category-item">
              <Link 
                to={`/category/${category.slug}`}
                className="mobile-category-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <i className={getIconClass(category.icon)}></i>
                <span>{category.title}</span>
              </Link>
              
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="mobile-subcategories">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      to={`/category/${subcategory.slug}`}
                      className="mobile-subcategory-link"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <i className={getIconClass(subcategory.icon)}></i>
                      <span>{subcategory.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default CategoryNavigation;
