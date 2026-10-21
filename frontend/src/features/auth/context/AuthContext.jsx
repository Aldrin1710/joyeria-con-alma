import { useState, useEffect, useCallback } from 'react';
import { authService } from '../api/authService.js';
import { AuthContext } from './authContextValue.js';

const LOCK_STORAGE_KEY = 'loginLockUntil';
const MAX_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(() => {
    const lockUntil = Number(sessionStorage.getItem(LOCK_STORAGE_KEY) || 0);
    return lockUntil > Date.now();
  });

  useEffect(() => {
    if (!isLocked) return undefined;
    const lockUntil = Number(sessionStorage.getItem(LOCK_STORAGE_KEY) || 0);
    const remaining = lockUntil - Date.now();
    if (remaining <= 0) {
      setIsLocked(false);
      sessionStorage.removeItem(LOCK_STORAGE_KEY);
      return undefined;
    }
    const timer = setTimeout(() => {
      setIsLocked(false);
      setFailedAttempts(0);
      sessionStorage.removeItem(LOCK_STORAGE_KEY);
    }, remaining);
    return () => clearTimeout(timer);
  }, [isLocked]);

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.getMe();
      const verifiedUser = data?.user || null;
      setUser(verifiedUser);
      if (verifiedUser) {
        sessionStorage.setItem('esAdmin', 'true');
        if (verifiedUser.username) {
          sessionStorage.setItem('usuario', verifiedUser.username);
        }
      } else {
        sessionStorage.removeItem('esAdmin');
        sessionStorage.removeItem('usuario');
      }
      return verifiedUser;
    } catch {
      setUser(null);
      sessionStorage.removeItem('esAdmin');
      sessionStorage.removeItem('usuario');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async ({ username, password }) => {
    if (isLocked) {
      const msg = 'Demasiados intentos fallidos. El acceso está bloqueado por 15 minutos.';
      setError(msg);
      return { success: false, error: msg };
    }

    try {
      setLoading(true);
      setError(null);
      const data = await authService.login({ username, password });
      const loggedUser = data?.user || { username: username.trim() };
      setUser(loggedUser);
      setFailedAttempts(0);
      sessionStorage.removeItem(LOCK_STORAGE_KEY);
      sessionStorage.setItem('esAdmin', 'true');
      sessionStorage.setItem('usuario', loggedUser.username || username.trim());
      return { success: true, user: loggedUser };
    } catch (err) {
      const status = err.response?.status;
      const nextAttempts = failedAttempts + 1;
      setFailedAttempts(nextAttempts);

      if (status === 429 || nextAttempts >= MAX_ATTEMPTS) {
        const lockUntil = Date.now() + LOCK_DURATION_MS;
        sessionStorage.setItem(LOCK_STORAGE_KEY, String(lockUntil));
        setIsLocked(true);
        const lockMsg =
          err.response?.data?.message ||
          'Has alcanzado el límite de 5 intentos. Botón bloqueado por 15 minutos.';
        setError(lockMsg);
        return { success: false, error: lockMsg };
      }

      const msg = err.response?.data?.message || 'Credenciales incorrectas.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [failedAttempts, isLocked]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignorar fallo de red en logout
    } finally {
      setUser(null);
      sessionStorage.removeItem('esAdmin');
      sessionStorage.removeItem('usuario');
    }
  }, []);

  const value = {
    data: user,
    user,
    isAuthenticated: Boolean(user),
    loading,
    error,
    isLocked,
    failedAttempts,
    setError,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
