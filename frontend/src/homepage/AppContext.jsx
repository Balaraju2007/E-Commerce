import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context
const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  // localStorage.clear();

  const [userData, setUserData] = useState(() => {
    // Get data from localStorage or return null if not available
    const savedUserData = localStorage.getItem('userData');
    return savedUserData ? JSON.parse(savedUserData) : null;
  });

  useEffect(() => {
    // Store the userData in localStorage when it changes
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }, [userData]); // Dependency array ensures this runs when userData changes

  return (
    <AppContext.Provider value={{ userData, setUserData }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to access the context
export const useAppContext = () => {
  return useContext(AppContext);
};
