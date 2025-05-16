import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css'; // Add custom CSS if needed
import Header from '../Header/index';

const StudentDashboard = () => {
  const { studentId } = useParams(); // Extract studentId from URL
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    alert('Logged out successfully');
    navigate('/StudentLogin'); // Redirect to login page
  };

  // Token verification and redirection if no valid token is present
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage

      if (!token) {
        // If no token, redirect to login
        setErrorMessage('No valid token found. Redirecting to login.');
        setTimeout(() => navigate('/StudentLogin'), 2000); // Redirect after 2 seconds
        return;
      }

      try {
        // Make a request to verify token with Authorization header
        const response = await axios.get('http://localhost:4860/verifyToken', {
          headers: { Authorization: `Bearer ${token}` }, // Send token in the right format
        });

        if (response.status !== 200) {
          throw new Error('Token is invalid');
        }
      } catch (error) {
        // Handle invalid token error
        setErrorMessage('Invalid or expired token. Redirecting to login.');
        localStorage.removeItem('token'); // Clear the token
        setTimeout(() => navigate('/StudentLogin'), 2000); // Redirect after 2 seconds
      }
    };

    verifyToken();
  }, [navigate]);

  return (
    <>
      <Header />

      <div className="dashboard-container container mt-5">
        <div className="card shadow-lg p-4">
          <h2 className="text-center mb-4">Student Dashboard</h2>
          {errorMessage ? (
            <p className="text-danger">{errorMessage}</p>
          ) : (
            <>
              <p className="welcome-text text-center">Welcome, Student {studentId}!</p>

              <div className="row mt-4">
                {/* Box 1 */}
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="card action-box shadow-sm h-100">
                    <div className="card-body d-flex flex-column justify-content-center">
                      <h5 className="card-title text-center">Upload Project</h5>
                      <p className="card-text text-center">Submit a new project to the system.</p>
                      <Link to={`/UploadProject/${studentId}`} className="btn btn-primary mt-auto">Go</Link>
                    </div>
                  </div>
                </div>
                {/* Box 2 */}
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="card action-box shadow-sm h-100">
                    <div className="card-body d-flex flex-column justify-content-center">
                      <h5 className="card-title text-center">View My Projects</h5>
                      <p className="card-text text-center">See all the projects you've uploaded.</p>
                      <Link to={`/ViewProjects/${studentId}`} className="btn btn-primary mt-auto">Go</Link>
                    </div>
                  </div>
                </div>
                {/* Box 3 */}
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="card action-box shadow-sm h-100">
                    <div className="card-body d-flex flex-column justify-content-center">
                      <h5 className="card-title text-center">Future Feature 1</h5>
                      <p className="card-text text-center">Access to future features.</p>
                      <Link to={`/Feature1/${studentId}`} className="btn btn-primary mt-auto">Go</Link>
                    </div>
                  </div>
                </div>
                {/* Box 4 */}
                <div className="col-md-6 col-lg-4 mb-4">
                  <div className="card action-box shadow-sm h-100">
                    <div className="card-body d-flex flex-column justify-content-center">
                      <h5 className="card-title text-center">Future Feature 2</h5>
                      <p className="card-text text-center">Access to future features.</p>
                      <Link to={`/Feature2/${studentId}`} className="btn btn-primary mt-auto">Go</Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <button onClick={handleLogout} className="btn btn-danger">Logout</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
