import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Auth.css'


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Sending Data:", formData);

    try {
      const response = await fetch(`http://localhost:3001/api/login?email=${formData.email}&password=${formData.password}`, {
        method: "GET",
      });

      const data = await response.json();
      // console.log("Response from server:", data);

      if (response.ok) {
        alert("Login successful!");
        navigate("/");
      } else {
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  };

  return (
    <div id="login-container">
      <form id="Login" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <label>Email</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required />

        <label>Password</label>
        <input type="password" name="password" value={formData.password} onChange={handleChange} required />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;