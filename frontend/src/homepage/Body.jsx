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
        <div className='allDisplayedBooks'>
            {prop.id && userdata.length > 0 ? (
                userdata.map((book) => (
                    <div key={book.book_id} className='book' onClick={() => handleBookClick(book.book_id)}>
                        <img src={book.picture} className='image' alt={book.book_name} />
                        <p><span>{book.seller_name}</span></p>
                        <p>Book Name: <strong>{book.book_name}</strong></p>
                        <p>by <span>{book.author_name}</span></p>
                        <p className='price'>₹{book.price}</p>
                    </div>
                ))
            ) : (
                <p>Loading books...</p>
            )}
        </div>
    );
};

export default Body;
