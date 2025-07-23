import React, { useState, useEffect } from 'react';
import FilterControls from './FilterControls';

const MobileFilters = ({ isOpen, onClose, filterParams, onFilterChange, yearRange, filteredGenres, songLengthRange, onClearLibrary, isInstructionsVisible, onSetInstructionsVisible }) => {
  // NEW: Create a local 'draft' state to hold changes while the modal is open.
  const [draftParams, setDraftParams] = useState(filterParams);

  // NEW: This effect resets the draft to the main settings every time the modal is opened.
  useEffect(() => {
    if (isOpen) {
      setDraftParams(filterParams);
    }
  }, [isOpen, filterParams]);

  if (!isOpen) return null;

  const handleOkClick = () => {
    onFilterChange(draftParams); // Apply the draft changes to the main app state
    onClose(); // Then close the modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Settings</h2>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          {/* FilterControls now modifies the 'draftParams' state, not the main app state */}
          <FilterControls 
            filterParams={draftParams}
            onFilterChange={setDraftParams}
            yearRange={yearRange}
            filteredGenres={filteredGenres}
            songLengthRange={songLengthRange}
            isInstructionsVisible={isInstructionsVisible}
            onSetInstructionsVisible={onSetInstructionsVisible}
          />
        </div>
        
        <div className="flex items-center justify-between pr-2 mt-4">
          <button
            onClick={onClearLibrary}
            className="py-2 text-sm font-semibold text-red-600 hover:bg-red-100 rounded-lg transition"
          >
            Clear Library
          </button>
          
          <div className="flex items-center gap-2">
            {/* "Cancel" just closes the modal, discarding the draft changes */}
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            {/* "OK" now calls our new handler to save the changes */}
            <button
              onClick={handleOkClick}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilters;