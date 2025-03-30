import React from 'react';
import ATSForm from './components/ATSForm'; 

function App() {
  return (
    <div className="App">
      <ATSForm /> {/* Render your ATSForm component */}
    </div>
  );
}

export default App;


/*Backend Connection Test Below */
// import React, { useState, useEffect } from 'react';
// function App() {
//   const [status, setStatus] = useState('Checking...');
  
//   useEffect(() => {
//     fetch('/health') // Calls Flask's health check endpoint
//       .then((response) => response.json())
//       .then((data) => setStatus(data.status))
//       .catch((error) => setStatus('Failed to connect to backend.'));
//   }, []);

//   return (
//     <div className="App">
//       <h1>React + Flask Connection Test</h1>
//       <p>Backend Status: {status}</p>
//     </div>
//   );
// }

// export default App;
