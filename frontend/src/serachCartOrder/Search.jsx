import React, { useEffect } from 'react';
import Header from '../homepage/Header';
import './search.css';
import { useBookData } from './BookDataContext';

const Search = () => {
    const { bookData } = useBookData(); // Access the global bookData
  
    useEffect(() => {
        console.log('Books Data:', bookData); // Log book data
    }, [bookData]);

    return (
        <>
            <Header />
            <div>
                <h1>Search Results</h1>
                {bookData.length === 0 ? (
                    <p className="no-books-message">No books found</p>
                ) : (
                    <div className="search-container">
                        {bookData.map((book, index) => (
                            <div key={index} className="search-item">
                                <div className="search-item-content">
                                    <img 
                                        src={book.picture} 
                                        alt={book.book_name} 
                                        className="search-item-image" 
                                    />
                                    <div className="search-item-info">
                                        <p className="book-name">{book.book_name}</p>
                                        <p className="author-name">{book.author_name}</p>
                                        <p className="book-price">${book.price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Search;
