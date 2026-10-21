import { FaLock, FaArrowLeft } from 'react-icons/fa';
import logoImg from '../../../assets/LogoJoyeria.jpg';

export default function LoginForm({
  usuario,
  setUsuario,
  contrasena,
  setContrasena,
  error,
  isLocked,
  loading,
  onSubmit,
}) {
  return (
    <div className="login-card">
      <img src={logoImg} alt="Joyería con Alma" className="login-logo" />

      <h2 className="login-title">Acceso Staff</h2>

      <form onSubmit={onSubmit}>
        {error && <div className="error-msg">{error}</div>}

        <div className="input-group">
          <label>Usuario</label>
          <input
            className="login-input"
            type="text"
            placeholder=""
            value={usuario}
            disabled={isLocked || loading}
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
            disabled={isLocked || loading}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="btn-login"
          disabled={isLocked || loading}
        >
          {isLocked ? (
            <>
              <FaLock size={14} style={{ marginRight: '6px' }} />
              Acceso Bloqueado (15 min)
            </>
          ) : loading ? (
            'Verificando...'
          ) : (
            'Ingresar al Panel'
          )}
        </button>

        <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#aaa' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#aaa', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <FaArrowLeft size={12} /> Volver al Catálogo
          </a>
        </p>
      </form>
    </div>
  );
}
