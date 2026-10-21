import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth.js';
import LoginForm from '../features/auth/components/LoginForm.jsx';
import './styles/login.css';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const { login, isAuthenticated, loading, error, isLocked } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/admin-panel');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLocked) return;

    const result = await login({
      username: usuario.trim(),
      password: contrasena,
    });

    if (result.success) {
      navigate('/admin-panel');
    }
  };

  return (
    <div className="login-page">
      <LoginForm
        usuario={usuario}
        setUsuario={setUsuario}
        contrasena={contrasena}
        setContrasena={setContrasena}
        error={error}
        isLocked={isLocked}
        loading={loading}
        onSubmit={handleLogin}
      />
    </div>
  );
}
