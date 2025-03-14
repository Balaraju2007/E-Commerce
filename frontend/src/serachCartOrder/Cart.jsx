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
              <div className="book-seller" onClick={(e) => handleNavigate(item.book_detals.seller_id, e)}>
                <img
                  src={item.book_detals.seller_profile}
                  alt={item.book_detals.seller_name}
                  className="seller-image"
                /> <p className='seller-Name'>{item.book_detals.seller_name}</p>
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
