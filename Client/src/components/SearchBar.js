import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaSearch } from 'react-icons/fa';
import { getAllProducts } from '../features/products/productSlice';
import './SearchBar.css';

const SearchBar = ({ placeholder = 'Rechercher des produits...' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const productState = useSelector((state) => state?.product?.product);
  const isLoading = useSelector((state) => state?.product?.isLoading);

  // Charger les produits au montage du composant
  useEffect(() => {
    if (!productState || productState.length === 0) {
      console.log('📦 SearchBar: Chargement des produits...');
      dispatch(getAllProducts());
    }
  }, [dispatch, productState]);

  // Debug: Log productState changes
  useEffect(() => {
    console.log('📦 SearchBar productState updated:', {
      isArray: Array.isArray(productState),
      length: productState?.length,
      isLoading,
      firstProduct: productState?.[0]?.title
    });
  }, [productState, isLoading]);

  // Fonction pour gérer les changements dans la barre de recherche
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    console.log('🔍 Saisie:', value, 'Longueur:', value.length);
    
    // Minimum 1 caractère pour afficher les suggestions
    if (value.length >= 1) {
      if (!productState || !Array.isArray(productState)) {
        console.log('⚠️ ProductState invalide:', productState);
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      
      if (productState.length === 0) {
        console.log('⚠️ ProductState vide');
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      
      console.log('📦 Recherche dans', productState.length, 'produits');
      
      // Filtrer par titre de produit
      const matchingProducts = productState
        .filter(product => {
          const hasTitle = product && product.title;
          if (!hasTitle) return false;
          const matches = product.title.toLowerCase().includes(value.toLowerCase());
          if (matches) {
            console.log('  ✓ Trouvé:', product.title);
          }
          return matches;
        })
        .map(product => ({
          title: product.title,
          slug: product.slug || product.id,
          id: product.id
        }))
        .slice(0, 8); // Maximum 8 suggestions
      
      console.log('✅ Total trouvés:', matchingProducts.length);
      
      setSuggestions(matchingProducts);
      setShowSuggestions(matchingProducts.length > 0);
      
      console.log('👁️ showSuggestions:', matchingProducts.length > 0);
    } else {
      console.log('⊘ Recherche vide, masquage des suggestions');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Fonction pour gérer le clic sur une suggestion
  const handleSuggestionClick = (suggestion) => {
    console.log('🖱️ Clic sur suggestion:', suggestion.title);
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
    // Rediriger vers la page de recherche avec le terme
    navigate(`/product?search=${encodeURIComponent(suggestion.title)}`);
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('🔍 Recherche soumise:', searchTerm);
      navigate(`/product?search=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="searchbar-container" ref={searchRef}>
      <form onSubmit={handleSearch} className="searchbar-form">
        <div className="searchbar-input-wrapper">
          <FaSearch className="searchbar-icon" />
          <input
            type="text"
            className="searchbar-input"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => {
              console.log('🎯 Focus sur input, suggestions:', suggestions.length);
              if (suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="searchbar-suggestions">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="searchbar-suggestion-item"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Empêche le blur de l'input
                    handleSuggestionClick(suggestion);
                  }}
                >
                  <FaSearch className="searchbar-suggestion-icon" />
                  <span className="searchbar-suggestion-title">{suggestion.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className="searchbar-submit-btn">
          <FaSearch />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
