
const response = await fetch(`http://127.0.0.1:8000/notification/${localStorage.getItem('user_id')}`);


import { useState, useEffect } from "react";
import "./orderNotifications.css";
import Header from "../../homepage/Header";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/notification/${localStorage.getItem('user_id')}`);

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();
        setNotifications(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // Function to parse the message and extract relevant details
  const parseMessage = (message) => {
    const regex = /Customer: (.*) \((.*)\)\s*Order ID: (\d+)\s*Book: (.*) x (\d+)\s*Price: (\d+\.\d{2}) per unit\s*Total Price: (\d+\.\d{2})/;
    const match = message.match(regex);
    if (match) {
      return {
        customerName: match[1],
        customerEmail: match[2],
        orderId: match[3],
        book: match[4],
        quantity: match[5],
        pricePerUnit: match[6],
        totalPrice: match[7],
      };
    }
    return {};
  };

  if (loading) {
    return <p>Loading notifications...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (<>
    <Header/> &&
    <div className="notification-container">
      <h2 className="notification-header">Order Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => {
          const details = parseMessage(notification.message);
          return (
            <div key={index} className="notification-card">
              <div className="notification-details">
                <div className="notification-content">
                  <p className="notification-message">{notification.message}</p>
                  <p className="notification-text">
                    Order ID: <span>{details.orderId}</span>
                  </p>
                  <p className="notification-text">
                    Customer: <span>{details.customerName}</span> ({details.customerEmail})
                  </p>
                  <p className="notification-text">Book: <span>{details.book}</span> (x{details.quantity})</p>
                  <p className="notification-text">Price per unit: <span>{details.pricePerUnit}</span></p>
                  <p className="notification-text">Total Price: <span>{details.totalPrice}</span></p>
                  <p className="notification-date">
                    Order Date: <span>{new Date(notification.created_at).toLocaleString()}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <p className="notification-empty">No new orders.</p>
      )}
    </div>
    </>
  );
};

export default NotificationPage;
