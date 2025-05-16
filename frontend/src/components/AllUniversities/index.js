import './index.css';
import { Component } from 'react';
import Header from '../Header/index.js';
import UniversityCard from '../UniversityCard/index.js';
import Address from '../Address/index.js';

class All_Universities extends Component {
    state = { 
        colleges: [], 
        currentPage: 1, 
        itemsPerPage: 6 // Number of items per page
    };

    fetchcolleges = async () => {
        try {
            const url = "http://localhost:4860/AllUniversities";
            const options = {
                method: "GET",
            };
            const res = await fetch(url, options);
            const data = await res.json();
            console.log("Fetched data:", data);
            this.setState({ colleges: data });
        } catch (e) {
            console.log("Error fetching colleges:", e);
        }
    }

    componentDidMount() {
        this.fetchcolleges();
    }

    // Method to change the page
    handlePageChange = (pageNumber) => {
        this.setState({ currentPage: pageNumber });
    }

    render() {
        const { colleges, currentPage, itemsPerPage } = this.state;

        // Calculate total pages
        const totalPages = Math.ceil(colleges.length / itemsPerPage);

        // Calculate the index of the first and last item on the current page
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentColleges = colleges.slice(indexOfFirstItem, indexOfLastItem); // Get the current items

        return (
            <>
            <Header />
            
                
                <h2 className="my-4 text-center">All Universities</h2>
                <div className="row">
                    {currentColleges.map((value) => (
                        <div key={value.project_id} className="col-md-4 col-sm-6 mb-4">
                            <UniversityCard details={value} />
                        </div>
                    ))}
                </div>
                
                {/* Pagination Controls */}
                <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => this.handlePageChange(currentPage - 1)}>Previous</button>
                        </li>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => this.handlePageChange(index + 1)}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button className="page-link" onClick={() => this.handlePageChange(currentPage + 1)}>Next</button>
                        </li>
                    </ul>
                </nav>

                <Address />
            
            </>
        );
    }
}

export default All_Universities;
