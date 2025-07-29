// src/UserContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      console.log('[UserContext] Loaded user from localStorage:', parsed);
      setUser(parsed);
    } else {
      console.log('[UserContext] No user found in localStorage');
    }
  }, []);

  const login = (userData, token) => {
    const userWithToken = { ...userData, token };
    localStorage.setItem('user', JSON.stringify(userWithToken));
    setUser(userWithToken);

    // ✅ Redirect here based on role
    if (userWithToken.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/movies', { replace: true });
    }
  };

  const logout = () => {
    console.log('Logging out and clearing storage');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/', { replace: true });
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
