import React, { useEffect, useState } from "react";
import "./singleBookDetails.css";
import Header from "../homepage/Header";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../homepage/AppContext";

const BookDetails = () => {
  const { userData } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookData, setBookData] = useState({});
  const [isCart, setCart] = useState(false);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/books/${id}`);
        const res = await response.json();
        setBookData(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBookData();
  }, [id]);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/cartis_carted/${localStorage.getItem('user_id')}/${id}`);
        const res = await response.json();
        setCart(res.message);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCartData();
  }, [id]);

  const addBookToCart = async (event, b_id, b_q, u_id) => {
    event.preventDefault();
    const formData = new URLSearchParams({ user_id: u_id, book_id: b_id, quantity: b_q });
    try {
      await fetch('http://127.0.0.1:8000/cart/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formData.toString() });
    } catch (error) {
      console.error('Error adding book to cart:', error);
    }
  };

  const addBookToOrderSummary = async (event, b_id, b_q, u_id) => {
    event.preventDefault();
    const formData = new URLSearchParams({ user_id: u_id, book_id: b_id, quantity: b_q });
    try {
      const response = await fetch("http://127.0.0.1:8000/orders/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: formData.toString() });
      const res = await response.json();
      if (response.ok) alert(`Order placed successfully! Order ID: ${res.order_id}`);
    } catch (error) {
      console.error("Error adding book to order:", error);
    }
  };

  return (
    <>
      <Header />
      {console.log(bookData)}
      {bookData && (
        <div id="single-full-page">
          
          <div id="single-book-container">
            <div id="single-book-image">
              <img src={bookData.picture} alt={bookData.book_name} />
            </div>
            <div id="single-book-details">
              <h1>{bookData.book_name}</h1>
              <p id="single-author">by <span>{bookData.author_name}</span></p>
              <div id="single-rating">
                <span>★★★★☆</span>
                <span id="single-rating-count">22 ratings</span>
              </div>
              <p id="single-price">₹{bookData.price} <span id="old-price">₹{parseInt(bookData.price) + parseInt((15 / bookData.price) * 100)}</span></p>
              <p id="single-stock">In Stock</p>
              <p id="single-delivery">FREE delivery Tuesday, 4 March on orders above ₹499</p>
              <div id="single-description">
                <h3>About this book</h3>
                <p>This book provides basic information about C.</p>
              </div>
              <div id="single-quantity">
                <label>Quantity:</label>
                <select>
                  {Array(bookData.quantity).fill(null).map((_, index) => (
                    <option key={index} value={index + 1}>{index + 1}</option>
                  ))}
                </select>
              </div>
              {parseInt(bookData.seller_id) === parseInt(localStorage.getItem('user_id')) ?(
                ''
              ) : ( <div id="single-buttons">
                <button id="single-add-to-cart" onClick={(event) => addBookToCart(event, bookData.book_id, bookData.quantity, localStorage.getItem('user_id'))}>
                  {isCart == 1 ? <p disabled>Carted</p> : 'Add to Cart'}
                </button>
                <button id="single-buy-now" onClick={(event) => addBookToOrderSummary(event, bookData.book_id, bookData.quantity, localStorage.getItem('user_id'))}>Buy Now</button>
              </div>)}
             
            </div>
          </div>
          <footer id="single-footer">
            <p>&copy; 2025 Book Store. All rights reserved.</p>
          </footer>
        </div>
      )}
    </>
  );
};

export default BookDetails;