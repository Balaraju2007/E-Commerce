import React from 'react'
import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import "./signinup.css";

const Registration = () => {
    const [count, setCount] = useState(0)
    const [user, setUser] = useState(null)
    const [pass, setPass] = useState(null)
    const navigate = useNavigate();

    const handleName = (event) => {
        setUser(event.target.value)
    }

    const handlePass = (event) => {
        setPass(event.target.value)
    }

    const call = async (event) => {
        event.preventDefault(); // Prevents page reload
        try {
            const response = await fetch('http://127.0.0.1:8000/api/submissions/', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ username: user, password: pass })
            })
            const result = await response.json()
            console.log(result)
        }
        catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='sigupContainer'>
            <div className='loginInformation1'>
                <h1>Sign up to </h1>
                <h2>Old book Seller</h2> <br></br>
                <p style={{fontSize:"13px"}}>If you already have an account <br>
                </br> you can <span  style={{color:"blue",cursor: 'pointer'}} onClick={()=>{navigate("/signin")}}>login here!</span></p>
            </div>
            <div className='signupFieldss1'>
                <h2 style={{fontSize: '1.9rem'}}>Sign up</h2> <br></br>
                <form className='form' onSubmit={call}>
                    <div className='form'>
                        <div className='username'><input type='text' onChange={handleName} required placeholder='---userName---' /> </div>
                        <div className='email'><input type='emmail' onChange={handlePass} required placeholder='---Email---'/> </div>
                        <div className='contactNumber'><input type='number' onChange={handlePass} required placeholder='---contactNumber---'/> </div> 
                        <div className='passsword'><input type='password' onChange={handlePass} required placeholder='---password---'/> </div>
                        <div className='confirmPasssword'><input type='password' onChange={handlePass} required placeholder='---confirm password---'/> </div>
                        <div className='profile'><input type='file' onChange={handlePass} required placeholder='---set profile pic---'/> </div>
                        <button type='submit' className='button' onClick={()=>{navigate('/home')}}>submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Registration