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
import BookDetails from './singleBookDetails/singleBookDetails';
import { AppProvider } from './homepage/AppContext';
import Addbook from './homepage/Addbook'
import NotificationPage from './assets/orderNotifications/orderNotifications';
import OrderSummary from './orderSummary/orderSummary';
import OrderDetails from './serachCartOrder/OrderDetails';

function App() {
  return (
    <AppProvider>
      <Router>
        {/* <Header />  */}
        <Routes>
          <Route path='/' element={<Welcomapage />} />
          <Route path='/signup' element={<Registration />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/home' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<Order />} >
          </Route>
          <Route path='/orderDetails/:id' element={<OrderDetails />} />
          <Route path='/addbook' element={<Addbook />} />
          <Route path='/search' element={<Search />} />
          <Route path='/profile/:id' element={<Profile />} />
          <Route path='/singleBookDetails/:id' element={<BookDetails />} />
          <Route path='/orderNotifications' element={<NotificationPage />} />
          <Route path='/orderSummary' element={<OrderSummary />} />
        </Routes>

      </Router>
    </AppProvider>

  )
}

export default App
