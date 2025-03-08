import React, { useEffect } from 'react';
import { useAppContext } from './AppContext'; // Custom hook to access context
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Addbook from './Addbook';
import Body from './Body';
import './home.css';

const Home = () => {
  const location = useLocation();
  const { userData, setUserData } = useAppContext(); // Access userData from context and setter
  const c = location.state;  // Access state passed from the previous page

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/users/${c.id}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        });

        const res = await response.json();
        setUserData(res); // Set the userData globally using context
      } catch (error) {
        console.log(error);
      }
    };

    if (c?.id) {
      fetchUserData();
    }
  }, [c.id, setUserData]);  // Re-run when `c.id` changes

  return (
    <div className='homeContainer'>
      <Header /> {/* Header can now use userData from context */}
      <br />
      <div className='body'>
        {userData && <Body id={userData.user_id} />}
      </div>
    </div>
  );
};

export default Home;
