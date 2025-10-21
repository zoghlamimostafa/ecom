import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes, FaFire, FaTags } from 'react-icons/fa';
import categoryService from '../services/categoryService';
import { useSelector } from 'react-redux';
import { getProductImageUrl } from '../utils/imageHelper';

const SearchBar = ({ products = [], placeholder = 'Rechercher des produits...' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showPopularKeywords, setShowPopularKeywords] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  
  // Récupérer tous les produits depuis Redux
  const allProducts = useSelector(state => state?.product?.product) || products;
  
  // Debug: vérifier les produits disponibles
  useEffect(() => {
    console.log('🔍 SearchBar - Produits disponibles:', allProducts?.length || 0);
    if (allProducts && allProducts.length > 0) {
      console.log('✅ Premier produit:', allProducts[0]?.title);
    }
  }, [allProducts]);

  // Charger les catégories depuis l'API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategoriesWithSubcategories();
        setCategories(data);
        console.log('✅ Catégories chargées pour recherche:', data.length);
      } catch (error) {
        console.error('❌ Erreur chargement catégories:', error);
      }
    };
    loadCategories();
  }, []);

  // Extraire les marques uniques des produits
  useEffect(() => {
    if (allProducts && allProducts.length > 0) {
      const uniqueBrands = [...new Set(
        allProducts
          .map(p => p.brand)
          .filter(b => b && b.trim() !== '')
      )].sort();
      setBrands(uniqueBrands);
      console.log('✅ Marques extraites:', uniqueBrands.length);
    }
  }, [allProducts]);

  // Base de mots-clés e-commerce populaires (useMemo pour éviter recréation)
  const ecommerceKeywords = useMemo(() => ({
    categories: categories.slice(0, 10).map(cat => ({
      term: cat.title,
      icon: '�',
      popular: true,
      id: cat.id
    })),
    productTypes: [
      'Smartphone', 'Téléphone', 'Mobile', 'Ordinateur portable', 'Laptop', 'PC', 'Tablette', 'iPad',
      'Écouteurs', 'Casque audio', 'AirPods', 'Montre connectée', 'Smartwatch', 'Watch',
      'Appareil photo', 'Caméra', 'Console de jeux', 'PlayStation', 'Xbox', 'Gaming',
      'Télévision', 'TV', 'Écran', 'Moniteur', 'Enceinte', 'Haut-parleur', 'Speaker',
      'Clavier', 'Keyboard', 'Souris', 'Mouse', 'Casque', 'Headset',
      'T-shirt', 'Tshirt', 'Polo', 'Chemise', 'Pantalon', 'Jean', 'Robe', 'Jupe',
      'Chaussures', 'Baskets', 'Sneakers', 'Sandales', 'Bottes', 'Sac', 'Sacoche', 'Sac à dos',
      'Parfum', 'Eau de toilette', 'Maquillage', 'Cosmétique', 'Crème', 'Lotion', 'Shampoing',
      'Meuble', 'Canapé', 'Lit', 'Table', 'Chaise', 'Décoration', 'Déco', 'Cuisine', 
      'Électroménager', 'Réfrigérateur', 'Frigo', 'Machine à laver', 'Four', 'Micro-ondes',
      'Jouet', 'Jeu', 'Peluche', 'Poupée', 'Livre', 'Roman', 'BD', 'Magazine',
      'Sport', 'Fitness', 'Vélo', 'Tapis de yoga', 'Haltères', 'Ballon'
    ],
    attributes: [
      'Nouveau', 'Promotion', 'Soldes', 'Offre spéciale', 'Best seller',
      'Tendance', 'Populaire', 'Recommandé', 'Exclusif', 'Limité',
      'Premium', 'Luxe', 'Économique', 'Qualité', 'Pas cher'
    ],
    brands: brands.length > 0 ? brands : [
      'Samsung', 'Apple', 'Xiaomi', 'Huawei', 'Oppo', 'Realme',
      'Nike', 'Adidas', 'Puma', 'Zara', 'H&M',
      'Sony', 'LG', 'Philips', 'Bosch', 'Dell', 'HP', 'Lenovo'
    ],
    actions: [
      'Acheter', 'Comparer', 'Nouveautés', 'Promotions', 'Meilleures ventes',
      'Tendances', 'Réductions', 'Outlet', 'Flash sale', 'Deals du jour'
    ]
  }), [categories, brands]);

  // Mots-clés populaires combinés
  const popularSearches = [
    { text: 'Smartphones pas cher', icon: '📱', type: 'popular' },
    { text: 'Nouveautés', icon: '✨', type: 'new' },
    { text: 'Promotions du jour', icon: '🔥', type: 'hot' },
    { text: 'Ordinateurs portables', icon: '💻', type: 'popular' },
    { text: 'Mode femme', icon: '👗', type: 'popular' },
    { text: 'Électronique', icon: '⚡', type: 'popular' },
    { text: 'Accessoires', icon: '🎧', type: 'popular' },
    { text: 'Meilleures offres', icon: '💰', type: 'hot' }
  ];

  // Générer des mots-clés pour un produit (useCallback pour stabilité)
  const generateProductKeywords = useCallback((product) => {
    const keywords = new Set();
    const title = product.title?.toLowerCase() || '';
    const desc = product.description?.toLowerCase() || '';
    const category = product.category?.toLowerCase() || '';
    const brand = product.brand?.toLowerCase() || '';
    
    // Ajouter titre, catégorie, marque
    keywords.add(title);
    if (category) keywords.add(category);
    if (brand) keywords.add(brand);
    
    // Ajouter les tags si disponibles
    if (product.tags && Array.isArray(product.tags)) {
      product.tags.forEach(tag => keywords.add(tag.toLowerCase()));
    }
    
    // Ajouter les couleurs si disponibles
    if (product.color) {
      if (Array.isArray(product.color)) {
        // Si color est un tableau JSON
        product.color.forEach(c => {
          if (typeof c === 'string') {
            keywords.add(c.toLowerCase());
          }
        });
      } else if (typeof product.color === 'string') {
        // Si color est une string simple
        keywords.add(product.color.toLowerCase());
      }
    }
    
    // Ajouter mots du titre (tokenization)
    title.split(/\s+/).forEach(word => {
      if (word.length > 2) keywords.add(word);
    });
    
    // Ajouter mots-clés correspondants
    ecommerceKeywords.productTypes.forEach(keyword => {
      const kw = keyword.toLowerCase();
      if (title.includes(kw) || desc.includes(kw)) {
        keywords.add(kw);
      }
    });
    
    ecommerceKeywords.attributes.forEach(keyword => {
      const kw = keyword.toLowerCase();
      if (title.includes(kw) || desc.includes(kw)) {
        keywords.add(kw);
      }
    });
    
    ecommerceKeywords.brands.forEach(keyword => {
      const kw = keyword.toLowerCase();
      if (title.includes(kw) || desc.includes(kw) || brand.includes(kw)) {
        keywords.add(kw);
      }
    });
    
    // Ajouter toutes les catégories et sous-catégories
    categories.forEach(cat => {
      const catTitle = cat.title.toLowerCase();
      if (title.includes(catTitle) || desc.includes(catTitle) || category.includes(catTitle)) {
        keywords.add(catTitle);
      }
      
      // Vérifier les sous-catégories
      if (cat.subcategories) {
        cat.subcategories.forEach(subcat => {
          const subcatTitle = subcat.title.toLowerCase();
          if (title.includes(subcatTitle) || desc.includes(subcatTitle) || category.includes(subcatTitle)) {
            keywords.add(subcatTitle);
          }
        });
      }
    });
    
    return Array.from(keywords);
  }, [ecommerceKeywords, categories]);

  // Filtrer les suggestions en temps réel avec recherche améliorée
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      const searchLower = searchTerm.toLowerCase();
      const searchWords = searchLower.split(/\s+/).filter(w => w.length > 0);
      
      console.log('🔍 Recherche active:', searchLower);
      console.log('📦 Produits disponibles pour recherche:', allProducts?.length || 0);
      
      if (!allProducts || allProducts.length === 0) {
        console.warn('⚠️ Aucun produit disponible pour la recherche');
        setSuggestions([]);
        setShowSuggestions(true); // Afficher quand même le message "Aucun résultat"
        setShowPopularKeywords(false);
        return;
      }
      
      // Recherche dans les produits avec mots-clés générés et scoring
      const filtered = allProducts.map(product => {
        // Générer les mots-clés pour le produit
        const productKeywords = generateProductKeywords(product);
        
        let score = 0;
        
        // Recherche exacte dans le titre (score le plus élevé)
        const titleLower = product.title?.toLowerCase() || '';
        if (titleLower === searchLower) score += 100;
        else if (titleLower.includes(searchLower)) score += 50;
        else if (searchWords.length > 0 && searchWords.every(word => titleLower.includes(word))) score += 30;
        
        // Recherche dans la description
        const descLower = product.description?.toLowerCase() || '';
        if (descLower.includes(searchLower)) score += 20;
        
        // Recherche dans la catégorie
        const categoryLower = product.category?.toLowerCase() || '';
        if (categoryLower === searchLower) score += 40;
        else if (categoryLower.includes(searchLower)) score += 15;
        
        // Recherche dans la marque
        const brandLower = product.brand?.toLowerCase() || '';
        if (brandLower === searchLower) score += 35;
        else if (brandLower.includes(searchLower)) score += 10;
        
        // Recherche dans les tags
        if (product.tags?.some(tag => tag.toLowerCase() === searchLower)) score += 25;
        else if (product.tags?.some(tag => tag.toLowerCase().includes(searchLower))) score += 8;
        
        // Recherche dans les mots-clés générés
        if (productKeywords.some(kw => kw === searchLower)) score += 15;
        else if (productKeywords.some(kw => kw.includes(searchLower))) score += 5;
        
        // Recherche dans la couleur (gérer tableau et string)
        if (product.color) {
          if (Array.isArray(product.color)) {
            // Si color est un tableau, chercher dans chaque couleur
            if (product.color.some(c => typeof c === 'string' && c.toLowerCase().includes(searchLower))) {
              score += 5;
            }
          } else if (typeof product.color === 'string' && product.color.toLowerCase().includes(searchLower)) {
            // Si color est une string simple
            score += 5;
          }
        }
        
        return { product, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => item.product);
      
      console.log('✅ Résultats filtrés:', filtered.length);
      if (filtered.length > 0) {
        console.log('🎯 Premier résultat:', filtered[0].title, '(score le plus élevé)');
      }
      
      setSuggestions(filtered);
      setShowSuggestions(true);
      setShowPopularKeywords(false);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, allProducts, generateProductKeywords]);

  // Fermer les suggestions quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navigation au clavier
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectProduct(suggestions[selectedIndex]);
      } else if (searchTerm.trim()) {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSelectProduct = (product) => {
    navigate(`/product/${product.id}`);
    setSearchTerm('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    setShowPopularKeywords(false);
    setSelectedIndex(-1);
  };

  const handleKeywordClick = (keyword) => {
    setSearchTerm(keyword);
    setShowPopularKeywords(false);
    // Trigger la recherche automatiquement
    setTimeout(() => {
      navigate(`/product?search=${encodeURIComponent(keyword)}`);
    }, 100);
  };

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="search-bar-container" ref={searchRef}>
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            } else if (!searchTerm.trim()) {
              setShowPopularKeywords(true);
            }
          }}
        />
        {searchTerm && (
          <button className="search-clear-btn" onClick={handleClear}>
            <FaTimes />
          </button>
        )}
        <button className="search-submit-btn" onClick={handleSearch}>
          Rechercher
        </button>
      </div>

      {/* Mots-clés populaires quand le champ est vide */}
      {showPopularKeywords && !searchTerm && (
        <div className="search-suggestions">
          <div className="popular-keywords-section">
            <div className="keywords-header">
              <FaFire className="fire-icon" />
              <span>Recherches populaires</span>
            </div>
            <div className="popular-keywords-grid">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  className={`popular-keyword-btn ${search.type}`}
                  onClick={() => handleKeywordClick(search.text)}
                >
                  <span className="keyword-icon">{search.icon}</span>
                  <span className="keyword-text">{search.text}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="categories-quick-access">
            <div className="keywords-header">
              <FaTags className="tags-icon" />
              <span>Catégories populaires</span>
            </div>
            <div className="categories-grid">
              {ecommerceKeywords.categories.filter(cat => cat.popular).map((category, index) => (
                <button
                  key={index}
                  className="category-btn"
                  onClick={() => handleKeywordClick(category.term)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-text">{category.term}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          <div className="suggestions-header">
            <span className="suggestions-count">
              {suggestions.length} résultat{suggestions.length > 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="suggestions-list">
            {suggestions.map((product, index) => (
              <div
                key={product.id}
                className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleSelectProduct(product)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="suggestion-image">
                  <img 
                    src={getProductImageUrl(product.images)} 
                    alt={product.title}
                    onError={(e) => {
                      e.target.src = '/images/default-product.jpg';
                    }}
                  />
                </div>
                
                <div className="suggestion-content">
                  <div className="suggestion-title">
                    {highlightMatch(product.title, searchTerm)}
                  </div>
                  {product.category && (
                    <div className="suggestion-category">
                      <i className="fas fa-tag"></i>
                      {product.category}
                    </div>
                  )}
                  <div className="suggestion-price">
                    {product.price ? `${product.price} DA` : 'Prix non disponible'}
                  </div>
                </div>
                
                <i className="fas fa-arrow-right suggestion-arrow"></i>
              </div>
            ))}
          </div>
          
          {searchTerm.trim() && (
            <div className="suggestions-footer">
              <button className="view-all-results" onClick={handleSearch}>
                <i className="fas fa-search"></i>
                Voir tous les résultats pour "{searchTerm}"
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          )}
        </div>
      )}

      {showSuggestions && searchTerm.trim() && suggestions.length === 0 && (
        <div className="search-suggestions">
          <div className="no-results">
            <i className="fas fa-search"></i>
            <p>Aucun produit trouvé pour "{searchTerm}"</p>
            <span>Essayez avec d'autres mots-clés</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
