import React from 'react'
import { useState } from 'react'
// import "./signinup.css";
import Header from './Header'
import Addbook from './Addbook'
import "./home.css"
const Home = () => {
    const [status, setStatus] = useState(false)
    return (
        <div className='homeContainer'>
            <Header setStatus={setStatus} /> <br></br>
            <div className='body'>{status && <Addbook />}
            nb
        </div>
    </div>
    )
}

export default Home