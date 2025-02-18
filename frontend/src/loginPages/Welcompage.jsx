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
                <p>Sign in</p>
                <p>Sign up</p>
            </div>
        </header>
    )
}
const Welcomapage = () => {

    return (
        <>
            <div className='bodypart'>
                <Header />
                {/* <Body /> */}<div>balaaaaaaaa</div>
            </div>
        </>
    )
}

export default Welcomapage