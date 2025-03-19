import React, { useEffect, useState } from "react";
import "./singleBookDetails.css";
import Header from "../homepage/Header";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../homepage/AppContext";

const BookDetails = () => {
  const { userData } = useAppContext(); // Access userData from context
  const { id } = useParams();
  const navigate = useNavigate()
  const [bookData, setBookData] = useState({});
  console.log("Book ID:", id);
  const [isCart, setCart] = useState(false)
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
        console.log("Book data55555555555555555555555555555555:", res);
        setBookData(res); // Update state with fetched data
      } catch (error) {
        console.log(error);
      }
    };

    fetchBookData();
  }, [id]); // Added `id` dependency to re-fetch when it changes


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
        console.log(res)
        console.log("Book data33333333333333333333333:", res.message);
        setCart(res.message)// Update state with fetched data
      } catch (error) {
        console.log(error);
      }
    };

    fetchBookData();
  }, [id]); // Added `id` 




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
      console.log("555555555555555555555555555555555555555555555555")
      console.log("Cart response:", res);
      // Handle cart addition response if needed
      // You can update cart-related state here if necessary
    } catch (error) {
      console.error('Error adding book to cart:', error);
    }
  };

  const optionsArray = Array(bookData.quantity).fill(null);

  const addBookToOrderSummary = async (event, b_id, b_q, u_id) => {
    event.preventDefault(); // Prevent page reload when the button is clicked

    // Prepare data to send as JSON
    if (!b_id || !b_q || !u_id) {
      console.error(" Missing required fields!");
      return;
  }

  // 🔹 Use URLSearchParams to send Form Data
  const formData = new URLSearchParams();
  formData.append("user_id", u_id);
  formData.append("book_id", b_id);
  formData.append("quantity", b_q);

  console.log(" Sending Order Data:", formData.toString());

  try {
      const response = await fetch("http://127.0.0.1:8000/orders/", {
          method: "POST",
          headers: {
              "Content-Type": "application/x-www-form-urlencoded", 
          },
          body: formData.toString(), 
      });

      const res = await response.json();
      console.log("✅ Order response:", res);

      if (response.ok) {
          alert(`Order placed successfully! Order ID: ${res.order_id}`);
      } else {
          alert(` Error placing order: ${res.detail || "Unknown error"}`);
      }
  } catch (error) {
      console.error(" Error adding book to order:", error);
      alert(" Error adding book to order: " + error.message);
  }
  };

  const updateBook = () => {
    console.log(bookData)
    navigate('/addbook', {state:{book: bookData}})
  }

  return (
    <>
      <Header />
      {bookData && (
        <div className="single-full-page">
          <div className="single-book-container">
            <div className="single-book-image">
              <img src={bookData.picture} alt={bookData.book_name} />
            </div>

            <div className="single-book-details">
              <h1>{bookData.book_name}</h1>
              <p className="single-author">
                by <span>{bookData.author_name}</span>
              </p>
              <div className="single-rating">
                <span>★★★★☆</span>
                <span className="single-rating-count">22 ratings</span>
              </div>

              <p className="single-price">
                ₹{bookData.price} <span className="old-price">₹{parseInt(bookData.price) + parseInt((11 / bookData.price) * 100)}

                </span>
              </p>
              <p className="single-stock">In Stock</p>
              <p className="single-delivery">
                FREE delivery Tuesday, 4 March on orders above ₹499
              </p>

              <div className="single-description">
                <h3>About this book</h3>
                <p>This book provides basic information about C.</p>
              </div>

              <div className="single-quantity">
                <label>Quantity:</label>
                <select>
                  {optionsArray.map((_, index) => (
                    <option key={index} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="single-buttons">
                <button
                  className="single-add-to-cart"
                  onClick={(event) =>
                    addBookToCart(event, bookData.book_id, bookData.quantity, localStorage.getItem('user_id'))
                  }
                >
                  {isCart==1 ? <p disabled>Carted</p> : 'Add to Cart'}
                </button>
                <button className="single-buy-now" onClick={(e)=>{addBookToOrderSummary(event, bookData.book_id, bookData.quantity, localStorage.getItem('user_id'))}}>Buy Now</button>
                  {bookData.seller_id == localStorage.getItem("user_id") && <button onClick={updateBook}>Update Book</button>}
              </div>
            </div>
          </div>

          <footer className="single-footer">
            <p>&copy; 2025 Book Store. All rights reserved.</p>
          </footer>
        </div>
      )}
    </>
  );
};

export default BookDetails;
