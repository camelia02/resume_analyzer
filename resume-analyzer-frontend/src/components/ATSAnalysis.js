import React from 'react';
import './ATSAnalysis.css'; // Ensure correct import of the CSS file

const ATSAnalysis = ({ analysis }) => {
  if (!analysis) return <div>Loading...</div>;  // Show loading if analysis data is not yet available

  console.log('Analysis:', analysis);  // Debugging step to check the data passed to the component

  const { ExtractedSkills, ExtractedRequirements, EnhancedSentences, MissingSkills } = analysis;

  return (
    <div className="ats-analysis">
      <h2>ATS Analysis Result</h2>

      {/* Displaying Extracted Skills */}
      <div className="card">
        <h3>Extracted Skills</h3>
        <ul>
          {ExtractedSkills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>

      {/* Displaying Extracted Requirements */}
      <div className="card">
        <h3>Extracted Requirements</h3>
        <ul>
          {ExtractedRequirements.map((requirement, index) => (
            <li key={index}>{requirement}</li>
          ))}
        </ul>
      </div>

      {/* Displaying Enhanced Sentences */}
      <div className="card">
        <h3>Enhanced Sentences</h3>
        {EnhancedSentences.map((sentence, index) => (
          <p key={index}>{sentence}</p>
        ))}
      </div>

      {/* Displaying Missing Skills */}
      <div className="card">
        <h3>Missing Skills</h3>
        <ul>
          {MissingSkills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ATSAnalysis;
