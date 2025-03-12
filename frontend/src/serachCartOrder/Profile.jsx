import Header from '../homepage/Header';
import "../homepage/home.css";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/users/7")
            .then((response) => {
                setUser(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Failed to load user data");
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (


        <div className='homeContainer'>
            <Header />
            <div style={styles.container}>
                <img src={user.profile_image} alt="Profile" style={styles.profileImage} />
                <h2>{user.full_name}</h2>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Contact:</strong> {user.contact_number}</p>
            </div>
        </div >
    );
};

const styles = {
    container: {
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        textAlign: "center",
        border: "1px solid #ddd",
        borderRadius: "10px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    },
    profileImage: {
        width: "100px",
        height: "100px",
        borderRadius: "50%",
        objectFit: "cover",
        marginBottom: "10px",
    },
};

export default Profile;
