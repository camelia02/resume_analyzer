import React, { useState } from 'react';
import { GlobalWorkerOptions } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';
import './ATSForm.css';

// Set the worker for PDF.js
GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.mjs`;

const ATSForm = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setResumeText(reader.result);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobDescription || !resumeText) {
      setErrorMessage('Both job description and resume text are required.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    const payload = {
      jobDescription,
      resumeText,
    };

    try {
      const response = await fetch('http://localhost:5000/analyze-job-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      console.log("Received API Response:", result);

      if (result) {
        setAnalysis(result);
      } else {
        setErrorMessage('No analysis data received.');
      }
    } catch (error) {
      setErrorMessage('Failed to submit the form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderList = (title, items) => {
    if (!Array.isArray(items) || items.length === 0) return null; // Check if items is an array
    return (
      <div className="analysis-card">
        <h4>{title}</h4>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  };
  

  const parseAnalysis = () => {
    if (!analysis) {
      return <p>No analysis available yet. Please submit the form to analyze the resume and job description.</p>;
    }

    const { Skills = [], Requirements = [], Enhancement = [], MissingSkills = [], Explanation } = analysis;

    console.log("Extracted Skills:", Skills);
    console.log("Extracted Requirements:", Requirements);
    console.log("Enhanced Sentences:", Enhancement);
    console.log("Missing Skills:", MissingSkills);
    console.log("Missing Skills:", Explanation);
    return (
      <div className='analysis-container'>
        {renderList("Extracted Skills", Skills)}
        {renderList("Extracted Requirements", Requirements)}
        {renderList("Enhanced Sentences", Enhancement)} {/* Render Enhanced Sentences */}
        {renderList("Missing Skills", Skills)}
        {renderList("Explanation", Explanation)}
      </div>
    );
  };

  return (
    <div className="ats-form">
      <h2>ATS Resume Analyzer</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="jobDescription">Job Description</label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            placeholder="Enter job description here..."
            required
          />
        </div>
        <div>
          <label htmlFor="resume">Resume (PDF)</label>
          <input
            type="file"
            id="resume"
            accept="application/pdf"
            onChange={handleResumeChange}
            required
          />
        </div>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type="submit" disabled={loading}>Analyze</button>
      </form>

      {loading && <p>Loading...</p>}

      {/* Display analysis result if available */}
      {parseAnalysis()}
    </div>
  );
};

export default ATSForm;
