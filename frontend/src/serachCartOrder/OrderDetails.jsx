import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Header from '../homepage/Header';
import "./orderDetails.css";

const OrderDetails = () => {
//   const location = useLocation();  // Get state passed from the previous page
  const [orderData, setOrderData] = useState(null);
  const {id }= useParams();

  useEffect(() => {
    // If no state is passed, we can assume we need to fetch order data from the backend

      // Fetch the order details from the API using the order_id
      const fetchOrderDetails = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/orders/details/${id}`);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setOrderData(data); // Store the fetched order data
        } catch (error) {
          console.error('Error fetching order details:', error);
        }
      };

      fetchOrderDetails();
  }, [id]);  // This will run whenever the location state changes

  return (
    <div className="order-details-container">
  <Header />
  {orderData ? (
    <div className="order-details-order-details">
      <h2 className="order-details-h2">Order Details</h2>
      <p><strong>Order ID:</strong> {orderData.order_id}</p>
      <p><strong>Order Date:</strong> {new Date(orderData.order_date).toLocaleString()}</p>
      <p><strong>Total Price:</strong> ₹{orderData.total_price}</p>
      <h3>Order Items:</h3>
      {orderData.order_items && orderData.order_items.length > 0 ? (
        <div className="order-details-order-items">
          {orderData.order_items.map((item, index) => (
            <div key={index} className="order-details-order-item">
              <div className="order-details-book-image">
                <img src={item.book_details.picture} alt={item.book_details.book_name} />
              </div>
              <div className="order-details-text">
                <p><strong>Book Name:</strong> {item.book_details.book_name}</p>
                <p><strong>Author:</strong> {item.book_details.author_name}</p>
                <p><strong>Price:</strong> ₹{item.book_details.price}</p>
                <p><strong>Quantity:</strong> {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No items found in this order.</p>
      )}
    </div>
  ) : (
    <p>Loading order details...</p>
  )}
</div>

  );
};

export default OrderDetails;
