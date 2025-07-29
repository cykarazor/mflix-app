// src/UserContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

const login = (userData, token) => {
  console.log('login userData:', userData);
  const userWithToken = { ...userData, token }; // embed token in user
  localStorage.setItem('user', JSON.stringify(userWithToken));
  setUser(userWithToken);
};

const logout = () => {
  console.log('Logging out and clearing storage');
  //localStorage.removeItem('token');
  localStorage.removeItem('user');
  setUser(null);
};

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook
export function useUser() {
  return useContext(UserContext);
}
