import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    return (
        <header className='header'
        style={
            {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px',
                backgroundColor: 'white',
                width: '100%',
                position: 'fixed',
                top: 0,
            }
        }>
            <div className='bookname'
                style={
                    {
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                    }
                }>
                <svg style={{ color: 'blueviolet', margin: 'auto' }} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-book-fill" viewBox="0 0 16 16">
                    <path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                </svg>
                <h1 className='websitename'
                style={{
                    marginTop: '0',
                    marginBottom: '0',
                    marginLeft: '20px',
                    color: 'blueviolet',
                    margin: 'auto',
                    cursor: 'pointer'
                }}>Bookswap</h1>
            </div>
            <div className='signinup'
                style={
                    {
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                    }
                }>
                <p>Contact us</p>
                <p style={{ color: 'blue', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate("/signin")}>Sign in</p>
                <p style={{ cursor: 'pointer', fontWeight: 'bold' }} onClick={() => navigate("/signup")}>Sign up</p>
            </div>
        </header>
    );
};

const Body = () => {
    const navigate = useNavigate();
    
    return (
        <div className='container' style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            minWidth: '140vh', 
            paddingRight: '15%',
            paddingLeft: '15%',
            backgroundColor: 'white', 
            padding: '0 5%',
            gap: '2rem'
        }}>
            <div className='content' style={{ flex: 1.5 }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '1.2' }}>Find & Sell Old <br /> Semester Books Easily!</h1>
                <p style={{ fontSize: '1.5rem', marginTop: '1rem', color: '#333' }}>Buy books at low prices and sell your used books effortlessly.</p>
                <button 
                    style={{ 
                        backgroundColor: 'royalblue', 
                        color: 'white', 
                        fontSize: '1.5rem', 
                        padding: '12px 24px', 
                        borderRadius: '10px', 
                        cursor: 'pointer', 
                        marginTop: '1.5rem', 
                        border: 'none' 
                    }} 
                    onClick={() => navigate('/signin')}
                >
                    Get Started
                </button>
            </div>

            <div style={{ flex: 1, textAlign: 'center' }}>
                <img 
                    
                    src="/assets/cover_image.svg" 
                    alt="Welcome" 
                    style={{ 
                        minWidth: '200px', 
                        maxWidth: '700px',  /* Ensures image is big enough */
                        height: 'auto', 
                        objectFit: 'contain',
                        display: 'block'
                    }} 
                />
            </div>
        </div>
    );
};

const Footer = () => {
    return (
        <footer style={{ 
            textAlign: 'center', 
            fontSize: '1.2rem', 
            backgroundColor: 'white', 
            padding: '15px', 
            borderTop: '1px solid #ddd' 
        }}>
            If you have any queries, contact us at +91 xxxxx xxxxx
        </footer>
    );
};

const Welcomapage = () => {
    return (
        <>
            <Header />
            <Body />
            <Footer />
        </>
    );
};

export default Welcomapage;
