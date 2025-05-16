// src/components/Header/index.js
import './index.css';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand logo-css" to="/">Uni Project</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto anchors-container-css">
            <li className="nav-item">
              <Link className="nav-link linkcss" to="/Home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link linkcss" to="/AllUniversities">Universities/Research</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link linkcss" to="/StudentLogin">Student Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link linkcss" to="/UniversityLogin">University Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link linkcss" to="/StudentRegistration">Student Registration</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link linkcss" to="/UniversityRegistration">University Registration</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link linkcss" to="/About">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link linkcss" to="/DeveloperDetails">Developer Details</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
