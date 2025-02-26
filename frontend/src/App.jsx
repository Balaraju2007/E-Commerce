// import './App.css'
import Registration from './loginPages/Registration'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './loginPages/Signin'
import Welcomapage from './loginPages/Welcompage'
import Home from './homepage/Home'
import Cart from './serachCartOrder/Cart';
function App() {
  return (



    <Router>
      <Routes>
        <Route path='/' element={<Welcomapage />} />
        <Route path='/signup' element={<Registration />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/home' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
      </Routes>

    </Router>


  )
}

export default App
