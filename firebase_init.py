import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

# Load the Firebase credentials from the environment variable
cred = credentials.Certificate(os.getenv("FIREBASE_ADMIN_CREDENTIALS"))
firebase_admin.initialize_app(cred)

# Initialize Firestore client
db = firestore.client()
