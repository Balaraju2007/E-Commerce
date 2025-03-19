import React from 'react';
//import './Notification.css';  // For CSS styling

const Notification = ({ notification }) => {
    const { message, created_at, is_read } = notification;

    const status = is_read ? "Read" : "Unread";
    const statusClass = is_read ? "read" : "unread";
    
    return (
        <div className={`notification ${statusClass}`}>
            <div className="notification-header">
                <strong>{message.split("\n")[0]}</strong> <span className="status">{status}</span>
            </div>
            <div className="notification-body">
                <p>{message}</p>
            </div>
            <div className="notification-footer">
                <span>Created At: {new Date(created_at).toLocaleString()}</span>
            </div>
        </div>
    );
};

export default Notification;
