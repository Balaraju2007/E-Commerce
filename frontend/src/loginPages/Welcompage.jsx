import React from 'react'
import { useState } from 'react'
import "./registration.css";

const Header = () => {
    return (
        <header className='header'>
            <div className='bookname'>
                <img src="cn" /> <h2 className='websitename'>Bookswap</h2>
            </div>
            <div className='signinup'>
                <p>Contact us</p>
                <p style={{ color: 'blue',}}>Sign in</p>
                <p>Sign up</p>
            </div>
        </header>
    )
}

const Body = () => {
    return(
        <div className='container'>
            <div className='content'><h1>Find & Sell Old <br></br>Semester Books Easily!</h1><br></br>
            <p>Buy books at low prices and sell your used books effortlessly</p><br></br>
            <p style={{ backgroundColor: 'blue', fontSize: '20px', display: 'inline', padding: '10px', borderRadius: '10px'}}>Get Started</p></div>
            <div className='image'><img className="welcomePageImage"src="jrff">
            </img></div>
        </div>
    )
}

const Footer = () => {
    return (
        <footer style={{ textAlign: 'center', fontSize: '20px'}}>
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