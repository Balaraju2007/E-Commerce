import React from 'react'
import { useState } from 'react'
import "./registration.css";

const Signin = () => {
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
        <>
            <form className='form' onSubmit={call}>
                <div className='form'>
                    <div className='username'><label>UserName rfnk: </label><input type='text' onChange={handleName} required /> </div>
                    <div className='passsword'><label>Password : </label><input type='text' onChange={handlePass} required /> </div>
                    <div className='email'><label>Emailjjjjjjjjjjjjjjj11111111111111111111 : </label><input type='emmail' onChange={handlePass} required /> </div>
                    <button type='submit' >submit</button>
                </div>
            </form>
        </>
    )
}

export default Signin