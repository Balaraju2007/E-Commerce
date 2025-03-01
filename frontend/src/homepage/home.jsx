import React, { useEffect } from 'react'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Addbook from './Addbook'
import "./home.css"

const Body = (prop) => {
    return (
        <div>
            {prop.id&&<p>{prop.id}</p>}
            </div>
    )
}


const Home = () => {
    const aq = useLocation();
    const [userData, setUserData] = useState({})
    const c = aq.state
    console.log(c)
    useEffect(async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/users/${c.id}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                },
                // body: JSON.stringify({ "email": user['email'], "password": user["pass"] })
            })
            let res = await response.json()
            console.log(res)
            setUserData(await res)
            console.log("hiii")
            // setCheck(true)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            // console.log(userData)
        }
    }, [])
    const [status, setStatus] = useState(false)
    return (
        <div className='homeContainer'>
            <Header setStatus={setStatus} profile={userData.profile_image}/> <br></br>
            <div className='body'>{status && <Addbook />}
                <Body id={userData.user_id}/>

            </div>
        </div>
    )
}

export default Home
