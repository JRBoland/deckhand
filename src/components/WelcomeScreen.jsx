import React from 'react';
import FileUpload from './FileUpload'; // We'll re-use the file upload component
import logo from '../assets/madebybondla.png'; // Import your logo

const WelcomeScreen = ({ onFileUpload }) => {
  return (
    <div className="text-center p-4 sm:p-8">
      
      <h1 className="text-4xl font-bold text-gray-800">
        📀 DECKHAND
      </h1>
      <p className="text-gray-600">
        Plan your set.
        </p>
        <p className="text-gray-600 mt-2 mb-10 text-sm">
        <br/>
        Upload your Rekordbox XML file to get started.
      </p>
      <div className="max-w-xl mx-auto">
        <FileUpload onFileUpload={onFileUpload} />
      </div>
       <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">How It Works:</h2>
        <div className="text-left space-y-4 text-gray-600 text-sm">
            <p>
            <strong className="text-gray-600">1. Export Your Library:</strong> Export your library as an XML from Rekordbox. (File → Export Collection in XML Format)
          </p>
          <p>
            <strong className="text-gray-600">2. Upload Your Library:</strong> Click "Choose File" and select your exported XML file to upload your playlist or collection from Rekordbox (as a `.xml` file).
          </p>
          <p>
            <strong className="text-gray-600">3. Find Compatible Tracks:</strong> Click on any song to see a list of harmonically compatible tracks based on BPM and Camelot key.
          </p>
          <p>
            <strong className="text-gray-600">4. Build & Save Your Set:</strong> Add songs to your setlist, drag to reorder them, and save your creations for later.
          </p>
        </div>
      </div>
      <img
        src={logo}
        alt="DJ Set Planner Logo"
        className="mx-auto mb-8 w-96 h-auto mt-8" // Adjust size as needed
      />
    </div>
  );
};

export default WelcomeScreen;