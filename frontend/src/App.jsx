// import './App.css'
import Registration from './loginPages/Registration'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signin from './loginPages/Signin'
import Welcomapage from './loginPages/Welcompage'
import Home from './homepage/home'
import Cart from './serachCartOrder/Cart';
import Order from './serachCartOrder/Order'
import Search from './serachCartOrder/Search';
import Profile from './serachCartOrder/Profile';
function App() {
  return (

    <Router>
      <Routes>
        <Route path='/' element={<Welcomapage />} />
        <Route path='/signup' element={<Registration />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/home' element={<Home />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={<Order />} />
        <Route path='/search' element={<Search />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>

    </Router>


  )
}

export default App
