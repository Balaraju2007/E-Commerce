import React, { useEffect, useState } from 'react';
import { useAppContext } from '../homepage/AppContext';
import Header from '../homepage/Header';
// import "../homepage/home.css";
import './orderDetails.css'
import { Navigate, useNavigate } from 'react-router-dom';
import './order.css'

const Order = () => {
  const userData = localStorage.getItem('user_id');
  const [orders, setOrders] = useState([]); // ✅ Store orders properly
  const [status, setStatus] = useState(false); // ✅ Set to true after fetching data
  const navigate = useNavigate()

  useEffect(() => {
    if (userData && userData) {
      const fetchOrders = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/orders/${userData}`);

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json(); // ✅ Parse response
          console.log("📦 Fetched Orders:", data); // ✅ Debugging
          setOrders(data);  // ✅ Update correct state
          setStatus(true);  // ✅ Ensure status is updated
        } catch (error) {
          console.error("❌ Error fetching orders:", error);
        }
      };

      fetchOrders();
    }
  }, []); // Runs when userData changes

  const nnavigate = (value) => {
    navigate(`/orderDetails/${value}`)
  }

  const handleDeleteOrder = async (e, i_id) => {
    e.stopPropagation(); // Prevent propagation
    console.log("Attempting to delete order with ID:", i_id); // Log the order ID

    if (!i_id) {
      alert("Invalid order ID");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/orders/${i_id}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the order');
      }

      const res = await response.json();
      console.log("Order deleted:", res);

      // Remove the deleted order from state
      setOrders((prevOrders) => prevOrders.filter(order => order.order_id !== i_id));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  return (<> <Header />
    <div className='homeContainer'>

      <h2>📦 My Orders</h2>
      <div className='orderContainer'>
        {orders.map((order, index) => (
          <div key={order.order_id} onClick={() => nnavigate(order.order_id)} className='order'>
            <svg
              className="Svg"
              onClick={(e) => { handleDeleteOrder(e, order.order_id) }} // Ensure we're passing the correct order_id
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-trash"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
            </svg>
            <p><strong>Order No:</strong> {index+=1}</p>
            <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
          </div>
        ))}
        </div>
      </div>
    </>
    );
};

    export default Order;
