import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './body.css'
const Body = (prop) => {
    const [userdata, setUserdata] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        // Define the async function inside useEffect
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/books/', {
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                    },
                });

                // Handle the response
                const res = await response.json();
                console.log("hiiixxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
                console.log(res);

                setUserdata(res); // Update state with fetched data
                
            } catch (error) {
                console.log(error);
            } finally {
                ;
                // You can add cleanup or other final steps here if needed
            }
        };

        // Call the async function
        fetchUserData();
    }, []);

    const Navigate = (e) => {
        navigate(`/singleBookDetails/${e}`)
    }

    return (
        <div className='allDisplayedBooks'>
            {prop.id && 
               userdata.map((key) => (
                <div key={key.book_id} className='book' onClick={() => Navigate(key.book_id)}>
                    <div><p>{key.seller_name}</p></div>
                    <p>Book Name: {key.book_name}</p>
                    <img src={key.picture} className='image' alt={key.book_name} />
                    <p><span>by</span> {key.author_name}</p>
                    <p>Rs: {key.price}</p>
                </div>
            ))}
            

        </div >
    )
}

export default Body
