import React, { useEffect, useState } from 'react'
import './body.css'
const Body = (prop) => {
    const [userdata, setUserdata] = useState([])
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
                console.log(res);

                setUserdata(res); // Update state with fetched data
                console.log("hiii");
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

    return (
        <div className='allDisplayedBooks'>
            {prop.id && 
                userdata.map((key, value) => (< div key={key} className='book'>
                    <>
                <p> Book Name: {key['book_name']}</p>
                <img src={key['picture']} className='image'/>
                <p> <span>by</span> {key['author_name']}</p>
                <p> Rs: {key['price']}</p>
                </>

                {console.log("hiawjwfjdj")}
            </div>))}

        </div >
    )
}

export default Body
