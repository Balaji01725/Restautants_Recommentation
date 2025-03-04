import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; 

const RestaurantDetail = () => {
  const [restaurant, setRestaurant] = useState(null);
  const { id } = useParams(); 

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`http://localhost:4001/api/restaurants/${id}`);
        const data = await response.json();
        setRestaurant(data);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (!restaurant) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="restaurant-detail-container1">
      <h2>{restaurant.name}</h2>
      <div className="restaurant-detail">
        <img
          src={restaurant.image}
        />
        <div className="restaurant-detail-info">
          <p><strong>Location:</strong> {restaurant.location}</p>
          <p><strong>Description:</strong> {restaurant.description}</p>
          <p><strong>Menu:</strong> {restaurant.menu}</p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
