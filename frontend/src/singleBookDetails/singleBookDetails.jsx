import React, { useEffect, useState } from "react";
import "./singleBookDetails.css";
import Header from "../homepage/Header";
import { useParams } from "react-router-dom";

const BookDetails = () => {
  const { id } = useParams()
  const [bookData, setBookData] = useState({})
  console.log("1111111111111111111111111111111" + id)
  useEffect(() => {
    // Define the async function inside useEffect
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/books/${id}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        });

        // Handle the response
        const res = await response.json();
        console.log(res);

        setBookData(res); // Update state with fetched data
        console.log(bookData);

      } catch (error) {
        console.log(error);
      } finally {
        ;
        // You can add cleanup or other final steps here if needed
      }
    };

    // Call the async function
    fetchUserData();
  }, []);
  const optionsArray = Array(bookData.quantity).fill(null);
  return (
    <>
      <div> <Header> </Header> </div>
      {bookData && <>{console.log(bookData)}
        <div className="full-page">
          <div className="book-container">
            <div className="book-image">
              <img
                src={bookData.picture}
                alt="Let Us C Book"
              />
            </div>

            <div className="book-details">
              <h1>{bookData.book_name}</h1>
              <p className="author">by <span>{bookData.author_name}</span></p>
              <div className="rating">
                <span>★★★★☆</span>
                <span className="rating-count">22 ratings</span>
              </div>

              <p className="price">₹{bookData.price} <span className="old-price">₹399</span></p>
              <p className="stock">In Stock</p>
              <p className="delivery">FREE delivery Tuesday, 4 March on orders above ₹499</p>

              <div className="description">
                <h3>About this book</h3>
                <p>This book provides basic information about C .</p>
              </div>

              <div className="quantity">
                <label>Quantity:</label>
                <select>
                  {optionsArray.map((_, index) => (
                    <option key={index} value={`option-${index + 1}`}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="buttons">
                <button className="add-to-cart">Add to Cart</button>
                <button className="buy-now">Buy Now</button>
              </div>
            </div>
          </div>

          <footer className="footer">
            <p>&copy; 2025 Book Store. All rights reserved.</p>
          </footer>
        </div>  </>
      }
    </>
  );
};

export default BookDetails;
