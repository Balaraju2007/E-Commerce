import React from 'react'
import { useState } from 'react'
import Header from './Header'
import Addbook from './Addbook'
import "./home.css"

const Body = () => {
    const a = [{name: 'react js', }]
    return (
        <div>

        </div>
    )
}


const Home = () => {
    const [status, setStatus] = useState(false)
    return (
        <div className='homeContainer'>
            <Header setStatus={setStatus} /> <br></br>
            <div className='body'>{status && <Addbook />}
            <Body />
        </div>
    </div>
    )
}

export default Home
