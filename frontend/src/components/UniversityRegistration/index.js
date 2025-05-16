// src/components/UniversityRegistration/index.js
import React, { useState } from 'react';
import axios from 'axios';
import Header from '../Header/index';

const UniversityRegistration = () => {
  const [universityName, setUniversityName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4860/RegisterUniversity', {
        university_name: universityName,
        user_id: userId,
        password: password,
      });
      alert('University registration successful!');
    } catch (error) {
      console.error('Error registering university:', error);
      alert('Registration failed!');
    }
  };

  return (
    <div>
      <Header />
      <h2>University Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="University Name"
          value={universityName}
          onChange={(e) => setUniversityName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default UniversityRegistration;
