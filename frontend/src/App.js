  // Import useRef here
import './App.css';
import {Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/Login';
import AddRestaurant from './components/AddRestaurant';
import RestaurantList from './components/RestaurantList';
import RestaurantDetail from './components/RestaurantDetail';
import AdminDashboard from './components/AdminDashboard';

function App() {
 

  return (
    <div className="App">  {/* Applying the ref */}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path='/Login' element={<Login/>}/>
        <Route path='/addRestaurant' element={<AddRestaurant/>}/>
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />}/>
        <Route path="/admin" element={<AdminDashboard/>}/>
      </Routes>
   
    </div>
  );
}

export default App;
