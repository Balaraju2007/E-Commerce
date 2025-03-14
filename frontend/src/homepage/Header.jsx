import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBookData } from '../serachCartOrder/BookDataContext'; // Import the custom hook
import './header.css';

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

  return (
    <div className='HeaderContainer'>
      <div className='nameSearch'>
        <h2
          style={{ marginTop: '6%', fontSize: '2rem', fontWeight: 'inherit' }}
          onClick={() => {
            navigate('/home');
          }}
        >
          Book Bazaar
        </h2>
        <h2 className='Input svg'>
          <input
            value={query}
            onChange={handleSearch}
            onClick={() => {
              navigate('/search');
            }}
            placeholder='--Search---'
          />
        </h2>
      </div>

      <div className='profileCartOrder'>
        <h2 className='svg'>
          <svg
            onClick={() => {
              navigate('/cart');
            }}
            xmlns='http://www.w3.org/2000/svg'
            width='25'
            height='25'
            fill='currentColor'
            className='bi bi-cart'
            viewBox='0 0 16 16'
          >
            <path d='M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2' />
          </svg>
        </h2>
        <h2 className='svg'>
          <svg
            onClick={() => {
              navigate('/order');
            }}
            xmlns='http://www.w3.org/2000/svg'
            width='25'
            height='25'
            fill='currentColor'
            className='bi bi-bag'
            viewBox='0 0 16 16'
          >
            <path d='M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z' />
          </svg>
        </h2>
        <h2 className='svg' onClick={() => { navigate('/addbook') }}>
          <svg xmlns='http://www.w3.org/2000/svg' width='25' height='25' fill='currentColor' className='bi bi-plus-circle' viewBox='0 0 16 16'>
            <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16' />
            <path d='M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4' />
          </svg>
        </h2>
        <h2 className='profile'>
          {profile ? (
            <img
              src={profile}
              onClick={() => {
                navigate(`/profile/${localStorage.getItem('user_id')}`);
              }}
              className='svg'
              alt='Profile'
            />
          ) : (
            <span>No Profile</span>
          )}
        </h2>
      </div>
    </div>
  );
};

export default Header;
