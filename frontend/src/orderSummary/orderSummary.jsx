import React from "react";
import "./orderSummary.css";

const OrderSummary = ({ order }) => {
  return (
    <div className="order-summary-container">
      <h2 className="order-title">Order Summary</h2>
      <div className="order-details">
        <p><strong>Order ID:</strong> {order.order_id}</p>
        <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
        <p><strong>Total Price:</strong> ${order.total_price}</p>
      </div>
      <h3 className="order-items-title">Order Items</h3>
      <div className="order-items">
        {order.order_items.map((item, index) => (
          <div key={index} className="order-item">
            <img 
              src={item.book_details.picture} 
              alt={item.book_details.book_name} 
              className="order-item-image" 
            />
            <div className="order-item-details">
              <p className="book-name">{item.book_details.book_name}</p>
              <p><strong>Author:</strong> {item.book_details.author_name}</p>
              <p><strong>Seller:</strong> {item.book_details.seller_name}</p>
              <p><strong>Publisher:</strong> {item.book_details.publisher_name}</p>
              <p><strong>Genre:</strong> {item.book_details.genre_name}</p>
              <p><strong>Price:</strong> ${item.book_details.price}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="checkout-button">Proceed to Checkout</button>
    </div>
  );
};

// Sample usage
const sampleOrder = {
  "order_id": 1,
  "order_date": "2025-03-10T14:31:33.629910",
  "total_price": 90,
  "order_items": [
    {
      "quantity": 1,
      "book_details": {
        "book_name": "c programming",
        "seller_name": "kuladeep",
        "author_name": "string",
        "price": 90,
        "genre_name": "string",
        "publisher_name": "string",
        "picture": "http://127.0.0.1:8000/uploads/books/c_programming.jpg"
      }
    }
  ]
};

export default function App() {
  return (
    <div className="app-container">
      <OrderSummary order={sampleOrder} />
    </div>
  );
}