import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { productService } from '../api/productService';
import logoImg from '../assets/LogoJoyeria.jpg';
import { FaSearch, FaTimes, FaBars } from 'react-icons/fa';

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchContainerRef = useRef(null);

  // Debounce para sugerencias de autocompletado
  useEffect(() => {
    if (!searchTerm.trim() || searchTerm.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoadingSuggestions(true);
        const results = await productService.getSearchSuggestions(searchTerm.trim());
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error buscando sugerencias:', error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cerrar menú móvil al navegar
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowSuggestions(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setShowSuggestions(false);
    navigate(`/catalogo?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleSelectSuggestion = (id) => {
    setShowSuggestions(false);
    setSearchTerm('');
    navigate(`/producto/${id}`);
  };

  const handleNosotrosClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/#nosotros');
      setTimeout(() => {
        const el = document.getElementById('nosotros');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById('nosotros');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar">
      <div className="container nav-content">
        {/* LOGO */}
        <Link to="/" className="logo">
          <img src={logoImg} alt="Joyería con Alma Logo" />
          <span>Joyería con Alma</span>
        </Link>

        {/* BUSCADOR CON AUTOCOMPLETADO */}
        <div className="nav-search-wrapper" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="nav-search-form">
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
                onClick={() => {
                  setSearchTerm('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
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

          {/* PANEL FLOTANTE DE SUGERENCIAS */}
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
                      onClick={() => handleSelectSuggestion(item._id)}
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
                            ${item.precioBase.toLocaleString('es-MX')}
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

        {/* ENLACES DE NAVEGACIÓN DESKTOP */}
        <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Inicio
          </Link>
          <Link to="/catalogo" className={location.pathname === '/catalogo' ? 'active' : ''}>
            Catálogo
          </Link>
          <a href="#nosotros" onClick={handleNosotrosClick}>
            Nosotros
          </a>
        </nav>

        {/* BOTÓN HAMBURGUESA MÓVIL */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menú de navegación"
        >
          {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      </div>
    </header>
  );
}