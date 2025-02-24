import React from 'react'
import { useState } from 'react'
import "./signinup.css";

const Registration = () => {
    const [count, setCount] = useState(0)
    const [user, setUser] = useState(null)
    const [pass, setPass] = useState(null)

    const handleName = (event) => {
        setUser(event.target.value)
    }

    const handlePass = (event) => {
        setPass(event.target.value)
    }

    const call = async (event) => {
        event.preventDefault(); // Prevents page reload
        try {
            const response = await fetch('http://127.0.0.1:8000/login/', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({ username: user, password: pass })
            })
            let res = await response.json()
            console.log(res)
        }
        catch (error) {
            console.log(error)
        }
        
    }
    return (
        <div className='sigupContainer'>
            <div className='loginInformation'>
                <h1>Sign in to </h1>
                <h2>Old book Seller</h2> <br></br>
                <p style={{fontSize:"13px"}}>If you already have an account <br>
                </br> you can <span style={{color:"blue",cursor: 'pointer'}}>login here!</span></p>
            </div>
            <div className='signupFieldss'>
                <h2 style={{fontSize: '1.6rem'}}>Sign in</h2> <br></br>
                <form className='form' onSubmit={call}>
                    <div className='form'>
                        <div className='username'><input type='text' onChange={handleName} required placeholder='---userName or Email---' /> </div>
                        <div className='passsword'><input type='password' onChange={handlePass} required placeholder='---password---'/> </div>
                        <p style={{fontSize:'80%',color:'rgba(168, 60, 60, 0.523)', cursor: 'pointer'}}>Forget password?</p>

                        <button type='submit' className='button'>submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Registration