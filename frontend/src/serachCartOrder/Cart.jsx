import React, { useEffect, useState } from 'react';
import { useAppContext } from '../homepage/AppContext';  // Import the custom hook
import Header from '../homepage/Header';
import "../homepage/home.css";
import './cart.css';  // Import the CSS file for cart page styling
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const userData = localStorage.getItem('user_id');  // Use context to access global userData
  const [cartBooks, setCartBooks] = useState([]);
  const [status, setStatus] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    if (userData) {
      const fetchCartData = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/cart/${userData}`, {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
            },
          });

          const res = await response.json();
          setCartBooks(res); // Set the cartBooks based on the API response
        } catch (error) {
          console.log("Error fetching cart data:", error);
        }
      };

      fetchCartData();
    }
  }, []);  // Run the effect only when userData is available

  // Log cartBooks whenever it changes
  useEffect(() => {
    console.log("Cart Books:", cartBooks);
    setStatus(true);
  }, [cartBooks]); // This will log cartBooks after it's updated


  const handleNavigate = (value, event) => {
    event.stopPropagation();
    console.log("Navigating to seller with ID:", value);
    navigate(`/profile/${value}`);
  };

  const handleCartClear = async () => {
    console.log('kkk')
    try {
      const response = await fetch(`http://127.0.0.1:8000/cart/clear/${localStorage.getItem('user_id')}`, {
        method: 'Delete',
        headers: {
          'Content-type': 'application/json',
        },
      });

      const res = await response.json();
      setCartBooks(res); // Set the cartBooks based on the API response
    } catch (error) {
      console.log("Error fetching cart data:", error);
    }
  }

  const handleDeleteCart = async (e, i_id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/cart/${localStorage.getItem('user_id')}/${i_id}`, {
        method: 'Delete',
        headers: {
          'Content-type': 'application/json',
        },
      });

      const res = await response.json();
      setCartBooks(res); // Set the cartBooks based on the API response
    } catch (error) {
      console.log("Error fetching cart data:", error);
    }
  }

  return (
    <div className='homeContainer'>
      <Header />
      <div className='total-carts'><p>{status ? `You have ${cartBooks.cart_items?.length} books in your cart` : "No books in cart"}</p>
        <button className='clear-all' onClick={handleCartClear}>Clear all</button> </div>
      {/* Display cart content */}
      {cartBooks.cart_items?.length > 0 ? (
        <div className='allDisplayedBooks'>
          {cartBooks.cart_items.map((item) => (
            <div key={item.book_id} className='book'>
              <div className="book-seller" >
                <img onClick={(e) => handleNavigate(item.book_detals.seller_id, e)}
                  src={item.book_detals.seller_profile}
                  alt={item.book_detals.seller_name}
                  className="seller-image"
                /> <p  onClick={(e) => handleNavigate(item.book_detals.seller_id, e)} className='seller-Name'>{item.book_detals.seller_name}</p>
                <svg onClick={(e)=>{handleDeleteCart(e, item.book_id)}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                </svg>
              </div>
              <p>Book Name: {item.book_name}</p>
              <img src={item.book_detals.picture} className='image' alt={item.book_name} />
              <p><span>by</span> {item.book_detals.author_name}</p>
              <p>Rs: {item.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No items in the cart</p>
      )}
    </div>
  );
};

export default Cart;
