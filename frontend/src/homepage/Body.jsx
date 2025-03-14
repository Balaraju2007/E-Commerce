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

    const handleNavigate = (value, event) => {
        event.stopPropagation();
        console.log("Navigating to seller with ID:", value);
        navigate(`/profile/${value}`);
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
                            <div className="book-seller" onClick={(e) => handleNavigate(book.seller_id, e)}>
                                 <img
                                    src={book.seller_profile}
                                    alt={book.seller_name}
                                    className="seller-image"
                                /> <p className='seller-Name'>{book.seller_name}</p>
                                 {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg> */}
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
