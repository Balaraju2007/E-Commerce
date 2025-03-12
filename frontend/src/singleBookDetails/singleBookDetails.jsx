import React, { useEffect, useState } from "react";
import "./singleBookDetails.css";
import Header from "../homepage/Header";
import { useParams } from "react-router-dom";
import { useAppContext } from "../homepage/AppContext";

const BookDetails = () => {
  const { userData } = useAppContext(); // Access userData from context
  const { id } = useParams();
  const [bookData, setBookData] = useState({});
  console.log("Book ID:", id);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/books/${id}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        });

        const res = await response.json();
        console.log("Book data:", res);
        setBookData(res); // Update state with fetched data
      } catch (error) {
        console.log(error);
      }
    };

    fetchBookData();
  }, [id]); // Added `id` dependency to re-fetch when it changes

  // Function to add book to cart
  const addBookToCart = async (event, b_id, b_q, u_id) => {
    event.preventDefault(); // Prevent page reload when the button is clicked

    // Create a URLSearchParams object to encode data as x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append('user_id', u_id);
    formData.append('book_id', b_id);
    formData.append('quantity', b_q);

    try {
      const response = await fetch('http://127.0.0.1:8000/cart/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const res = await response.json();
      console.log("Cart response:", res);
      // Handle cart addition response if needed
      // You can update cart-related state here if necessary
    } catch (error) {
      console.error('Error adding book to cart:', error);
    }
  };

  const optionsArray = Array(bookData.quantity).fill(null);

  return (
    <>
      <Header />
      {bookData && (
        <div className="full-page">
          <div className="book-container">
            <div className="book-image">
              <img src={bookData.picture} alt={bookData.book_name} />
            </div>

            <div className="book-details">
              <h1>{bookData.book_name}</h1>
              <p className="author">
                by <span>{bookData.author_name}</span>
              </p>
              <div className="rating">
                <span>★★★★☆</span>
                <span className="rating-count">22 ratings</span>
              </div>

              <p className="price">
                ₹{bookData.price} <span className="old-price">₹399</span>
              </p>
              <p className="stock">In Stock</p>
              <p className="delivery">
                FREE delivery Tuesday, 4 March on orders above ₹499
              </p>

              <div className="description">
                <h3>About this book</h3>
                <p>This book provides basic information about C.</p>
              </div>

              <div className="quantity">
                <label>Quantity:</label>
                <select>
                  {optionsArray.map((_, index) => (
                    <option key={index} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="buttons">
                <button
                  className="add-to-cart"
                  onClick={(event) =>
                    addBookToCart(event, bookData.book_id, bookData.quantity, localStorage.getItem('user_id'))
                  }
                >
                  Add to Cart
                </button>
                <button className="buy-now">Buy Now</button>
              </div>
            </div>
          </div>

          <footer className="footer">
            <p>&copy; 2025 Book Store. All rights reserved.</p>
          </footer>
        </div>
      )}
    </>
  );
};

export default BookDetails;
