import React, { useEffect } from 'react';
import Header from '../homepage/Header';
import './search.css';
import { useBookData } from './BookDataContext';
import { useNavigate } from "react-router-dom";

const Search = () => {
    const { bookData } = useBookData();
    const navigate = useNavigate();

    useEffect(() => {
        console.log('Books Data:', bookData);
    }, [bookData]);

    const handleBook = (e, value) => {
        navigate(`/singleBookDetails/${value}`);
    };

    return (
        <>
            <Header />
            <div className="search-container">
                {bookData && bookData.length > 0 ? (
                    <div className="search-grid">
                        {bookData.map((book, index) => (
                            <div key={index} className="search-item" onClick={(e) => handleBook(e, book.book_id)}>
                                <img src={book.picture} alt={book.book_name} className="search-item-image" />
                                <div className="search-item-info">
                                    <h2 className="book-name">{book.book_name}</h2>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-books-message">No books found</p>
                )}
            </div>
        </>
    );
};

export default Search;
