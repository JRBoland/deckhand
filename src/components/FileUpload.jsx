// src/components/FileUpload.jsx
import React from 'react';
import { Parser } from 'xml2js';

const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const xmlData = event.target.result;
      const parser = new Parser({ explicitArray: false, mergeAttrs: true });

      parser.parseString(xmlData, (err, result) => {
        if (err) {
          console.error("Failed to parse XML:", err);
          // Future improvement: Show an error message to the user.
          return;
        }

        // This path is critical and depends on your XML's structure.
        // You MUST inspect a sample XML file to get this right.
        // For RekordBox, it's often similar to this:
        const tracks = result?.DJ_PLAYLISTS?.COLLECTION?.TRACK || [];

        const formattedSongs = tracks.map(track => ({
          id: track.TrackID, // A unique ID is great to have
          name: track.Name,
          artist: track.Artist,
          bpm: parseFloat(track.AverageBpm),
          key: track.Tonality,
        }));

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
        accept=".xml"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />
    </div>
  );
};

export default FileUpload;