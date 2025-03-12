import { useState, useEffect } from "react";
import "./orderNotifications.css";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Mock API call (Replace this with an actual API request)
    const fetchNotifications = async () => {
      const mockData = [
        {
          message: "New Order Received!",
          type: "success",
          orderDetails: {
            orderId: "#A1001",
            customerName: "Alice Brown",
            items: [
              { name: "Smartphone", quantity: 1 },
              { name: "Wireless Charger", quantity: 1 }
            ],
            totalAmount: "$899",
            imageUrl: "https://via.placeholder.com/100"
          }
        },
        {
          message: "New Order Received!",
          type: "success",
          orderDetails: {
            orderId: "#A1002",
            customerName: "Bob Williams",
            items: [
              { name: "Gaming Monitor", quantity: 1 },
              { name: "Mechanical Keyboard", quantity: 1 }
            ],
            totalAmount: "$450",
            imageUrl: "https://via.placeholder.com/100"
          }
        }
      ];
      setNotifications(mockData);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notification-container">
      <h2 className="notification-header">
        Order Notifications
      </h2>
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div key={index} className="notification-card">
            <div className="notification-details">
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <p className="notification-text">Order ID: <span>{notification.orderDetails.orderId}</span></p>
                <p className="notification-text">Customer: <span>{notification.orderDetails.customerName}</span></p>
                <p className="notification-text">Items:</p>
                <ul className="notification-items">
                  {notification.orderDetails.items.map((item, i) => (
                    <li key={i}>{item.name} <span>(x{item.quantity})</span></li>
                  ))}
                </ul>
                <p className="notification-total">Total: {notification.orderDetails.totalAmount}</p>
              </div>
            </div>
            <img src={notification.orderDetails.imageUrl} alt="Order" className="notification-image" />
          </div>
        ))
      ) : (
        <p className="notification-empty">No new orders.</p>
      )}
    </div>
  );
};

export default NotificationPage;
