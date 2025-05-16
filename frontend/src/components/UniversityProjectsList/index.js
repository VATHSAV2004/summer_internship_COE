import React, { Component } from 'react';
import './index.css';
import ProjectCard from '../ProjectCard/index';
import Spinner from '../Spinner/index'
import withParams from '../withParams.js';
import Header from '../Header/index.js'
import Address from '../Address/index.js';
class ProjectList extends Component {
  
        state = {
            result: []}
      
 
    componentDidMount() {
        this.fetchProjectDetails();
    }

    fetchProjectDetails = async () => {
        try {
      
            const { collegeId } = this.props.params;
            const url = "http://localhost:4860/CollegeProjects/"+collegeId;
            console.log("college id",collegeId)
            const options = {
                method: 'GET',
            };
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            console.log("hello--------------------------------------------------");
            this.setState({ result: data });
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        const { result } = this.state;
        console.log(result)

        return (
            <>
            <Header/>
            <div className="project-list">
                
                {result.length > 0 ? (
                    result.map((values)=>{return ( 
                        <ProjectCard projectDetails={values} />
                    )})
                    
                ) : (
                    <Spinner/>
                )}
           
            </div>
            <Address/>
            </>
        );
    }
}
export default withParams(ProjectList);