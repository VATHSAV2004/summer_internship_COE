import './index.css';
import { Link } from 'react-router-dom';

const ProjectCard = ({ projectDetails }) => {
    console.log("Project details: ", projectDetails); 

    // Destructure the projectDetails object to access its properties
    const { project_id, project_title, project_description, github_url } = projectDetails;

    return (
        <Link to={`/ProjectsDetails/${project_id}`}>
            <div className="project-block-css">
                {/* Display the project title */}
                <h2 className="project-heading-css">{project_title}</h2>
                
                {/* Display a short description or other relevant details */}
                <p className="project-description-css">
                    {project_description ? project_description.substring(0, 100) + '...' : 'No description available.'}
                </p>

                {/* Optional: Link to the project's GitHub URL if available */}
                {github_url && (
                    <a href={github_url} target="_blank" rel="noopener noreferrer" className="project-link-css">
                        View on GitHub
                    </a>
                )}

                <p className="project-explore-css">Explore more</p>
            </div>
        </Link>
    );
};

export default ProjectCard;
