import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import './Auth.css'; 

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);

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

  return (
    <div className="restaurant-list-container1">
      <h2>Our Restaurants</h2>
      <div className="restaurant-grid">
        {restaurants.map((restaurant) => (
          <Link
            key={restaurant._id}
            to={`/restaurants/${restaurant._id}`} 
            className="restaurant-link"
          >
            <div className="restaurant-card">
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="restaurant-image"
              />
              
              <h3>{restaurant.name}</h3>
              <p>{restaurant.district}</p>
              <p>{restaurant.description}</p>
            </div>
            
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RestaurantList;
