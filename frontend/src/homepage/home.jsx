import React from 'react'
import { useState } from 'react'
// import "./signinup.css";
import Header from './Header'
import "./home.css"
const Home = () => {
    const [status, setStatus] = useState(false)
    return (
        <div className='homeContainer'>
            <Header setStatus={setStatus} /> <br></br>
            <div className='body'>{status && <div className='addBook'><h2>Add Book</h2>
                <form>
                    <input type='text' placeholder='Enter Book Name'></input> <br></br>
                    <input type='text' placeholder='Enter Book Price'></input> <br></br>
                    <input type='file' placeholder='Enter image'></input> <br></br>
                    <button>Submit</button>
                </form>
            </div>}
            nbjbb
        </div>
    </div>
    )
}

export default Home