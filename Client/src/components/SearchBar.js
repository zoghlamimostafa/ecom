
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { getProductImageUrl } from '../utils/imageHelper';
import './SearchBar.css';

import { getBackendUrl } from '../utils/imageHelper';
const API_URL = getBackendUrl() + '/api/search/suggestions';

function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const SearchBar = ({ placeholder = 'Rechercher des produits...' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [autoCompleteValue, setAutoCompleteValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Debounced fetch
  const fetchSuggestions = useCallback(
    debounce(async (query) => {
      if (!query.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        setLoading(false);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      let suggestions = [];
      // Ajoute la suggestion personnalisée en haut, toujours
      if (query && query.trim().length > 0) {
        suggestions.push({
          id: '__search__',
          type: 'custom',
          title: `Rechercher "${query}"`,
          query: query
        });
      }
      try {
        const res = await fetch(`${API_URL}?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Erreur API');
        const data = await res.json();
        // Supporte toutes les suggestions (produits, catégories, marques)
        if (data.suggestions && Array.isArray(data.suggestions)) {
          suggestions = suggestions.concat(data.suggestions);
        } else {
          // Rétrocompatibilité : produits et catégories séparés
          if (data.products && Array.isArray(data.products)) {
            suggestions = suggestions.concat(data.products.map(p => ({ ...p, type: 'product', images: p.image ? [p.image] : [] })));
          }
          if (data.categories && Array.isArray(data.categories)) {
            suggestions = suggestions.concat(data.categories.map(c => ({ ...c, type: 'category' })));
          }
          if (data.brands && Array.isArray(data.brands)) {
            suggestions = suggestions.concat(data.brands.map(b => ({ ...b, type: 'brand' })));
          }
        }
        setSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (err) {
        setError('Erreur lors de la recherche');
        setSuggestions(suggestions);
        setShowSuggestions(true);
      } finally {
        setLoading(false);
      }
  }, 120),
    []
  );

  useEffect(() => {
    if (searchTerm.trim()) {
      fetchSuggestions(searchTerm);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setLoading(false);
      setError(null);
      setAutoCompleteValue('');
    }
  }, [searchTerm, fetchSuggestions]);

  // Met à jour l’autocomplétion inline dès que suggestions changent
  useEffect(() => {
    if (!searchTerm.trim() || !suggestions.length) {
      setAutoCompleteValue('');
      return;
    }
  // Cherche la première suggestion produit/catégorie/marque qui CONTIENT le searchTerm
  const first = suggestions.find(s => (s.type === 'product' || s.type === 'category' || s.type === 'brand') && s.title && s.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (first && first.title && first.title.length > searchTerm.length) {
      setAutoCompleteValue(first.title);
    } else {
      setAutoCompleteValue('');
    }
  }, [suggestions, searchTerm]);

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

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelect(suggestions[selectedIndex]);
      } else if (searchTerm.trim()) {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSelect = (item) => {
    // Toujours rediriger vers la page de recherche filtrée avec le mot tapé ou le titre de la suggestion
    let searchValue = '';
    if (item.type === 'custom') {
      searchValue = item.query;
    } else if (item.title) {
      searchValue = item.title;
    } else {
      searchValue = searchTerm;
    }
    navigate(`/product?search=${encodeURIComponent(searchValue)}`);
    setSearchTerm('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/product?search=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      setSearchTerm('');
      setAutoCompleteValue('');
      // Focus automatique sur l'input après recherche
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 200);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setError(null);
  };

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="searchbar-highlight">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="searchbar-autosuggest" ref={searchRef}>
      <div className="searchbar-input-wrapper">
        <div style={{position: 'relative', width: '100%'}}>
          {/* Input visible */}
          <input
            ref={inputRef}
            type="text"
            className="searchbar-input"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            onFocus={e => {
              if (suggestions.length > 0) setShowSuggestions(true);
              // Sélectionne la partie complétée si autocomplétion
              if (autoCompleteValue && autoCompleteValue.toLowerCase() !== searchTerm.toLowerCase()) {
                setTimeout(() => {
                  const input = e.target;
                  input.setSelectionRange(searchTerm.length, autoCompleteValue.length);
                }, 0);
              }
            }}
            autoComplete="off"
            spellCheck={false}
            style={{position: 'relative', background: 'transparent'}}
          />
          {/* Input d’autocomplétion (derrière, grisé) */}
          {autoCompleteValue && autoCompleteValue.toLowerCase() !== searchTerm.toLowerCase() && (
            <input
              type="text"
              tabIndex={-1}
              className="searchbar-input"
              value={autoCompleteValue}
              readOnly
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                color: '#bbb',
                background: 'transparent',
                pointerEvents: 'none',
                zIndex: 1,
                fontWeight: 400
              }}
            />
          )}
        </div>
        {searchTerm && (
          <button className="searchbar-clear-btn" onClick={handleClear}>
            <FaTimes />
          </button>
        )}
        <button className="searchbar-submit-btn" onClick={handleSearch}>
          <FaSearch className="searchbar-submit-icon" />
        </button>
      </div>

      {showSuggestions && (
        <div className="searchbar-suggestions">
          {loading && <div className="searchbar-loading">Recherche...</div>}
          {error && <div className="searchbar-noresult">{error}</div>}
          {!loading && !error && suggestions.length === 0 && searchTerm.trim() && (
            <div className="searchbar-noresult">Aucun résultat pour "{searchTerm}"</div>
          )}
          {!loading && !error && suggestions.length > 0 && (
            suggestions.map((item, idx) => (
              <div
                key={item.type + '-' + item.id}
                className={`searchbar-suggestion${idx === selectedIndex ? ' selected' : ''}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                {item.type === 'custom' && (
                  <span className="searchbar-suggestion-title searchbar-custom-suggestion">
                    {item.title}
                  </span>
                )}
                {item.type === 'product' && (
                  <>
                    <img
                      className="searchbar-suggestion-img"
                      src={getProductImageUrl(item.images || item.image)}
                      alt={item.title}
                      onError={e => { e.target.src = '/images/default-product.jpg'; }}
                    />
                    <span className="searchbar-suggestion-title">
                      {highlightMatch(item.title, searchTerm)}
                    </span>
                    <span className="searchbar-suggestion-price">
                      {item.price ? `${item.price} DA` : ''}
                    </span>
                  </>
                )}
                {item.type === 'category' && (
                  <>
                    <span className="searchbar-suggestion-title" style={{ color: '#ff7a00', fontWeight: 600 }}>
                      <span role="img" aria-label="cat">📂</span> {highlightMatch(item.title, searchTerm)}
                    </span>
                  </>
                )}
                {item.type === 'brand' && (
                  <>
                    <span className="searchbar-suggestion-title" style={{ color: '#2196F3', fontWeight: 600 }}>
                      <span role="img" aria-label="brand">🏷️</span> {highlightMatch(item.title, searchTerm)}
                    </span>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
