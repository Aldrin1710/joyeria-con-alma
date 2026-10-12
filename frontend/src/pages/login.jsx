import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './styles/login.css'
import logoImg from '../assets/LogoJoyeria.jpg'


function Login() {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('') 
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const esAdmin = sessionStorage.getItem('esAdmin');
    if (esAdmin) {
      navigate('/admin-panel');
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const respuesta = await axios.post(
        `${import.meta.env.VITE_API_URL || '/api'}/auth/login`,
        {
          username: usuario.trim(),
          password: contrasena
        },
        { withCredentials: true }
      );

      sessionStorage.setItem('esAdmin', 'true'); 
      sessionStorage.setItem('usuario', respuesta.data.user?.username || usuario);
      
      navigate('/admin-panel'); 

    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Credenciales incorrectas.';
      setError(msg);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        
        <img src={logoImg} alt="Joyería con Alma" className="login-logo" />
        
        <h2 className="login-title">Acceso Staff</h2>

        <form onSubmit={handleLogin}>
          
        
          {error && <div className="error-msg"> {error}</div>}

          <div className="input-group">
            <label>Usuario</label>
            <input 
              className="login-input"
              type="text" 
              placeholder="" 
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input 
              className="login-input"
              type="password" 
              placeholder="" 
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-login">
            Ingresar al Panel
          </button>
          
          <p style={{marginTop:'20px', fontSize:'0.9rem', color:'#aaa'}}>
            <a href="/" style={{textDecoration:'none', color:'#aaa'}}>← Volver al Catálogo</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login