import './index.css';
import { Link } from 'react-router-dom';

const UniversityCard = (props) => {
    const { details } = props; 
    const { university_id } = details;
    const collegeId = university_id;

    return ( 
        <Link to={`/UniversityProjectsList/${collegeId}`} style={{ textDecoration: 'none' }}>
            <div className="card university-card bg-light shadow-lg">
                <div className="card-body">
                    <h2 className="card-title text-center university-name">{details.university_name}</h2>
                    <p className="card-text text-center">Visit college projects --</p>
                </div>
            </div>
        </Link>
    );
}

export default UniversityCard;
