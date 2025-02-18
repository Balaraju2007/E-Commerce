// import './App.css'
import Registration from './loginPages/Registration'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './loginPages/Signin'
import Welcomapage from './loginPages/Welcompage'
function App() {
  return (



    <Router>
      <Routes>
        <Route path='/' element={<Welcomapage />} />
        <Route path='/signup' element={<Registration />} />
        <Route path='/signin' element={<Signin />} />
      </Routes>

    </Router>


  )
}

export default App
