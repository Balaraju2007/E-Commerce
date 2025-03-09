import React, { useState } from 'react';
import Header from './Header';
import "../homepage/home.css";
import "./home.css";

const Addbook = () => {
  // State to store the form data
  const [formData, setFormData] = useState({
    book_name: '',
    seller_name: '',
    quantity: '',
    author_name: '',
    publisher_name: '',
    genre_name: '',
    price: '',
    picture: null
  });

  // Handle input change to update the corresponding form field
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle file input change (for image)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0] // Store the first file from the file input
    }));
  };

  // Function to upload image
  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('picture', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/upload-image/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.image_url) {
        console.log('Image uploaded successfully:', data.image_url);
        return data.image_url;  // Return the URL of the uploaded image
      } else {
        console.error('Failed to upload image. Response:', data);
        alert(`Failed to upload image: ${data.error || 'Unknown error'}`);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image: ' + error.message);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!formData.book_name || !formData.seller_name || !formData.quantity ||
        !formData.author_name || !formData.publisher_name || !formData.genre_name ||
        !formData.price || !formData.picture) {
      alert('Please fill all the fields');
      return;
    }

    // Upload the image and get the image URL
    const imageUrl = await uploadImage(formData.picture);

    // If image upload fails, stop the submission
    if (!imageUrl) {
      return;
    }

    // Create a new FormData object to handle form data including files
    const formDataToSubmit = new FormData();
    // Append form data fields to the FormData object
    for (const [key, value] of Object.entries(formData)) {
      if (key !== 'picture' && value !== null && value !== undefined) {
        formDataToSubmit.append(key, value);
      }
    }

    // Append the uploaded image URL to formDataToSubmit
    formDataToSubmit.append('picture', imageUrl);

    try {
      const response = await fetch('http://127.0.0.1:8000/books/', {
        method: 'POST',
        body: formDataToSubmit, // Send FormData directly
      });

      // Check if the request was successful
      if (!response.ok) {
        const errorText = await response.text();  // Get the error response text
        console.error('Failed to add the book:', errorText);
        alert('Failed to add the book: ' + errorText);
      } else {
        console.log('Book added successfully');
        alert('Book added successfully');
        // Optionally, reset the form here
        setFormData({
          book_name: '',
          seller_name: '',
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
      <div className='addBook'>
        <h2>Add Book</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type='text' 
            name='book_name' 
            placeholder='Enter Book Name' 
            value={formData.book_name} 
            onChange={handleInputChange} 
          /><br />
          
          <input 
            type='text' 
            name='seller_name' 
            placeholder='Enter Seller Name' 
            value={formData.seller_name} 
            onChange={handleInputChange} 
          /><br />
          
          <input 
            type='text' 
            name='quantity' 
            placeholder='Enter Quantity' 
            value={formData.quantity} 
            onChange={handleInputChange} 
          /><br />
          
          <input 
            type='text' 
            name='author_name' 
            placeholder='Enter Author Name' 
            value={formData.author_name} 
            onChange={handleInputChange} 
          /><br />
          
          <input 
            type='text' 
            name='publisher_name' 
            placeholder='Enter Publisher Name' 
            value={formData.publisher_name} 
            onChange={handleInputChange} 
          /><br />
          
          <input 
            type='text' 
            name='genre_name' 
            placeholder='Enter Genre Name' 
            value={formData.genre_name} 
            onChange={handleInputChange} 
          /><br />
          
          <input 
            type='text' 
            name='price' 
            placeholder='Enter Book Price' 
            value={formData.price} 
            onChange={handleInputChange} 
          /><br />
          
          <input 
            type='file' 
            name='picture' 
            onChange={handleFileChange} 
          /><br />
          
          <button type='submit'>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Addbook;
