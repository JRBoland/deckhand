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
        Your silent partner in the mix.
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
            <strong className="text-gray-600">1. Export & Upload:</strong> Export your library from Rekordbox (File → Export Collection in XML Format) and upload it above.
          </p>
          <p>
            <strong className="text-gray-600">2. Select a Track:</strong> Click on any song in your library to see a list of potential next tracks.
          </p>
          <p>
            <strong className="text-gray-600">3. Filter with Precision:</strong> Enable and adjust powerful filters for BPM, Harmonic Key, Genre, Release Year, and Song Length to find the perfect match.
          </p>
          <p>
            <strong className="text-gray-600">4. Build & Export Your Set:</strong> Add songs to your setlist, drag to reorder them (hold & drag on mobile), and export your creation as a text or CSV file to help you with your next mix.
          </p>
        </div>
      </div>
      <img
        src={logo}
        alt="DJ Set Planner Logo"
        className="mx-auto w-96 h-auto mt-8" // Adjust size as needed
      />
    </div>
  );
};

export default WelcomeScreen;