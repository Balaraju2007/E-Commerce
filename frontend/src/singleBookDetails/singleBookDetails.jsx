import React, { useEffect, useState } from "react";
import "./singleBookDetails.css";
import Header from "../homepage/Header";
import { useParams } from "react-router-dom";
import { useAppContext } from "../homepage/AppContext";

const BookDetails = () => {
  const { userData } = useAppContext(); // Access userData from context
  const { id } = useParams();
  const [bookData, setBookData] = useState({});
  const [isCart, setCart] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(1); // State to track selected quantity

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
  }, [id]);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        console.log("User ID:", localStorage.getItem('user_id'));
        const response = await fetch(`http://127.0.0.1:8000/cartis_carted/${localStorage.getItem('user_id')}/${id}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        });

        const res = await response.json();
        console.log("Cart status:", res.message);
        setCart(res.message); // Update cart status based on response
      } catch (error) {
        console.log(error);
      }
    };

    fetchBookData();
  }, [id]);

  const addBookToCart = async (event, b_id, u_id) => {
    event.preventDefault(); // Prevent page reload when the button is clicked

    const formData = new URLSearchParams();
    formData.append('user_id', u_id);
    formData.append('book_id', b_id);
    formData.append('quantity', selectedQuantity); // Send selected quantity

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
      setCart(true); // Update the cart status once added to the cart
    } catch (error) {
      console.error('Error adding book to cart:', error);
    }
  };

  const addBookToOrderSummary = async (event, b_id, u_id) => {
    event.preventDefault(); // Prevent page reload when the button is clicked

    const requestData = {
      user_id: parseInt(u_id),
      book_id: b_id,
      quantity: selectedQuantity, // Send selected quantity
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({requestData}), // Send data as JSON
      });

      const res = await response.json();
      console.log("Order response:", res);
      // You can display a success message or handle the response further
    } catch (error) {
      console.error('Error adding book to order:', error);
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
                <select
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(parseInt(e.target.value))} // Update quantity based on selection
                >
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
                    addBookToCart(event, bookData.book_id, localStorage.getItem('user_id'))
                  }
                >
                  {isCart ? <p>Carted</p> : 'Add to Cart'}
                </button>
                <button className="buy-now" onClick={(e) => addBookToOrderSummary(e, bookData.book_id, localStorage.getItem('user_id'))}>
                  Buy Now
                </button>
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
