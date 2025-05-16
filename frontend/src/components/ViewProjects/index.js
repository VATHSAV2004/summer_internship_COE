// src/components/ViewProjects/index.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css'; // Import CSS for styling
import Header from '../Header/index';

const ViewProjects = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setErrorMessage('No valid token found. Redirecting to login.');
        setTimeout(() => navigate('/StudentLogin'), 2000);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:4860/ProjectsByStudent/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(response.data); // Ensure this returns an array of projects
      } catch (error) {
        console.error('Error fetching projects:', error);
        if (error.response && error.response.status === 401) {
          setErrorMessage('Invalid or expired token. Redirecting to login.');
          localStorage.removeItem('token');
          setTimeout(() => navigate('/StudentLogin'), 2000);
        }
      }
    };

    fetchProjects();
  }, [studentId, navigate]);

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('Logged out successfully');
    navigate('/StudentLogin');
  };

  return (
    <>
      <Header />
    <div>
      <h2>My Projects</h2>
      {errorMessage ? (
        <p>{errorMessage}</p>
      ) : projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="projects-container">
          {projects.map((project) => (
            <div key={project.project_id} className="project-card">
              <h3>{project.project_title}</h3>
              
            </div>
          ))}
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
    </>
  );
};

export default ViewProjects;
