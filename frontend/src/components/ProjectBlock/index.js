
import './index.css'
import { Link } from 'react-router-dom';
const ProjectBlock=(props)=>{
    console.log(props);
    console.log("block page"); 
    const {projectDetails}=props;
    const {project_id}=projectDetails
    console.log("---"+projectDetails);
    return (
        <Link to={`/ProjectsDetails/${project_id}`}>
        <div className="project-block-css">
            <h2 className="project-heading-css">{projectDetails}</h2>
            <p className="project-explore-css">explore more</p>
        </div>
        </Link>
    );
}
export default ProjectBlock;