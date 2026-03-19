import React, { useState, useEffect } from 'react';
import FilterControls from './FilterControls';

const MobileFilters = ({ isDesktop, isOpen, onClose, filterParams, onFilterChange, yearRange, filteredGenres, songLengthRange, onClearLibrary, isInstructionsVisible, onSetInstructionsVisible }) => {
  const [draftParams, setDraftParams] = useState(filterParams);

  useEffect(() => {
    if (isOpen) {
      setDraftParams(filterParams);
    }
  }, [isOpen, filterParams]);

  if (!isOpen) return null;

  const handleOkClick = () => {
    onFilterChange(draftParams);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-center items-center p-4" style={{ backgroundColor: 'rgba(10,10,10,0.6)' }}>
      <div className="card-brutal w-full max-w-md p-6 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-2xl font-bold text-ink">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-brutal border-2 border-border bg-surface font-display font-bold text-ink shadow-brutal-sm hover:bg-gray-100 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto pr-2 flex-1">
          <FilterControls
            filterParams={draftParams}
            onFilterChange={setDraftParams}
            yearRange={yearRange}
            filteredGenres={filteredGenres}
            songLengthRange={songLengthRange}
            isInstructionsVisible={isInstructionsVisible}
            onSetInstructionsVisible={onSetInstructionsVisible}
            isDesktop={isDesktop}
          />
        </div>

        <div className="flex items-center justify-between pr-2 mt-4 gap-2 flex-wrap">
          <button
            onClick={onClearLibrary}
            className="py-2 px-3 text-sm font-display font-semibold text-destructive border-2 border-border rounded-brutal bg-surface shadow-brutal-sm hover:bg-red-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
          >
            Clear Library
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleOkClick}
              className="btn-primary px-4 py-2 text-sm"
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
