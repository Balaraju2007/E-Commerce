import React from 'react'
import { useState } from 'react'
import Header from '../homepage/Header'
import "../homepage/home.css"
import "./home.css"

const Addbook = () => {
    const [status, setStatus] = useState(false)
    return (
        <div className='homeContainer'>
            <div className='addBook'><h2>Add Book</h2>
                <form>
                    <input type='text' placeholder='Enter Book Name'></input> <br></br>
                    <input type='text' placeholder='Enter Book Price'></input> <br></br>
                    <input type='file' placeholder='Enter image'></input> <br></br>
                    <button>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Addbook