import './index.css';
import { Component } from 'react';
import Header from '../Header/index';
import Address from '../Address/index';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchInput: '',
            suggestions: []
        };
    }

    handleInputChange = (event) => {
        const searchInput = event.target.value;
        this.setState({ searchInput }, () => {
            if (searchInput.length > 0) {
                this.fetchSuggestions(searchInput);
            } else {
                this.setState({ suggestions: [] });
            }
        });
    }

    fetchSuggestions = async (query) => {
        try {
            const response = await fetch(`http://localhost:4860/ProjectsDetails/title/${query}`);
            const data = await response.json();
            this.setState({ suggestions: data });
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }

    handleSearchSubmit = (event) => {
        event.preventDefault();
        console.log('Search submitted:', this.state.searchInput);
        // Implement further search logic here
    }

    render() {
        const { searchInput, suggestions } = this.state;
        return (
            <>
            <Header />
            <div className="home-container">
                
                <form onSubmit={this.handleSearchSubmit} className="text-center mt-4">
                    <input 
                        type="search" 
                        className="form-control searchbar-css" 
                        value={searchInput} 
                        onChange={this.handleInputChange} 
                        placeholder="Search..."
                    />
                    {suggestions.length > 0 && (
                        <ul className="list-group suggestions-list">
                            {suggestions.map((suggestion, index) => (
                                <li key={index} className="list-group-item suggestion-item">
                                    {suggestion.project_title}
                                </li>
                            ))}
                        </ul>
                    )}
                </form>
                
            </div>
            </>
        );
    }
}

export default Home;
