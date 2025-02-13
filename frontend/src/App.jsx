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

  const call = async () =>{
    try{
    const response = await fetch('http://120.0.0.1:8000/hello',{
      method: 'POST',
      headers:{
        'Content-type':'application/json'
      },
      body:JSON.stringify({'name':user, 'pass':pass})
    })
    const result = response.json()
    console.log(result)
  }
  catch(error){
    console.log(error)
  }
  }
  return (
    <>
      <form>
        <input type='text' onChange={handleName} />
        <input type='text' onChange={handlePass} />
        <button onClick={call}>submit</button>
      </form>
    </>
  )
}

export default App
