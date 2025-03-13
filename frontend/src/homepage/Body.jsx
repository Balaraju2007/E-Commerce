import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './body.css';

const Body = (prop) => {
    const [userdata, setUserdata] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/books/', {
                    method: 'GET',
                    headers: { 'Content-type': 'application/json' },
                });

                const res = await response.json();
                console.log("📚 Books Data:", res);
                setUserdata(res);
            } catch (error) {
                console.error("❌ Error fetching books:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleBookClick = (bookId) => {
        navigate(`/singleBookDetails/${bookId}`);
    };

    return (
        <div className="book-container">
            {prop.id && userdata.length > 0 ? (
                userdata.map((book) => (
                    <div
                        key={book.book_id}
                        className="book-item"
                        onClick={() => handleBookClick(book.book_id)}
                    >
                        <div className="book-content">
                            <div className="book-seller">
                                <img
                                    src={book.seller_profile}
                                    alt={book.seller_name}
                                    className="seller-image"
                                /> <p className='seller-Name'>{book.seller_name}</p>
                            </div>
                            <div className="book-details">
                                <img
                                    src={book.picture}
                                    alt={book.book_name}
                                    className="book-image"
                                />
                                <div className="book-info">
                                    <p className="book-name">
                                        <strong>{book.book_name}</strong>
                                    </p>
                                    <p className="author-name">by {book.author_name}</p>
                                    <p className="price">₹{book.price}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p>Loading books...</p>
            )}
        </div>
    );
};

export default Body;
