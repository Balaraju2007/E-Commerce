import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Addbook from './Addbook'
import "./home.css"
import Body from './Body'



const Home = () => {
  const aq = useLocation();
  const [userData, setUserData] = useState({})
  const c = aq.state
  console.log(c)
  useEffect(() => {
    // Define the async function inside useEffect
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/users/${c.id}`, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        });

        // Handle the response
        const res = await response.json();
        console.log(res);

        setUserData(res); // Update state with fetched data
        console.log("hiii");
      } catch (error) {
        console.log(error);
      } finally {
        // You can add cleanup or other final steps here if needed
      }
    };

    // Call the async function
    fetchUserData();
  }, [c.id]);
  const [status, setStatus] = useState(false)
  return (
    <div className='homeContainer'>
      <Header setStatus={setStatus} profile={userData.profile_image} /> <br></br>
      <div className='body'>{status && <Addbook />}
        <Body id={userData.user_id} />

      </div>
    </div>
  )
}

export default Home
