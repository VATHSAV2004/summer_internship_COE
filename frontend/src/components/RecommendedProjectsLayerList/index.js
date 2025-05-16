import React, { Component } from 'react';
import './index.css';
import ProjectCard from '../ProjectCard/index';
import Spinner from '../Spinner/index';

class RecommendedProjectsLayerList extends Component {
    state = {
        result: [],
        loading: true,
        error: null,
    };

    componentDidMount() {
        this.fetchProjectDetails();
    }

    fetchProjectDetails = async () => {
        try {
            const { projectTitle } = this.props;
            const url = "http://127.0.0.1:5000/recommend";
            const options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ project_title: projectTitle }),
            };

            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log("^^^^^^^^^^^^^^^^66666666"+data.recommendations+"^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
            this.setState({ result: data.recommendations, loading: false });
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    };

    render() {
        const { result, loading, error } = this.state;

        if (loading) {
            return <Spinner />;
        }

        if (error) {
            return <p>{error}</p>;
        }

        return (
            <div className="project-list">
                {result.length > 0 ? (
                    result.map((values) => (
                        <ProjectCard key={values.project_id} projectDetails={values} />
                    ))
                ) : (
                    <p>No recommended projects available.</p>
                )}
            </div>
        );
    }
}

export default RecommendedProjectsLayerList;
