import React, { useState } from 'react';
import Header from './Header';
import "./addbook.css"
import bookImage from '../assets/thankyou.jpg';

const Addbook = () => {
  // const username = localStorage.getItem("user");
  const user = localStorage.getItem("user");
  console.log(user)
  const [formData, setFormData] = useState({
    book_name: '',
    quantity: '',
    author_name: '',
    publisher_name: '',
    genre_name: '',
    price: '',
    picture: null
  });
  console.log(formData)
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      picture: e.target.files[0]
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all required fields are filled
    if (!formData.book_name || !formData.quantity ||
        !formData.author_name || !formData.publisher_name || !formData.genre_name ||
        !formData.price || !formData.picture) {
      alert('Please fill all the fields');
      return;
    }

    // Create FormData to send as multipart/form-data
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("book_name", formData.book_name);
    formDataToSubmit.append("seller_name", user);
    formDataToSubmit.append("quantity", Number(formData.quantity)); // Ensure it's a number
    formDataToSubmit.append("author_name", formData.author_name);
    formDataToSubmit.append("publisher_name", formData.publisher_name);
    formDataToSubmit.append("genre_name", formData.genre_name);
    formDataToSubmit.append("price", Number(formData.price)); // Ensure it's a number
    formDataToSubmit.append("picture", formData.picture);

    try {
      console.log(formDataToSubmit)
      const response = await fetch('http://127.0.0.1:8000/books/', {
        method: 'POST',
        body: formDataToSubmit, // ✅ Automatically sets the correct Content-Type
      });

      const data = await response.json();
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
      console.log(data)
      if (!response.ok) {
        console.error('Failed to add the book:', data);
        alert(`Error: ${data.detail || 'Failed to add book'}`);
      } else {
        console.log('✅ Book added successfully', data);
        alert('✅ Book added successfully');
        setFormData({
          book_name: '',
          quantity: '',
          author_name: '',
          publisher_name: '',
          genre_name: '',
          price: '',
          picture: null
        });
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
      alert('Error submitting form data: ' + error.message);
    }
  };

  return (
    <div className='homeContainer'>
    <Header />
    <div className='addBookContainer'>
      {/* Left Side Image */}
      <div className='imageContainer'>
        <img src={bookImage} alt='Book Cover' className='bookImage' />
      </div>

      {/* Right Side Form */}
      <div className='formContainer'>
        <h2>Add Book</h2>
        <form onSubmit={handleSubmit} className='addBookForm'>
          <input type='text' name='book_name' placeholder='Enter Book Name' value={formData.book_name} onChange={handleInputChange} /><br />
          <input type='number' name='quantity' placeholder='Enter Quantity' value={formData.quantity} onChange={handleInputChange} /><br />
          <input type='text' name='author_name' placeholder='Enter Author Name' value={formData.author_name} onChange={handleInputChange} /><br />
          <input type='text' name='publisher_name' placeholder='Enter Publisher Name' value={formData.publisher_name} onChange={handleInputChange} /><br />
          <input type='text' name='genre_name' placeholder='Enter Genre Name' value={formData.genre_name} onChange={handleInputChange} /><br />
          <input type='number' name='price' placeholder='Enter Book Price' value={formData.price} onChange={handleInputChange} /><br />
          <input type='file' name='picture' onChange={handleFileChange} /><br />
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  </div>
);
};

export default Addbook;

