import React from 'react'
import { useState } from 'react'
import Header from '../homepage/Header'
import "../homepage/home.css"

const Search = () => {
    const [status, setStatus] = useState(false)
    return (
        <div className='homeContainer'>
            <Header setStatus={setStatus} />
            {status && <Addbook />}
jkbbjkb
        </div>
    )
}

export default Search