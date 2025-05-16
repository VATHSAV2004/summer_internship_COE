import React from 'react';
import './index.css';
import RecommendedProjectsLayerList from '../RecommendedProjectsLayerList/index';
import Address from '../Address/index.js';

const RecommendedProjectsLayer = ({ projectTitle, project_id }) => {
    return (
        <>
            <div className="app-background-css">
                <RecommendedProjectsLayerList project_id={project_id} projectTitle={projectTitle} />
            </div>
            <Address />
        </>
    );
};

export default RecommendedProjectsLayer;
