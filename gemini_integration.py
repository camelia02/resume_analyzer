import os
from dotenv import load_dotenv
from google import genai
import json

# Load environment variables from .env file
load_dotenv()

# Get Gemini API key from environment variables
api_key = os.getenv("GEMINI_API_KEY")

# Initialize the Gemini client
client = genai.Client(api_key=api_key)

def analyze_job_description(job_description):
    """Analyze job description and extract key skills using Gemini."""
    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=f"{job_description}"
        )
        # Process response (assuming it's in string format)
        response_text = response.text.strip()
        start_index = response_text.find('{')
        end_index = response_text.rfind('}')
        if start_index != -1 and end_index != -1:
            response_lines = response_text[start_index:end_index + 1]
            print(response_lines)
        else:
            print("Invalid response format.")
       
        try:
            return json.loads(response_lines)  # Convert the string to a JSON object
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return None
        
    except Exception as e:
        print(f"Error interacting with Gemini API: {e}")
        return None

if __name__ == "__main__":
    job_description = "We are looking for a Python developer with experience in Flask, Firebase, and Docker."
    skills = analyze_job_description(job_description)
    print(f"Extracted Skills: {skills}")
