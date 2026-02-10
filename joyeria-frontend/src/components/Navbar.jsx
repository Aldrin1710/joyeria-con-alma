import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../pages/styles/App.css'
import logoImg from '../assets/LogoJoyeria.jpg' 

function Navbar() {
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioGuardado = sessionStorage.getItem('usuario');
    const token = sessionStorage.getItem('jwt_token');

    if(usuarioGuardado && token){
      setUsuario(usuarioGuardado);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('jwt_token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('esAdmin');
    setUsuario(null);
    setMenuAbierto(false); // Cerrar menú al salir
    navigate('/'); 
  };

  // Función para cerrar menú al hacer clic en un enlace
  const closeMenu = () => setMenuAbierto(false);

  return (
    <nav className="navbar">
      <a href="#inicio" className="logo-link" onClick={closeMenu}>
        <img src={logoImg} alt="Joyería con Alma" className="logo-img" />
      </a>

      {/* BOTÓN HAMBURGUESA (Solo visible en móvil por CSS) */}
      <div className="menu-icon" onClick={() => setMenuAbierto(!menuAbierto)}>
        <span className={menuAbierto ? "bar bar1 active" : "bar bar1"}></span>
        <span className={menuAbierto ? "bar bar2 active" : "bar bar2"}></span>
        <span className={menuAbierto ? "bar bar3 active" : "bar bar3"}></span>
      </div>

      {/* CONTENEDOR DE LINKS  */}
      <div className={`nav-links ${menuAbierto ? 'active' : ''}`}>
        <a href="#catalogo" onClick={closeMenu}>Catálogo</a>
        <a href="#nosotros" onClick={closeMenu}>Nosotros</a>
        <a href="#contacto" onClick={closeMenu}>Contacto</a>
      
        {/* LÓGICA DE USUARIO */}
        {usuario ? (
          <div className="admin-controls-mobile">
            <span className="user-name">Hola, {usuario}</span>
            <Link to="/admin-panel" onClick={closeMenu} className="link-panel">Panel ⚙️</Link>
            <button onClick={handleLogout} className="btn-staff btn-logout-mobile">
                SALIR
            </button>
          </div>
        ) : (
          <Link to="/login-joyeria" className="btn-staff" onClick={closeMenu}>
            STAFF
          </Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar