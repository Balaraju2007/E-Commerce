// BookDataContext.js
import React, { createContext, useState, useContext } from 'react';

// Create the context
const BookDataContext = createContext();

// Create a provider component
export const BookDataProvider = ({ children }) => {
  const [bookData, setBookData] = useState([]);

  return (
    <BookDataContext.Provider value={{ bookData, setBookData }}>
      {children}
    </BookDataContext.Provider>
  );
};

// Custom hook to use the BookData context
export const useBookData = () => useContext(BookDataContext);
