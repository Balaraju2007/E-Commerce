import React, { useEffect, useState } from 'react';
import Header from './Header';
import "./addbook.css";
import bookImage from '../assets/thankyou.jpg'; // Default image
import { useLocation, useNavigate } from 'react-router-dom';

const Addbook = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieve the book data passed via state
  const book = location.state ? location.state.book : null;
  const user = localStorage.getItem("user"); // Get user from localStorage

  const [formData, setFormData] = useState({
    book_name: '',
    quantity: '',
    author_name: '',
    publisher_name: '',
    genre_name: '',
    price: '',
    picture: null
  });

  useEffect(() => {
    if (book) {
      setFormData({
        book_name: book.book_name || '',
        quantity: book.quantity || '',
        author_name: book.author_name || '',
        publisher_name: book.publisher_name || '',
        genre_name: book.genre_name || '',
        price: book.price || '',
        picture: null // Handle picture separately to avoid overwriting it
      });
    }
  }, [book]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      picture: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (!formData.book_name || !formData.quantity || !formData.author_name || !formData.publisher_name ||
      !formData.genre_name || !formData.price || (!formData.picture && !book)) {
      alert('Please fill all the fields');
      return;
    }

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("book_name", formData.book_name);
    formDataToSubmit.append("seller_name", user);
    formDataToSubmit.append("quantity", formData.quantity);
    formDataToSubmit.append("author_name", formData.author_name);
    formDataToSubmit.append("publisher_name", formData.publisher_name);
    formDataToSubmit.append("genre_name", formData.genre_name);
    formDataToSubmit.append("price", formData.price);
    formDataToSubmit.append("picture", formData.picture );
    if (formData.picture) {
      formDataToSubmit.append("picture", formData.picture);
    }

    try {
      let response;
      if (book) {
        response = await fetch(`http://127.0.0.1:8000/books/${book.book_id}`, {
          method: 'PUT',
          body: formDataToSubmit,
        });
      } else {
        response = await fetch('http://127.0.0.1:8000/books/', {
          method: 'POST',
          body: formDataToSubmit,
        });
      }

      const data = await response.json();
      if (!response.ok) {
        alert(`Error: ${data.detail || 'Failed to process book'}`);
      } else {
        console.log(response)
        alert(book ? '✅ Book updated successfully' : '✅ Book added successfully');
        // navigate('/books');
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
      alert('Error submitting form data: ' + error.message);
    }
  };

  return (
    <div className="homeContainer">
      <Header />
      <div className="addBookContainer">
        <div className="imageContainer">
          <img
            src={book && book.picture ? book.picture : bookImage}
            alt="Book Cover"
            className="bookImage"
          />
        </div>

        <div className="formContainer">
          <h2>{book ? 'Update Book' : 'Add Book'}</h2>
          <form onSubmit={handleSubmit} className="addBookForm">
            <input
              type="text"
              name="book_name"
              placeholder="Enter Book Name"
              value={formData.book_name}
              onChange={handleInputChange}
            /><br />
            <input
              type="number"
              name="quantity"
              placeholder="Enter Quantity"
              value={formData.quantity}
              onChange={handleInputChange}
            /><br />
            <input
              type="text"
              name="author_name"
              placeholder="Enter Author Name"
              value={formData.author_name}
              onChange={handleInputChange}
            /><br />
            <input
              type="text"
              name="publisher_name"
              placeholder="Enter Publisher Name"
              value={formData.publisher_name}
              onChange={handleInputChange}
            /><br />
            <input
              type="text"
              name="genre_name"
              placeholder="Enter Genre Name"
              value={formData.genre_name}
              onChange={handleInputChange}
            /><br />
            <input
              type="number"
              name="price"
              placeholder="Enter Book Price"
              value={formData.price}
              onChange={handleInputChange}
            /><br />
            <input
              type="file"
              name="picture"
              onChange={handleFileChange}
            /><br />
            <button type="submit">{book ? 'Update Book' : 'Add Book'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Addbook;
