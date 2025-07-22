import React, { useState } from 'react'; // <-- Import useState
import { Parser } from 'xml2js';

const FileUpload = ({ onFileUpload }) => {
  // NEW: State to hold any error messages
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    // NEW: Clear any previous errors when a new file is selected
    setError(null);
    onFileUpload([]); // Clear old song list

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const xmlData = event.target.result;
      const parser = new Parser({ explicitArray: false, mergeAttrs: true });

      parser.parseString(xmlData, (err, result) => {
        // --- ERROR HANDLING LOGIC ---
        if (err) {
          console.error("Failed to parse XML:", err);
          setError("Could not read file. Please ensure it's a valid XML from your DJ software.");
          return;
        }

        const tracks = result?.DJ_PLAYLISTS?.COLLECTION?.TRACK;
        if (!tracks) {
            setError("File read successfully, but no tracks were found. Please check the XML file structure.");
            return;
        }
        // --- END ERROR HANDLING ---

        const formattedSongs = Array.isArray(tracks) 
  ? tracks.map(track => ({
      id: track.TrackID,
      name: track.Name,
      artist: track.Artist,
      bpm: parseFloat(track.AverageBpm),
      key: track.Tonality,
      // CORRECTED: Ensure these fields are always read
      year: track.Year || null, 
      genre: track.Genre || 'Unknown',
      totalTime: track.TotalTime ? parseInt(track.TotalTime, 10) : 0,
    }))
  : []; // Handle case where there's only one track

        onFileUpload(formattedSongs);
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="mb-6 p-4 border-2 border-dashed rounded-lg">
      <label htmlFor="xml-upload" className="block text-lg font-medium text-gray-700 mb-2">
        Upload your Playlist XML
      </label>
      <input
        id="xml-upload"
        type="file"
        accept=".xml,text/xml,application/xml,text/*"
        onChange={handleFileChange}
        className="mt-1 block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-indigo-50 file:text-indigo-700
                   hover:file:bg-indigo-100"
      />
      {/* NEW: Conditionally display the error message */}
      {error && (
        <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-r-lg">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;