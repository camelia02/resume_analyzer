from flask import Flask, request, jsonify
from flask_cors import CORS
from firebase_init import db  # Importing the Firestore client from firebase_init
from dotenv import load_dotenv
from gemini_integration import analyze_job_description
import os
from werkzeug.utils import secure_filename
from PyPDF2 import PdfReader
import json

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow requests from React app


UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def pdf_to_text(pdf_path):
    """Extract text from a PDF file."""
    reader = PdfReader(pdf_path)
    text = ''
    for page in reader.pages:
        text += page.extract_text()
    return text

@app.route('/analyze-job-description', methods=['POST'])
def analyze_job():
    """Analyze a job description and resume to extract skills, requirements, and missing keywords."""
    try:
        # Get the JSON data from the request
        data = request.get_json()

        # Extract the job description and resume text from the JSON data
        job_description = data.get("jobDescription")
        resume_text = data.get("resumeText")

        if not job_description or not resume_text:
            return jsonify({"error": "Both job description and resume text are required"}), 400

        # Construct prompt for Gemini API
        prompt = f"""
        Act as a hiring manager with 20 years of experience.

        Analyze the following resume and job description:

        Resume: {resume_text}

        Job Description: {job_description}

        1. Extract key skills and requirements from the job description.
        2. Identify matching sentences or sections in the resume that align with the job description.
           - If a match exists, enhance the sentence to better fit with keywords from the job description.
           - If no match exists, suggest improvements to include missing keywords.
        3. Provide a short and concise list of missing skills or requirements not found in the resume.
        4. Return a cleaned, structured response with the following fields:


        {{
            "Skills": [],
            "Requirements": [list of requirements extracted from the job description],
            "Enhancement": [list of enhanced sentences from the resume that match job description keywords],
            "MissingSkills": [list of missing skills or requirements that are not found in the resume],
            "Explanation" : 
        }}

        Your response must strictly follow the format above in a string format (You must nott append the word json at the beggining of your response).
        """

        # Analyze using Gemini API
        analysis_response= analyze_job_description(prompt)
        

        if analysis_response is None:
            return jsonify({"error": "Failed to analyze job description"}), 500

        # print("Final API Response to Frontend:", analysis_response)
        return analysis_response, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify the service is running."""
    return jsonify({"status": "healthy"}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
