// src/components/FilterControls.jsx
import React from 'react';

const FilterControls = ({ filterParams, onFilterChange, selectedSong }) => {
  if (!selectedSong) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-3">Filter Options</h3>
      <div className="flex justify-between items-center mb-4">
        <label
          htmlFor="bpm-range"
          className="block text-sm font-medium text-gray-700"
        >
          BPM Range (+/- {filterParams.bpmPercent}%)
        </label>
        <input
          id="bpm-range"
          type="range"
          min="1"
          max="20"
          value={filterParams.bpmPercent}
          onChange={(e) =>
            onFilterChange({
              ...filterParams,
              bpmPercent: parseInt(e.target.value, 10),
            })
          }
          className="w-1/2 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
      <div className="flex justify-between items-center">
        <label htmlFor="harmonic-switch" className="text-sm font-medium text-gray-700">
          Use Harmonic Mixing (Camelot)
        </label>
        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
          <input
            type="checkbox"
            name="harmonic-switch"
            id="harmonic-switch"
            checked={filterParams.useHarmonic}
            onChange={(e) =>
              onFilterChange({
                ...filterParams,
                useHarmonic: e.target.checked,
              })
            }
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
          />
          <label
            htmlFor="harmonic-switch"
            className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
          ></label>
        </div>
      </div>
    </div>
  );
};

// Add this simple CSS to your index.css for the toggle switch to work
/*
.toggle-checkbox:checked {
  right: 0;
  border-color: #4f46e5;
}
.toggle-checkbox:checked + .toggle-label {
  background-color: #4f46e5;
}
*/
export default FilterControls;