import { useRef, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { formatPrice } from '../../utils/formatPrice';

export default function NavbarSearch({
  searchTerm,
  setSearchTerm,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  isLoadingSuggestions,
  clearSearch,
  onSubmit,
  onSelectSuggestion,
}) {
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSuggestions]);

  return (
    <div className="nav-search-wrapper" ref={searchContainerRef}>
      <form onSubmit={onSubmit} className="nav-search-form">
        <input
          type="text"
          placeholder="Buscar joyas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          className="nav-search-input"
          aria-label="Buscar productos"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={clearSearch}
            className="search-clear-btn"
            aria-label="Limpiar búsqueda"
          >
            <FaTimes size={13} />
          </button>
        )}
        <button type="submit" className="search-submit-btn" aria-label="Ejecutar búsqueda">
          <FaSearch size={14} />
        </button>
      </form>

      {showSuggestions && (
        <div className="search-suggestions-dropdown">
          {isLoadingSuggestions && (
            <div className="suggestion-loading">Buscando recomendaciones...</div>
          )}

          {!isLoadingSuggestions && suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((item) => (
                <li
                  key={item._id}
                  onClick={() => onSelectSuggestion(item._id)}
                  className="suggestion-item"
                >
                  <img
                    src={item.imagenes?.[0] || 'https://placehold.co/50x50/f0f0f0/999?text=Joya'}
                    alt={item.nombre}
                    className="suggestion-thumb"
                  />
                  <div className="suggestion-info">
                    <span className="suggestion-name">{item.nombre}</span>
                    {item.precioBase && (
                      <span className="suggestion-price">
                        {formatPrice(item.precioBase)}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          {!isLoadingSuggestions && suggestions.length === 0 && searchTerm.trim().length >= 2 && (
            <div className="suggestion-empty">No se encontraron piezas similares</div>
          )}
        </div>
      )}
    </div>
  );
}
