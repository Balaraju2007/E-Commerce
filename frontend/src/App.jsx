import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [user, setUser] = useState(null)
  const [pass, setPass] = useState(null)

  const handleName = (event) => {
    setUser(event.target.value)
  }

  const handlePass = (event) => {
    setPass(event.target.value)
  }

  const call = async (event) =>{
    event.preventDefault(); // Prevents page reload
    try{
    const response = await fetch('http://127.0.0.1:8000/api/submissions/',{
      method: 'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify({username:user, password:pass})
    })
    const result = await response.json()
    console.log(result)
  }
  catch(error){
    console.log(error)
  }
  }
  return (
    <>
      <form onSubmit={call}>
        <input type='text' onChange={handleName} />
        <input type='text' onChange={handlePass} />
        <button type='submit' >submit</button>
      </form>
    </>
  )
}

export default App
