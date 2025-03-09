import React, { useEffect, useState } from 'react'; 
import { useAppContext } from '../homepage/AppContext';  // Import the custom hook
import Header from '../homepage/Header';
import Addbook from '../homepage/Addbook';
import "../homepage/home.css";

const Order = () => {
  const { userData } = useAppContext();  // Use context to access global userData
  const [cartBooks, setCartBooks] = useState([]);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    if (userData && userData.user_id) {
      const fetchCartData = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/order/${userData.user_id}`, {
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
  }, [userData]);  // Run the effect only when userData is available

  // Log cartBooks whenever it changes
  useEffect(() => {
    console.log("Cart Books:", cartBooks);
    setStatus(true);
  }, [cartBooks]); // This will log cartBooks after it's updated

  return (
    <div className='homeContainer'>
      <Header />
      {/* {status && <Addbook />} */}
      <p>{status ? `You have ${cartBooks.cart_items?.length} books in your cartfnenfn` : "No booksbbbs in cart"}</p>
      
      {/* Display cart content */}
      {cartBooks.cart_items?.length > 0 ? (
        <div className='allDisplayedBooks'>
          {cartBooks.cart_items.map((item) => (
            <div key={item.book_id} className='book'>
              <p>Book Name: {item.book_name}</p>
              <img src={item.book_detals.picture} className='image' alt={item.book_name} />
              <p><span>by</span> {item.book_detals.author_name}</p>
              <p>Rs: {item.quantity.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No items in the cafbfgbjgfjgjrt</p>
      )}
    </div>
  );
};

export default Order;
