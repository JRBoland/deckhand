import React, { useState } from 'react';
import { Parser } from 'xml2js';

const FileUpload = ({ onFileUpload }) => {
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setError(null);
    onFileUpload([]);

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const xmlData = event.target.result;
      const parser = new Parser({ explicitArray: false, mergeAttrs: true });

      parser.parseString(xmlData, (err, result) => {
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

        const formattedSongs = Array.isArray(tracks)
          ? tracks.map(track => ({
              id: track.TrackID,
              name: track.Name,
              artist: track.Artist,
              bpm: parseFloat(track.AverageBpm),
              key: track.Tonality,
              year: track.Year || null,
              genre: track.Genre || 'Unknown',
              totalTime: track.TotalTime ? parseInt(track.TotalTime, 10) : 0,
            }))
          : [];

        onFileUpload(formattedSongs);
      });
    };
    reader.readAsText(file);
  };

  return (
    <div className="card-brutal p-4">
      <label htmlFor="xml-upload" className="block font-display text-lg font-semibold text-ink mb-2">
        Upload your Playlist XML
      </label>
      <input
        id="xml-upload"
        type="file"
        accept=".xml,text/xml,application/xml,text/*"
        onChange={handleFileChange}
        className="input-brutal file:mr-4 file:py-2 file:px-4 file:rounded-brutal file:border-2 file:border-border file:font-display file:font-semibold file:bg-primary file:text-primary-ink file:shadow-brutal-sm file:cursor-pointer hover:file:bg-[#b8e84a] file:active:translate-x-[1px] file:active:translate-y-[1px] file:active:shadow-none file:transition-all"
      />
      {error && (
        <div className="mt-4 bg-red-50 border-2 border-border border-l-4 border-l-destructive rounded-brutal p-3 shadow-brutal-sm">
          <p className="font-display font-bold text-destructive">Error</p>
          <p className="text-ink text-sm font-sans">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
