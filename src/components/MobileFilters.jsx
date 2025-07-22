// src/components/MobileFilters.jsx
import React from 'react';
import FilterControls from './FilterControls';

const MobileFilters = ({ isOpen, onClose, filterParams, onFilterChange, yearRange, allGenres, songLengthRange, onClearLibrary }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button onClick={onClose} className="font-bold text-2xl">&times;</button>
        </div>
        
        {/* Re-use the FilterControls component, passing ALL necessary props */}
        <FilterControls 
          filterParams={filterParams}
          onFilterChange={onFilterChange}
          yearRange={yearRange}
          allGenres={allGenres}
          songLengthRange={songLengthRange}
        />
        
        <button
          onClick={() => {
            onClearLibrary();
            onClose(); // Close modal after action
          }}
          className="w-full mt-4 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700"
        >
          Clear Library
        </button>
      </div>
    </div>
  );
};

export default MobileFilters;