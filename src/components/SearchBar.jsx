import React from 'react';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="mb-6">
      <label htmlFor="search" className="sr-only">
        Search Songs
      </label>
      <input
        type="text"
        id="search"
        placeholder="Search for a song or artist..."
        className="w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;