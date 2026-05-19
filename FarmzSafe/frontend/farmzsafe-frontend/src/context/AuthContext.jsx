import { createContext, useContext, useState, useEffect } from 'react';

// ── Auth Context ────────────────────────────────────────
// Shared auth state across the whole app
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on page reload
    const stored = localStorage.getItem('farmzsafe_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('farmzsafe_token', token);
    localStorage.setItem('farmzsafe_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('farmzsafe_token');
    localStorage.removeItem('farmzsafe_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
