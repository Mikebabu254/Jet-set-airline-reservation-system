import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css';
import "./UserBookings.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Registration from "./Pages/Registration";
import Admin from "./Pages/Admin";
import HomeUser from './Pages/HomeUser';
import About from './Pages/About';
import AddFlight from './admin/AddFlight';
import AddCity from './admin/AddCity';
import EditFlight from './admin/EditFlight';
import UserBookings from './Pages/UserBookings';
import Profile from './Pages/profile';
import Support from './Pages/Support';
import PaymentPage from './Pages/PaymentPage';
import PaymentSuccess from './Pages/PaymentSuccess';


function App() {
  return (
    <BrowserRouter>
      <Routes> 
        <Route path="/" element={<Home/>} /> 
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Registration/>}/>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/home-user" element={<HomeUser/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/admin/add-flight" element={<AddFlight/>}/>
        <Route path="/admin/add-city" element={<AddCity/>}/>
        <Route path="/admin/edit-flight/:id" element={<EditFlight/>}/>
        <Route path="/booking" element={<UserBookings/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path='/support' element={<Support/>}/>
        <Route path='/payment' element={<PaymentPage/>}/>
        <Route path="/payment-success" element={<PaymentSuccess/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;