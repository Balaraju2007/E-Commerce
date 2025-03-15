import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookData } from '../serachCartOrder/BookDataContext'; // Import the custom hook
import './header.css';
import { FiSearch } from 'react-icons/fi';

const Header = () => {
  const [query, setQuery] = useState('');
  const { setBookData } = useBookData(); // Access the setBookData function from context
  const profile = localStorage.getItem('profile');
  const navigate = useNavigate();

  useEffect(() => {
    if (query) {
      const fetchBookData = async () => {
        try {
          const encodedQuery = encodeURIComponent(query);
          const response = await fetch(`http://127.0.0.1:8000/search?query=${encodedQuery}`, {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('No books found');
          }

          const res = await response.json();
          console.log("Book data:", res);

          if (res.detail) {
            setBookData([]); // Clear the book data if no books found
          } else {
            setBookData(res); // Update the book data in the global state
          }
        } catch (error) {
          console.log(error);
          setBookData([]); // Reset the book data if there's an error
        }
      };
      fetchBookData();
    }
  }, [query, setBookData]); // Added setBookData as a dependency

  const handleSearch = (e) => {
    setQuery(e.target.value);
  };

  return(
        <header className="header">
        <h1 className="title"
        onClick={() => {
                navigate('/home');
                   }}>E-Commerce</h1>
        <div className="search-bar">
          <input type="text"  onChange={{handleSearch}} placeholder="Search for books..." className="search-input" />
          <button className="search-button">
            <FiSearch className="search-icon" onClick={() => {
               navigate('/search');
             }} />
          </button>
        </div>
        <div className="icons">
          <i className="bi bi-plus-circle icon" title="Add Book"onClick={() => { navigate('/addbook') }}></i>
          <i className="bi bi-list icon" title="My Orders"
          onClick={() => {
                         navigate('/order');
                       }}></i>
          <i className="bi bi-cart icon" title="Cart"
          onClick={() => {
                         navigate('/cart');
                       }}></i>
          <i>{profile ? (
             <img
               src={profile}
              onClick={() => {
                 navigate(`/profile/${localStorage.getItem('user_id')}`);
               }}
               className='profile-icon'
               alt='Profile'
            />
           ) : (
            <i className="bi bi-person icon" title="Profile"></i>
           )} </i>
        </div>
      </header>
  );
};

export default Header;
