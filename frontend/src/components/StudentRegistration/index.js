// src/components/StudentRegistration/index.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';
import Header from '../Header/index';
const StudentRegistration = () => {
    const [studentName, setStudentName] = useState('');
    const [universityId, setUniversityId] = useState('');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [universities, setUniversities] = useState([]);
    const [filteredUniversities, setFilteredUniversities] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Fetch all universities on component mount
        const fetchUniversities = async () => {
            try {
                const response = await axios.get('http://localhost:4860/AllUniversities');
                setUniversities(response.data);
                setFilteredUniversities(response.data); // Initially, show all universities
            } catch (error) {
                console.error('Error fetching universities:', error);
            }
        };
        fetchUniversities();
    }, []);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        if (term) {
            const filtered = universities.filter(university =>
                university.university_name.toLowerCase().includes(term.toLowerCase())
            );
            setFilteredUniversities(filtered);
        } else {
            setFilteredUniversities(universities); // Show all if search is empty
        }
    };

    const handleUniversitySelect = (university) => {
        setUniversityId(university.university_id);
        setSearchTerm(university.university_name);
        setFilteredUniversities([]); // Hide dropdown after selection
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4860/RegisterStudent', {
                student_name: studentName,
                university_id: universityId,
                user_id: userId,
                password: password,
            });
            // Reset fields after successful registration
            setStudentName('');
            setUniversityId('');
            setUserId('');
            setPassword('');
            setSearchTerm('');
            setFilteredUniversities(universities); // Reset filtered universities
            alert('Student registered successfully!');
        } catch (error) {
            console.error('Error registering student:', error);
        }
    };

    return (
      
        <div>
          <Header/>
          <div className="registration-container">
            <h2>Student Registration</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Student Name:</label>
                    <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>University:</label>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search for a university..."
                        required
                    />
                    {filteredUniversities.length > 0 && (
                        <ul className="dropdown">
                            {filteredUniversities.map(university => (
                                <li
                                    key={university.university_id}
                                    onClick={() => handleUniversitySelect(university)}
                                >
                                    {university.university_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <label>User ID:</label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
        </div>
    );
};

export default StudentRegistration;
