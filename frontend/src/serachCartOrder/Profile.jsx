import Header from '../homepage/Header';
import "../homepage/home.css";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [books, setBooks] = useState()
    const { id } = useParams()
    console.log('pppppppppppppppppppppppppppppppppp')
    console.log(id)
    useEffect(() => {
        axios
            .get(`http://127.0.0.1:8000/users/${id}`)
            .then((response) => {
                setUser(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load user data");
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            console.log(id)
            try {
                const response = await fetch(`http://127.0.0.1:8000/books/books_by_user/${id}`, {
                    method: 'GET',
                    headers: { 'Content-type': 'application/json' },
                });

                const res = await response.json();
                console.log("salaaaaaaaaaaaaaaaaaaaaaaaaaaaaaar")
                console.log("📚 Books Data:", res);
                setBooks(res);
            } catch (error) {
                console.error("❌ Error fetching books:", error);
            }
        };

        fetchUserData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (


        <div className='homeContainer'>
            <Header />
            <div style={styles.container}>
                <img src={user.profile_image} alt="Profile" style={styles.profileImage} />
                <h2>{user.full_name}</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Contact:</strong> {user.contact_number}</p>
            </div>
            <div style={styles.sellerbooks} className="sellerbooks">
            { books && books.length > 0 ? (
                books.map((book) => (
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
        </div >
    );
};

const styles = {
    container: {
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        textAlign: "center",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    profileImage: {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        objectFit: "cover",
        marginBottom: "10px",
    },
    sellerbooks: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",

    }
};

export default Profile;
