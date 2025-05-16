// src/App.js
import './App.css'
import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom';
import UniversityLogin from './components/UniversityLogin/index'; // Import the UniversityLogin component
import About from './components/About/index';
import AllUniversities from './components/AllUniversities/index';
import DeveloperDetails from './components/DeveloperDetails/index';
import UniversityProjectsList from './components/UniversityProjectsList/index';
import ProjectDetails from './components/ProjectDetails/index';
import Home from './components/Home/index';
import StudentRegistration from './components/StudentRegistration/index';
import UniversityRegistration from './components/UniversityRegistration/index';
import StudentLogin from './components/StudentLogin/index';
import StudentDashboard from './components/StudentDashboard/index';
import UploadProject from './components/UploadProject/index';
import ViewProjects from './components/ViewProjects/index';
// ... other imports

const App = () => {
  console.log("app is running-------------------------------------------------------------");
  return ( 
    <BrowserRouter> 
      <Routes>
      <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route exact path="/Home" element={<Home />} />
        <Route exact path="/UniversityProjectsList/:collegeId" element={<UniversityProjectsList />} />
        <Route exact path="/StudentLogin" element={<StudentLogin />} />
        <Route exact path="/UniversityLogin" element={<UniversityLogin />} /> {/* Add this line */}
        <Route exact path="/StudentRegistration" element={<StudentRegistration />} />
        <Route exact path="/UniversityRegistration" element={<UniversityRegistration />} />
        <Route exact path="/About" element={<About />} />
        <Route exact path="/AllUniversities" element={<AllUniversities />} />
        <Route exact path="/DeveloperDetails" element={<DeveloperDetails />} />
        <Route exact path="/ProjectsDetails/:project_id" element={<ProjectDetails />} />

        
        
        {/* Correct the parameters in routes */}
        <Route exact path="/StudentLogin" element={<StudentLogin />} />
        <Route exact path="/StudentDashboard/:studentId" element={<StudentDashboard />} />
        <Route exact path="/UploadProject/:studentId" element={<UploadProject />} />
        <Route exact path="/ViewProjects/:studentId" element={<ViewProjects />} />

      </Routes>
    </BrowserRouter> 
  );
}

export default App;
