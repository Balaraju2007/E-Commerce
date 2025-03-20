import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../homepage/Header';
import "../homepage/home.css";
import './cart.css';

const Cart = () => {
  const userData = localStorage.getItem('user_id');
  const [cartBooks, setCartBooks] = useState([]);
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userData) {
      const fetchCartData = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/cart/${userData}`, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
          });

          const res = await response.json();
          setCartBooks(res);
        } catch (error) {
          console.log("Error fetching cart data:", error);
        }
      };
      fetchCartData();
    }
  }, []);

  useEffect(() => {
    console.log("Cart Books:", cartBooks);
    setStatus(true);
  }, [cartBooks]);

  const handleNavigate = (value, event) => {
    event.stopPropagation();
    navigate(`/profile/${value}`);
  };

  const handleCartClear = async () => {
    console.log('Clearing the cart...');
    const userId = localStorage.getItem('user_id');
    const formData = new URLSearchParams();
    formData.append("user_id", userId);
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/cart/clear/`, {
        method: 'DELETE',
        headers: { 'Content-type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      if (!response.ok) throw new Error('Failed to clear the cart');

      setCartBooks({ ...cartBooks, cart_items: [] });

    } catch (error) {
      console.log("Error clearing cart:", error);
      alert("Failed to clear the cart. Please try again.");
    }
  };

  const handleDeleteCart = async (e, i_id) => {
    e.stopPropagation();

    if (!i_id) {
      alert("Invalid book ID");
      return;
    }

    const userId = localStorage.getItem('user_id');
    const formData = new URLSearchParams();
    formData.append("user_id", userId);
    formData.append("item_id", i_id);

    try {
      console.log("Deleting book ID:", i_id);

      const response = await fetch(`http://127.0.0.1:8000/cart/delete_item/`, {
        method: 'DELETE',
        headers: { 'Content-type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });

      if (!response.ok) throw new Error('Failed to delete the book');

      setCartBooks((prevCartBooks) => ({
        ...prevCartBooks,
        cart_items: prevCartBooks.cart_items.filter((item) => item.cart_item_id !== i_id),
      }));

    } catch (error) {
      console.log("Error deleting book from cart:", error);
      alert("Failed to delete the book. Please try again.");
    }
  };

  const handleBook = (e, value) => {
    navigate(`/singleBookDetails/${value}`);
  };

  return (
    <div id="cart-container">
      <Header />
      <div id="cart-header">
        <h2 id="cart-title">{status ? `You have ${cartBooks.cart_items?.length} books in your cart` : "No books in cart"}</h2>
      </div>

      {cartBooks.cart_items?.length > 0 ? (
        <div id="cart-books-container">
          {cartBooks.cart_items.map((item) => (
            <div key={item.book_id} className="cart-book" onClick={(e) => handleBook(e, item.book_id)}>
              <img src={item.book_detals.picture} alt={item.book_name} />
              
              <div className="cart-book-details">
                <h3 className="cart-book-title">{item.book_name}</h3>
                <p className="cart-book-author"><span>by</span> {item.book_detals.author_name}</p>
                <p className="cart-book-price">Rs: {item.price}</p>
              </div>

              <svg 
                onClick={(e) => handleDeleteCart(e, item.cart_item_id)} 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                fill="currentColor" 
                className="delete-icon" 
                viewBox="0 0 16 16"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
              </svg>
            </div>
          ))}
        </div>
      ) : (
        <p>No items in the cart</p>
      )}

      {/* Clear Cart Button (Fixed at Bottom Right) */}
      {cartBooks.cart_items?.length > 0 && (
        <button id="clear-cart-btn" onClick={handleCartClear}>Clear Cart</button>
      )}
    </div>
  );
};

export default Cart;
