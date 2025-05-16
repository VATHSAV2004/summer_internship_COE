import React, { useState } from 'react';
import axios from 'axios';
import Header from '../Header/index';
import './index.css'; // Assuming you have a CSS file for custom styles

const UniversityLogin = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4860/UniversityLogin', {
                user_name: userName,
                password: password,
            });
            setMessage(response.data.message);
            // Redirect or perform further actions on successful login
        } catch (error) {
            setMessage(error.response ? error.response.data.message : 'Login failed.');
        }
    };

    return (
        <>
        <Header />
        <div className="container mt-5">
            
            <h2 className="text-center mb-4">University Login</h2>
            <div className="d-flex justify-content-center">
                <form onSubmit={handleLogin} className="col-md-4">
                    <div className="form-group">
                        <label htmlFor="userName">User Name</label>
                        <input
                            type="text"
                            id="userName"
                            className="form-control"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success btn-block mt-3">
                        Login
                    </button>
                </form>
            </div>
            {message && <p className="text-center mt-3 text-danger">{message}</p>}
        </div>
        </>
    );
};

export default UniversityLogin;
