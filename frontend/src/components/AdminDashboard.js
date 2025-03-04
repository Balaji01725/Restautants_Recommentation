import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("isAuthenticated") === "true"
    );
    const [restaurants, setRestaurants] = useState([]);
    const [editRestaurant, setEditRestaurant] = useState(null);
    const [updatedData, setUpdatedData] = useState({
        name: "",
        district: "",
        location: "",
        description: ""
    });

    const ADMIN_EMAIL = "admin@gmail.com";
    const ADMIN_PASSWORD = "admin123";

    useEffect(() => {
        if (isAuthenticated) {
            fetchRestaurants();
        }
    }, [isAuthenticated]);

    const fetchRestaurants = async () => {
        try {
            const response = await fetch("http://localhost:4001/api/restaurants");
            if (!response.ok) throw new Error("Failed to fetch restaurants");
            const data = await response.json();
            setRestaurants(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            setIsAuthenticated(true);
            localStorage.setItem("isAuthenticated", "true");
            fetchRestaurants();
        } else {
            alert("Invalid email or password");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
        setEmail("");
        setPassword("");
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this restaurant?")) {
            try {
                const response = await fetch(`http://localhost:4001/api/restaurants/${id}`, { method: "DELETE" });
                if (!response.ok) throw new Error("Failed to delete restaurant");
                setRestaurants(restaurants.filter(restaurant => restaurant._id !== id));
            } catch (error) {
                console.error("Error deleting restaurant:", error);
            }
        }
    };

    const handleEdit = (restaurant) => {
        setEditRestaurant(restaurant);
        setUpdatedData({
            name: restaurant.name,
            district: restaurant.district || "",
            location: restaurant.location,
            description: restaurant.description
        });
    };

    const handleUpdate = async () => {
        if (!editRestaurant) return;

        try {
            const response = await fetch(`http://localhost:4001/api/restaurants/${editRestaurant._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) throw new Error("Failed to update restaurant");

            setRestaurants(restaurants.map(r => r._id === editRestaurant._id ? { ...r, ...updatedData } : r));
            setEditRestaurant(null);
        } catch (error) {
            console.error("Error updating restaurant:", error);
        }
    };

    return (
        <div className="admin-dashboard">
            {!isAuthenticated ? (
                <div className="admin-login">
                    <h2>Admin Login</h2>
                    <form onSubmit={handleLogin}>
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <button type="submit">Login</button>
                    </form>
                </div>
            ) : (
                <div>
                    <h2>Admin Dashboard - Manage Restaurants</h2>
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>

                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>District</th>
                                <th>Location</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {restaurants.length > 0 ? (
                                restaurants.map((restaurant) => (
                                    <tr key={restaurant._id}>
                                        <td>{restaurant.name}</td>
                                        <td>{restaurant.district || "N/A"}</td>
                                        <td>{restaurant.location}</td>
                                        <td>{restaurant.description}</td>
                                        <td>
                                            <button className="edit-btn" onClick={() => handleEdit(restaurant)}>✏️ Edit</button>
                                            <button className="delete-btn" onClick={() => handleDelete(restaurant._id)}>🗑️ Delete</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5">No restaurants available.</td></tr>
                            )}
                        </tbody>
                    </table>

                    {editRestaurant && (
                        <div className="edit-modal">
                            <h3>Edit Restaurant</h3>
                            <input type="text" value={updatedData.name} onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })} />
                            <input type="text" value={updatedData.district} onChange={(e) => setUpdatedData({ ...updatedData, district: e.target.value })} />
                            <input type="text" value={updatedData.location} onChange={(e) => setUpdatedData({ ...updatedData, location: e.target.value })} />
                            <input type="text" value={updatedData.description} onChange={(e) => setUpdatedData({ ...updatedData, description: e.target.value })} />
                            <button onClick={handleUpdate}>Update</button>
                            <button onClick={() => setEditRestaurant(null)}>Cancel</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
