import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons
import { FiSearch } from "react-icons/fi";
import "./home1.css";

const Home1= () => {
  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <h1 className="title">E-Commerce</h1>
        <div className="search-bar">
          <input type="text" placeholder="Search for books..." className="search-input" />
          <button className="search-button">
            <FiSearch className="search-icon" />
          </button>
        </div>
        <div className="icons">
          <i className="bi bi-plus-circle icon" title="Add Book"></i>
          <i className="bi bi-list icon" title="My Orders"></i>
          <i className="bi bi-cart icon" title="Cart"></i>
          <i className="bi bi-person icon" title="Profile"></i>
        </div>
      </header>

      {/* Books Section */}
      <div className="books-section">
        {mockBooks.map((book) => (
          <div key={book.id} className="book-card">
            <img src={book.image} alt={book.title} className="book-image" />
            <div className="book-info">
              <h2 className="book-title">{book.title}</h2>
              <p className="book-author">{book.author}</p>
              <p className="book-price">${book.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const mockBooks = [
  { id: 1, title: "Atomic Habits", author: "James Clear", price: 18, image: "https://m.media-amazon.com/images/I/91bYsX41DVL.jpg" },
  { id: 2, title: "The Alchemist", author: "Paulo Coelho", price: 15, image: "https://m.media-amazon.com/images/I/51Z0nLAfLmL.jpg" },
  { id: 3, title: "Deep Work", author: "Cal Newport", price: 20, image: "https://m.media-amazon.com/images/I/71HwMuLTu0L.jpg" },
  { id: 4, title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", price: 17, image: "https://m.media-amazon.com/images/I/81bsw6fnUiL.jpg" },
  { id: 5, title: "Think and Grow Rich", author: "Napoleon Hill", price: 14, image: "https://m.media-amazon.com/images/I/81E4hPkpXvL.jpg" },
  { id: 6, title: "The 4-Hour Workweek", author: "Tim Ferriss", price: 22, image: "https://m.media-amazon.com/images/I/61M4NvxI+9L.jpg" },
  { id: 7, title: "Can't Hurt Me", author: "David Goggins", price: 25, image: "https://m.media-amazon.com/images/I/81u+AgE7z3L.jpg" },
  { id: 8, title: "The Power of Now", author: "Eckhart Tolle", price: 19, image: "https://m.media-amazon.com/images/I/81wbboM3RFL.jpg" },
  { id: 9, title: "Zero to One", author: "Peter Thiel", price: 21, image: "https://m.media-amazon.com/images/I/71m-MxdJ2WL.jpg" },

];

export default Home1;
