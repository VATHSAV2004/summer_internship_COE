import React, { useState } from 'react';
import axios from 'axios';
import Header from '../Header/index';

import './index.css'; // Import the CSS file for custom styles

const UploadProject = () => {
  const [studentId, setStudentId] = useState(''); 
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectCategory, setProjectCategory] = useState('');
  const [projectSupervisor, setProjectSupervisor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [keywords, setKeywords] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [toolsTechnologies, setToolsTechnologies] = useState('');
  const [projectOutcome, setProjectOutcome] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const token = localStorage.getItem('token'); 

    const projectData = {
      student_id: studentId, 
      title: projectTitle,
      description: projectDescription,
      category: projectCategory,
      supervisor: projectSupervisor,
      start_date: startDate,
      end_date: endDate,
      keywords: keywords,
      github_url: githubUrl,
      tools_technologies: toolsTechnologies,
      project_outcome: projectOutcome
    };

    try {
      

      
        const flaskResponse = await axios.post('http://127.0.0.1:5000/UploadProject', projectData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        setSuccessMessage('The project has been sent for validation; kindly check your email');
      

      setStudentId(''); 
      setProjectTitle('');
      setProjectDescription('');
      setProjectCategory('');
      setProjectSupervisor('');
      setStartDate('');
      setEndDate('');
      setKeywords('');
      setGithubUrl('');
      setToolsTechnologies('');
      setProjectOutcome('');
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Failed to upload project.');
      } else {
        setErrorMessage('Error uploading project: ' + error.message);
      }
    }
  };

  return (
    <>
    <Header/>
    <div className="upload-project-container">
      <h2 className="upload-title">Upload Project</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="text"
          placeholder="Project Title"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          required
          className="input-field"
        />
        <textarea
          placeholder="Project Description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
          required
          className="textarea-field"
        />
        <input
          type="text"
          placeholder="Project Category"
          value={projectCategory}
          onChange={(e) => setProjectCategory(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="text"
          placeholder="Project Supervisor"
          value={projectSupervisor}
          onChange={(e) => setProjectSupervisor(e.target.value)}
          className="input-field"
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="input-field"
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="url"
          placeholder="GitHub URL"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Tools & Technologies"
          value={toolsTechnologies}
          onChange={(e) => setToolsTechnologies(e.target.value)}
          className="input-field"
        />
        <textarea
          placeholder="Project Outcome"
          value={projectOutcome}
          onChange={(e) => setProjectOutcome(e.target.value)}
          className="textarea-field"
        />
        <button type="submit" className="submit-button">Upload</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
    </>
  );
};

export default UploadProject;
