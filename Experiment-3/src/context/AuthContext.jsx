import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const user = authService.restoreSession();
    if (user) {
      setCurrentUser(user);
      setToken(localStorage.getItem('auth_token'));
      setIsAuthenticated(true);
    } else {
      setCurrentUser(null);
      setToken(null);
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  function login(credentials) {
    setAuthError(null);
    return authService.login(credentials).then(({ token: authToken, user }) => {
      setToken(authToken);
      setCurrentUser(user);
      setIsAuthenticated(true);
      return user;
    }).catch(error => {
      setAuthError(error.message);
      throw error;
    });
  }

  function logout() {
    authService.logout();
    setCurrentUser(null);
    setToken(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ currentUser, token, isAuthenticated, loading, authError, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
