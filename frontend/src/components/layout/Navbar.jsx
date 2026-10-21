import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaTimes, FaBars } from 'react-icons/fa';
import { useSearchSuggestions } from '../../features/products/hooks/useSearchSuggestions';
import NavbarSearch from './NavbarSearch';
import logoImg from '../../assets/LogoJoyeria.jpg';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    searchTerm,
    setSearchTerm,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    loading: isLoadingSuggestions,
    clearSearch,
  } = useSearchSuggestions();

  const navigate = useNavigate();
  const location = useLocation();

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setShowSuggestions(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    closeMenus();
    navigate(`/catalogo?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleSelectSuggestion = (id) => {
    clearSearch();
    setIsMobileMenuOpen(false);
    navigate(`/producto/${id}`);
  };

  const handleNosotrosClick = (e) => {
    e.preventDefault();
    closeMenus();
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
        <Link to="/" className="logo" onClick={closeMenus}>
          <img src={logoImg} alt="Joyería con Alma Logo" />
          <span>Joyería con Alma</span>
        </Link>

        <NavbarSearch
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          isLoadingSuggestions={isLoadingSuggestions}
          clearSearch={clearSearch}
          onSubmit={handleSearchSubmit}
          onSelectSuggestion={handleSelectSuggestion}
        />

        <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''} onClick={closeMenus}>
            Inicio
          </Link>
          <Link to="/catalogo" className={location.pathname === '/catalogo' ? 'active' : ''} onClick={closeMenus}>
            Catálogo
          </Link>
          <a href="#nosotros" onClick={handleNosotrosClick}>
            Nosotros
          </a>
        </nav>

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
