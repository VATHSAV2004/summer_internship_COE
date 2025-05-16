import sqlite3
import pandas as pd
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import logging
def get_recommendations(project_title):
    # Connect to the SQLite database
    conn = sqlite3.connect("../database/uniproject - Copy.db")
    
    # Load the projects table into a DataFrame
    projects = pd.read_sql_query("SELECT * FROM projects", conn)
    
    # Close the database connection
    conn.close()

    # Prepare the DataFrame
    projects['tags'] = projects['project_description'] + ' ' + projects['project_category'] + ' ' + projects['keywords'] + ' ' + projects['tools_technologies'] + ' ' + projects['project_outcome']
    new_df = projects[['project_id', 'project_title', 'tags']].copy()  # Make a copy to avoid warnings

    # Use .loc to modify the DataFrame
    new_df.loc[:, 'tags'] = new_df['tags'].apply(lambda x: x.lower())

    # Stemming
    ps = PorterStemmer()
    new_df.loc[:, 'tags'] = new_df['tags'].apply(lambda x: ' '.join([ps.stem(word) for word in x.split()]))

    # Create the count matrix
    cv = CountVectorizer(max_features=2000, stop_words="english")
    vectors = cv.fit_transform(new_df['tags']).toarray()
    
    # Calculate cosine similarity
    similarity = cosine_similarity(vectors)
    movie_index = new_df[new_df['project_title'] == project_title].index[0]
    distances = similarity[movie_index]
    movies_list = sorted(list(enumerate(distances)), reverse=True, key=lambda x: x[1])[1:6]
    
    # Fetch detailed project information for recommended projects
    recommendations = []
    for i in movies_list:
        project_id = new_df.iloc[i[0]]['project_id']
        recommendations.append(projects[projects['project_id'] == project_id].to_dict(orient='records')[0])

    return recommendations

def calculate_plagiarism_percentage(new_project_description):
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect("C:/Users/saisr/OneDrive/Desktop/internship_project/database_all_copies/database_sqlite/sqlite-tools-win-x64-3450200/uniproject - Copy.db")
        
        # Load the projects table into a DataFrame
        projects = pd.read_sql_query("SELECT * FROM projects", conn)
        conn.close()

        # Prepare the DataFrame
        projects['tags'] = projects['project_description'] + ' ' + projects['project_category'] + ' ' + projects['keywords'] + ' ' + projects['tools_technologies'] + ' ' + projects['project_outcome']
        
        new_df = projects[['project_id', 'project_title', 'tags']].copy()  # Make a copy to avoid warnings

        # Use .loc to modify the DataFrame
        new_df.loc[:, 'tags'] = new_df['tags'].apply(lambda x: x.lower())

        # Stemming
        ps = PorterStemmer()
        new_df.loc[:, 'tags'] = new_df['tags'].apply(lambda x: ' '.join([ps.stem(word) for word in x.split()]))

        # Create the count matrix
        cv = CountVectorizer(max_features=2000, stop_words="english")
        vectors = cv.fit_transform(new_df['tags']).toarray()
        
        # Calculate cosine similarity
        new_vector = cv.transform([new_project_description.lower()]).toarray()
        new_similarity = cosine_similarity(new_vector, vectors)

        # Calculate plagiarism percentage
        plagiarism_percentage = 0
        matches = []
        for idx, score in enumerate(new_similarity[0]):
            if score > 0.75:  # More than 75% similarity
                matches.append((new_df.iloc[idx]['project_title'], new_df.iloc[idx]['project_id'], score))
                plagiarism_percentage += score

        # Average the similarity scores for percentage
        if matches:
            plagiarism_percentage = (plagiarism_percentage / len(matches)) * 100

        return plagiarism_percentage, matches

    except Exception as e:
        logging.error(f"Error during plagiarism calculation: {e}")
        return 0, []
