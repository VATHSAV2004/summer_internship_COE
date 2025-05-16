import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header/index';
import './index.css'; // Assuming you have a CSS file for custom styles

const StudentLogin = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4860/StudentLogin', {
        user_id: userId,
        password: password,
      });

      if (response.status === 200) {
        const { token, student_id } = response.data;
        // Store token in localStorage
        localStorage.setItem('token', token);

        alert('Login successful!');
        navigate(`/StudentDashboard/${student_id}`); // Redirect to dashboard
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid credentials!');
    }
  };

  return (
    <>
      <Header />
      <div className="login-container container mt-5">
        <div className="login-card card shadow-lg p-4">
          <h2 className="text-center mb-4">Student Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="userId">User ID</label>
              <input
                type="text"
                id="userId"
                className="form-control"
                placeholder="Enter your User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block mt-4">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default StudentLogin;
