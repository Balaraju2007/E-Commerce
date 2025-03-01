import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./signinup.css";

const Registration = () => {
    const [check, setCheck] = useState(false)
    const [user, setUser] = useState({ name: '', pass: '', email: '', profile: '', number: 0 })
    // const [pass, setPass] = useState(null)
    // const [email, setEmail] = useState(null)
    // const [number, setNumber] = useState(null)
    // const [profile, setProfile] = useState(null)
    const [confirmPasss, setConfirm] = useState()
    const navigate = useNavigate();

    const handleName = (event) => {
        setUser({ ...user, name: event.target.value });
    };

    const handlePass = (event) => {
        setUser({ ...user, pass: event.target.value });
    };

    const handleEmail = (event) => {
        setUser({ ...user, email: event.target.value });
    };

    const handleNumber = (event) => {
        setUser({ ...user, number: parseInt(event.target.value) });
    };

    const handleProfile = (event) => {
        setUser({ ...user, profile: event.target.files[0] }); // Save the file object
    };
    const handleConfirmPass = (event) => {
        setConfirm(event.target.value)
    }
    const call = async (event) => {
        event.preventDefault(); // Prevents page reload
        if (confirmPasss === user.pass) {
            const formData = new FormData();
            formData.append('full_name', user.name);
            formData.append('password', user.pass);
            formData.append('email', user.email);
            formData.append('contact_number', user.number);
            formData.append('profile_image', user.profile)

            console.log(formData)
            try {
                const response = await fetch('http://127.0.0.1:8000/users/', {
                    method: 'POST',
                    body: formData
                })
                const result = await response.json()
                console.log(result)
                navigate("/signin")
            }
            catch (error) {
                console.log(error)
            }
            setCheck(false)
          
        } else {
            setCheck(true)
            // alert("pass not match")
        }
    }
    return (
        <div className='sigupContainer'>
            <div className='loginInformation1'>
                <h1>Sign up to </h1>
                <h2>Old book Seller</h2> <br></br>
                <p style={{ fontSize: "13px" }}>If you already have an account <br>
                </br> you can <span style={{ color: "blue", cursor: 'pointer' }} onClick={() => { navigate("/signin") }}>login here!</span></p>
            </div>
            <div className='signupFieldss1'>
                <h2 style={{ fontSize: '1.9rem' }}>Sign up</h2> <br></br>
                <form className='form' onSubmit={call}>
                    <div className='form'>
                        <div className='username'><input type='text' onChange={handleName} required placeholder='---userName---' /> </div>
                        <div className='email'><input type='emmail' onChange={handleEmail} required placeholder='---Email---' /> </div>
                        <div className='contactNumber'><input type='number' onChange={handleNumber} required placeholder='---contactNumber---' /> </div>
                        <div className='passsword'><input type='password' onChange={handlePass} required placeholder='---password---' /> </div>
                        <div className='confirmPasssword'><input type='password' onChange={handleConfirmPass} required placeholder='---confirm password---' /> <br></br>
                        {check && <p>password not matched</p>}</div>
                        
                        <div className='profile'><input type='file' onChange={handleProfile} required placeholder='---set profile pic---' /> </div>
                        <button type='submit' className='button' onClick={call}>submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Registration