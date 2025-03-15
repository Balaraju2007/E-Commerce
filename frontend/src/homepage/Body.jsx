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
        <div className="books-section">
            {prop.id && userdata.length > 0 ? (
                userdata.map((book) => (
                    <div
                        key={book.book_id}
                        className="book-card"
                        onClick={() => handleBookClick(book.book_id)}
                    >
                                <img
                                    src={book.picture}
                                    alt={book.book_name}
                                    className="book-image"
                                />
                                <div className="book-info">
                                    <h2 className="book-title">
                                        {book.book_name}
                                    </h2>
                                    <p className="book-author">by {book.author_name}</p>
                                    <p className="book-price">₹{book.price}</p>
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



// {/* <div className="books-section">
// {mockBooks.map((book) => (
//   <div key={book.id} className="book-card">
//     <img src={book.image} alt={book.title} className="book-image" />
//     <div className="book-info">
//       <h2 className="book-title">{book.title}</h2>
//       <p className="book-author">{book.author}</p>
//       <p className="book-price">${book.price}</p>
//     </div>
//   </div>
// ))}
// </div> */}