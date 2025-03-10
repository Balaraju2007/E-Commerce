import React, { useEffect, useState } from 'react'; 
import { useAppContext } from '../homepage/AppContext';  
import Header from '../homepage/Header';
import "../homepage/home.css";

const Order = () => {
  const { userData } = useAppContext();
  const [orders, setOrders] = useState([]); // ✅ Store orders properly
  const [status, setStatus] = useState(false); // ✅ Set to true after fetching data

  useEffect(() => {
    if (userData && userData.user_id) {
      const fetchOrders = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/orders/${userData.user_id}`);
  
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
  }, [userData]); // Runs when userData changes

  return (
    <div className='homeContainer'>
      <Header />
      <h2>📦 My Orders</h2>
      
      {status && orders.length > 0 ? (
        <div className='allDisplayedBooks'>
          {orders.map((order) => (
            <div key={order.order_id} className='book'>
              <p><strong>Order ID:</strong> {order.order_id}</p>
              <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>🚫 No orders found.</p>
      )}
    </div>
  );
};

export default Order;
