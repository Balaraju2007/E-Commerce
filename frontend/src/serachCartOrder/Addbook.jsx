import React, { useEffect, useState } from 'react'; 
import { useAppContext } from '../homepage/AppContext';  // Import the custom hook
import Header from '../homepage/Header';
import Addbook from '../homepage/Addbook';
import "../homepage/home.css";

const Order = () => {
  
  return (
    <div className='homeContainer'>
      <Header />
    </div>
  );
};

export default Order;
