import React from 'react'
import { useState } from 'react'
import "./registration.css";
import { useNavigate } from 'react-router-dom'
const Header = () => {
    const navigate = useNavigate();
    return (
        <header className='header'>
            <div className='bookname'>
                <svg style={{ color: 'blueviolet', margin: 'auto' }} xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-book-fill" viewBox="0 0 16 16">
                    <path d="M8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                </svg>
                <h2 className='websitename'>Bookswap</h2>
            </div>
            <div className='signinup'>
                <p>Contact us</p>
                <p style={{ color: 'blue', cursor: 'pointer'}} onClick={()=>{navigate("/signin")}}>Sign in</p>
                <p onClick={()=>{navigate("/signup")}} style={{cursor: 'pointer'}}>Sign up</p>
            </div>
        </header>
    )
}

const Body = () => {
    const navigate = useNavigate();
    const navigatee = () => {
        navigate('/home');
    }
    return (
        <div className='container'>
            <div className='content'><h1>Find & Sell Old <br></br>Semester Books Easily!</h1><br></br>
                <p>Buy books at low prices and sell your used books effortlessly</p><br></br>
                <p style={{ backgroundColor: 'royalblue', color: 'white', fontSize: '20px', display: 'inline', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}
                    onClick={navigatee}>Get Started</p></div>
            {/* <div className='image'> */}
            <img className=" welcomePageImage" src="../public/assets/cover_image.svg">
            </img>
            {/* </div> */}
        </div>
    )
}

const Footer = () => {
    return (
        <footer style={{ textAlign: 'center', fontSize: '20px', marginTop: '-35px', backgroundColor: 'white', padding: '10px' }}>
            if you have anything conatct us +91 xxxxx xxxxx
        </footer>
    )
}
const Welcomapage = () => {

    return (
        <>
            <div className='bodypart'>
                <Header />
                <Body />
                <Footer />
            </div>
        </>
    )
}

export default Welcomapage