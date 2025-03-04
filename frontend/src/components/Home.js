import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Home.css';
import Logo from '../components/royal.png';

export default function Home() {
  const [dist, setDist] = useState([
    'Madurai', 'Coimbatore', 'Salem', 'Chennai', 'Kancheepuram', 'Chengalpattu',
    'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kanyakumari', 'Karur',
    'Krishnagiri', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur',
    'Pudukkottai', 'Ramanathapuram', 'Sivaganga', 'Tenkasi', 'Thanjavur',
    'Theni', 'Thoothukudi (Tuticorin)', 'Tiruchirappalli (Trichy)', 'Tirunelveli',
    'Tirupattur', 'Tiruvallur', 'Tiruvannamalai', 'Vellore', 'Villupuram',
    'Virudhunagar', 'Kallakurichi', 'Tiruvarur'
  ]);

  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:4001/api/restaurants");
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  
  const handleSearch = async (event) => {
    const query = event.target.value.toLowerCase().trim();
    setSearchQuery(query); 
    
    
    try {
      const response = await fetch(`/api/restaurants/search?query=${query}&district=${selectedDistrict}`);
      const data = await response.json();
      
      
      filterResults(data); 
    } catch (error) {
      console.error('Error during search:', error);
    }
  };
  
  

  
  const handleDistrictChange = (event) => {
    const district = event.target.value;
    setSelectedDistrict(district);
    filterResults(searchQuery, district);
  };

  
  const filterResults = (query, district) => {
    if (!query && !district) {
      setFilteredRestaurants([]);
      return;
    }

    const filtered = restaurants.filter(restaurant => {
      const restaurantName = restaurant?.name?.toLowerCase().trim() || "";
      const restaurantDistrict = restaurant?.location?.toLowerCase().trim() || "";  
      
      console.log(`Filtering: Searching for "${query}" in "${restaurantName}" and district "${district}" vs. "${restaurantDistrict}"`);

      
      const matchesQuery = restaurantName.includes(query);
      const matchesDistrict = !district || restaurantDistrict === district.toLowerCase().trim();

      return matchesQuery && matchesDistrict;
    });

    setFilteredRestaurants(filtered);
  };

  
  const handleViewClick = (restaurant) => {
    navigate(`/restaurants/${restaurant._id}`);
  };

  return (
    <div className="home-container">
      <div className="home-background">
        <div className="home-content">
          <div className="logo-container">
            <img src={Logo} alt="Logo" className="logo" />
          </div>
          <div className="button-container">
            <NavLink to="/Signup" className="home-navlink">User Signup</NavLink>
            <NavLink to="/addRestaurant" className="home-navlink">Add Restaurant</NavLink>
            <NavLink to="/login" className="home-navlink">Login</NavLink>
            <NavLink to="/admin" className="home-navlink">Admin</NavLink>
          </div>
        </div>

        <div className='home-title'>
          <h1>NAMMA NADU</h1>
          <p className='home-para'>Discover the best food & drinks in Tamil Nadu</p>
        </div>

        <div className='home-search'>
          <select className='select-district' value={selectedDistrict} onChange={handleDistrictChange}>
            <option value="">Select District</option>
            {dist.map((x, index) => (<option key={index} value={x}>{x}</option>))}
          </select>
          <input
            type='search'
            className='search-bar-home'
            placeholder='Search Restaurants...'
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Search Results */}
        {filteredRestaurants.length > 0 ? (
          <div className="search-results">
            {filteredRestaurants.map(restaurant => (
              <div key={restaurant._id} className="search-result-item">
                <span className="restaurant-name">{restaurant.name}</span>
                <button className="view-button" onClick={() => handleViewClick(restaurant)}>View</button>
              </div>
            ))}
          </div>
        ) : (
          searchQuery !== '' && selectedDistrict !== '' && (
            <p className="no-results">Restaurant not available.</p>
          )
        )}
      </div>
    </div>
  );
}
