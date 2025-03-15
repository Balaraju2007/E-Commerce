import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Body from './Body';
import './home.css';

const Home = () => {
  const [userData, setUserData] = useState(null);  // Local state to store user data
  const navigate = useNavigate();  // Hook for navigation

  useEffect(() => {
    // Retrieve access_token and user_id from localStorage
    const accessToken = localStorage.getItem('access_token');
    const userId = localStorage.getItem('user_id');
    const users = localStorage.getItem('user')
    console.log('ffffffffffffffffffffffff')
    console.log(users)
    console.log(userId)
    if (!accessToken || !userId) {
      // If no access token or user ID, redirect to signin page
      navigate('/signin');
    } else {
      // If access token and user ID are found, fetch user data
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
            method: 'GET',
            headers: {
              'Content-type': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
          });

          const res = await response.json();
          setUserData(res); // Update user data state
        } catch (error) {
          console.error('Error fetching user data:', error);
          navigate('/signin');  // Redirect to signin if error occurs
        }
      };

      fetchUserData();
    }
  }, [navigate]);  // Only run once when the component mounts

  return (
    <div className="Container">
      <Header />
      <br />
      <div className="body">
        {userData ? <Body id={userData.user_id} /> : <p>Loading user data...</p>}
      </div>
    </div>
  );
};

export default Home;
