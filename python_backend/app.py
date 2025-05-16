from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import sqlite3
import pandas as pd
from nltk.stem.porter import PorterStemmer
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_mail import Mail, Message
from your_recommender_code2 import get_recommendations
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Allowing all origins for testing purposes

# Flask-Mail configuration
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = 'dasisaisrivathsav20042@gmail.com'
app.config['MAIL_PASSWORD'] = 'ckmy ivqg pegj xnuo'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)
# -------------------- Recommendation Route --------------------
@app.route('/recommend', methods=['POST'])
def recommend_projects():
    try:
        data = request.get_json()
        project_title = data['project_title']
        recommendations = get_recommendations(project_title)
        logging.info(f"Recommendations generated for project: {project_title}")
        return jsonify({'recommendations': recommendations}), 200
    except Exception as e:
        logging.error(f"Error in recommendations: {e}")
        return jsonify({'error': str(e)}), 500




# JWT Secret key for signing
SECRET_KEY = 'your_secret_key_here'

# Database path
DB_PATH = "../database/uniproject - Copy.db"

# -------------------- Plagiarism Checking and Email Notification --------------------
def calculate_plagiarism_percentage(new_project_tags, uploader_email):
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect(DB_PATH)
        projects = pd.read_sql_query("SELECT * FROM projects", conn)
        conn.close()

        # Prepare the DataFrame
        projects['tags'] = (
            projects['project_description'] + ' ' +
            projects['project_category'] + ' ' +
            projects['keywords'] + ' ' +
            projects['tools_technologies'] + ' ' +
            projects['project_outcome']
        )
        new_df = projects[['project_id', 'project_title', 'tags', 'student_id']].copy()

        # Stemming
        ps = PorterStemmer()
        new_df['tags'] = new_df['tags'].apply(lambda x: ' '.join([ps.stem(word) for word in x.lower().split()]))

        # Create the count matrix
        cv = CountVectorizer(max_features=2000, stop_words="english")
        vectors = cv.fit_transform(new_df['tags']).toarray()

        # Calculate cosine similarity for the new project tags
        new_project_tags = ' '.join([ps.stem(word) for word in new_project_tags.lower().split()])
        new_vector = cv.transform([new_project_tags]).toarray()
        new_similarity = cosine_similarity(new_vector, vectors)

        # Calculate plagiarism percentage and matches
        plagiarism_percentage = 0
        matches = []
        for idx, score in enumerate(new_similarity[0]):
            if score > 0.75:
                match = {
                    "project_title": new_df.iloc[idx]['project_title'],
                    "project_id": int(new_df.iloc[idx]['project_id']),
                    "similarity_score": score,
                    "student_id": int(new_df.iloc[idx]['student_id'])
                }
                matches.append(match)
                plagiarism_percentage += score

        if matches:
            plagiarism_percentage = (plagiarism_percentage / len(matches)) * 100
            send_email_notifications(uploader_email, plagiarism_percentage, matches)

        return plagiarism_percentage, matches
        

    except Exception as e:
        logging.error(f"Error during plagiarism calculation: {e}")
        return 0, []

def send_email_notifications(uploader_email, plagiarism_percentage, matches):
    try:
        subject = f"Plagiarism Alert: {plagiarism_percentage}% similarity detected!"
        body = f"Your project has been flagged for plagiarism with {plagiarism_percentage}% similarity.\n\nMatched projects:\n"
        for match in matches:
            body += f"- {match['project_title']} (Project ID: {match['project_id']})\n"

        # Send email to uploader
        msg = Message(subject, sender=app.config['MAIL_USERNAME'], recipients=[uploader_email])
        msg.body = body
        mail.send(msg)
        logging.info(f"Plagiarism alert email sent to uploader: {uploader_email}")

        # Send emails to each original project owner
        for match in matches:
            owner_email = get_email_by_student_id(match['student_id'])
            if owner_email and owner_email != uploader_email:
                msg = Message(subject, sender=app.config['MAIL_USERNAME'], recipients=[owner_email])
                msg.body = f"One of your projects has been detected as similar to a newly uploaded project:\n\n{body}"
                mail.send(msg)
                logging.info(f"Plagiarism alert email sent to original owner: {owner_email}")

    except Exception as e:
        logging.error(f"Error sending email notifications: {e}")

def get_email_by_student_id(student_id):
    conn = sqlite3.connect(DB_PATH)
    query = f"SELECT email FROM students WHERE student_id = ?"
    result = conn.execute(query, (student_id,)).fetchone()
    conn.close()
    return result[0] if result else None

@app.route('/UploadProject', methods=['POST'])
def check_plagiarism():
    try:
        data = request.json
        logging.info(f"Received data: {data}")

         # Extract project details
        student_id = data.get('student_id')
        title = data.get('title')
        new_project_description = data.get('description', '')
        new_project_category = data.get('category', '')
        supervisor = data.get('supervisor')
        start_date = data.get('start_date')
        end_date = data.get('end_date')
        new_project_keywords = data.get('keywords', '')
        github_url = data.get('github_url')
        new_project_tools = data.get('tools', '')
        new_project_outcome = data.get('outcome', '')
        uploader_email = data.get('uploader_email', 'dasisaisrivathsav2004@gmail.com')

        if not new_project_description:
            logging.warning("Invalid input: Missing description")
            return jsonify({"error": "Invalid input: description is required"}), 400

        new_project_tags = f"{new_project_description} {new_project_category} {new_project_keywords} {new_project_tools} {new_project_outcome}"
        plagiarism_percentage, matches = calculate_plagiarism_percentage(new_project_tags, uploader_email)


        # If plagiarism percentage is below threshold, proceed to upload
        if plagiarism_percentage < 75:
            conn = sqlite3.connect(DB_PATH)
            query = """
                INSERT INTO projects (
                    student_id, project_title, project_description, project_category, 
                    project_supervisor, start_date, end_date, keywords, github_url, 
                    tools_technologies, project_outcome
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            """
            conn.execute(query, [
                student_id, title, new_project_description, new_project_category,
                supervisor, start_date, end_date, new_project_keywords, github_url,
                new_project_tools, new_project_outcome
            ])
            conn.commit()
            conn.close()

            logging.info("Project uploaded successfully.")

        logging.info(f"Plagiarism Percentage: {plagiarism_percentage}%")
        logging.info(f"Matched projects: {matches}%")

        matches_serializable = [
            {k: (int(v) if isinstance(v, (np.int64, np.int32)) else v) for k, v in match.items()}
            for match in matches
        ]

        return jsonify({
            "plagiarism_percentage": plagiarism_percentage,
            "matches": matches_serializable
        }), 200

    except Exception as e:
        logging.error(f"Error in plagiarism check: {e}")
        return jsonify({'error': str(e)}), 500

# -------------------- Main Application --------------------
if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    app.run(debug=True)
