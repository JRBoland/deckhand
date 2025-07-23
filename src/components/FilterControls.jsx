import React from 'react';
import { useDetectOutsideClick } from '../utils/useDetectOutsideClick';

const FilterControls = ({ filterParams, onFilterChange, yearRange, filteredGenres = [], songLengthRange, isInstructionsVisible, onSetInstructionsVisible, selectedSong }) => {
  const [genreDropdownRef, isGenreOpen, setIsGenreOpen] = useDetectOutsideClick(false);

  // Guard against missing initial props
  if (!filterParams.length || !yearRange || !filteredGenres) {
    return null;
  }

  const handleSwitch = (filterName) => {
    onFilterChange({ ...filterParams, [filterName]: { ...filterParams[filterName], enabled: !filterParams[filterName].enabled } });
  };

  const handleGenreChange = (genreName) => {
    const currentSelected = filterParams.genre.selected || [];
    const newSelected = currentSelected.includes(genreName) ? currentSelected.filter(g => g !== genreName) : [...currentSelected, genreName];
    onFilterChange({ ...filterParams, genre: { ...filterParams.genre, selected: newSelected } });
  };

  // Helper component for the two-part time input
  const TimeInput = ({ valueInSeconds, onChange }) => {
    const minutes = Math.floor(valueInSeconds / 60);
    const seconds = valueInSeconds % 60;

    const handleMinuteChange = (e) => {
      const newMinutes = parseInt(e.target.value) || 0;
      onChange((newMinutes * 60) + seconds);
    };

    const handleSecondChange = (e) => {
      const newSeconds = parseInt(e.target.value) || 0;
      onChange((minutes * 60) + newSeconds);
    };

    return (
      <div className="flex items-center gap-2 w-full">
        <input 
          type="number" 
          value={minutes || ''} 
          onChange={handleMinuteChange} 
          className="w-full p-1 border rounded text-sm" 
          placeholder="Minutes" 
        />
        <input 
          type="number" 
          value={seconds || ''} 
          onChange={handleSecondChange} 
          className="w-full p-1 border rounded text-sm" 
          placeholder="Seconds" 
        />
      </div>
    );
  };

  const Switch = ({ label, filterName }) => (
    <div className="flex justify-between items-center">
      <label className="font-semibold">{label}</label>
      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
        <input type="checkbox" checked={filterParams[filterName].enabled} onChange={() => handleSwitch(filterName)} id={`toggle-${filterName}`} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
        <label htmlFor={`toggle-${filterName}`} className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg mb-3 text-gray-800">Filter Options</h3>
      
      <div className="space-y-4">

        <div className="p-2 rounded-lg bg-gray-50">
          <Switch label="BPM" filterName="bpm" />
          {filterParams.bpm.enabled && (
            <div className="pt-3">
              <label className="text-sm">Range: +/- {filterParams.bpm.value}%</label>
              <input type="range" min="1" max="20" value={filterParams.bpm.value} onChange={(e) => onFilterChange({ ...filterParams, bpm: { ...filterParams.bpm, value: parseInt(e.target.value) } })} className="w-full mt-1" />
            </div>
          )}
        </div>

        <div className="p-2 rounded-lg bg-gray-50">
          <Switch label="Harmonic Key" filterName="key" />
        </div>

        {/* --- UPDATED Genre --- */}
        <div className="p-2 rounded-lg bg-gray-50">
          <Switch label="Genre" filterName="genre" />
          {filterParams.genre.enabled && (
            <div className="pt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <label>Hide genres with less than</label>
                <input 
                  type="number" 
                  value={filterParams.genre.minCount}
                  onChange={(e) => onFilterChange({ ...filterParams, genre: {...filterParams.genre, minCount: parseInt(e.target.value) || 0}})}
                  className="w-16 p-1 border rounded" 
                />
                <label>songs</label>
              </div>
              <div className="relative" ref={genreDropdownRef}>
                <button onClick={() => setIsGenreOpen(!isGenreOpen)} className="w-full p-2 border rounded text-sm text-left bg-white">
                  {filterParams.genre.selected.length > 0 ? `${filterParams.genre.selected.length} genre(s) selected` : 'Select Genres...'}
                </button>
                {isGenreOpen && (
                  <div className="absolute top-full left-0 mt-1 w-full bg-white border rounded-lg shadow-xl z-30 max-h-48 overflow-y-auto">
                    {filteredGenres.map(genre => (
                      <label key={genre.name} className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" checked={filterParams.genre.selected.includes(genre.name)} onChange={() => handleGenreChange(genre.name)} />
                          <span>{genre.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">{genre.count}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="p-2 rounded-lg bg-gray-50">
          <Switch label="Release Year" filterName="year" />
          {filterParams.year.enabled && (
            <div className="pt-3 flex items-center justify-between gap-2">
              <input type="number" placeholder="Min" min={yearRange.min} max={yearRange.max} value={filterParams.year.min || ''} onChange={(e) => onFilterChange({ ...filterParams, year: {...filterParams.year, min: e.target.value ? parseInt(e.target.value) : null }})} className="w-full p-1 border rounded text-sm"/>
              <span>-</span>
              <input type="number" placeholder="Max" min={yearRange.min} max={yearRange.max} value={filterParams.year.max || ''} onChange={(e) => onFilterChange({ ...filterParams, year: {...filterParams.year, max: e.target.value ? parseInt(e.target.value) : null }})} className="w-full p-1 border rounded text-sm"/>
            </div>
          )}
        </div>

        {/* --- UPDATED Song Length --- */}
        <div className="p-2 rounded-lg bg-gray-50">
          <Switch label="Song Length" filterName="length" />
          {filterParams.length.enabled && (
            <div className="pt-3 space-y-2">
              <select 
                value={filterParams.length.comparison}
                onChange={(e) => onFilterChange({ ...filterParams, length: {...filterParams.length, comparison: e.target.value }})}
                className="w-full p-1 border rounded text-sm"
              >
                <option value="between">Between</option>
                <option value="greater">Greater than</option>
                <option value="less">Less than</option>
              </select>
              <div className="flex items-center justify-between gap-2">
                <TimeInput 
                  valueInSeconds={filterParams.length.value1} 
                  onChange={(newTotalSeconds) => onFilterChange({...filterParams, length: {...filterParams.length, value1: newTotalSeconds}})}
                />
                {filterParams.length.comparison === 'between' && (
                  <>
                    <span className="">-</span>
                    <TimeInput 
                      valueInSeconds={filterParams.length.value2} 
                      onChange={(newTotalSeconds) => onFilterChange({...filterParams, length: {...filterParams.length, value2: newTotalSeconds}})}
                    />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
<hr className="my-3" />
<div className="flex justify-between items-center p-2 rounded-lg bg-gray-50 mb-4">
        <label className="font-semibold">Show Quick Guide</label>
        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
          <input 
            type="checkbox" 
            checked={isInstructionsVisible} 
            onChange={() => onSetInstructionsVisible(!isInstructionsVisible)} 
            id="toggle-instructions" 
            className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" 
          />
          <label 
            htmlFor="toggle-instructions" 
            className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
          ></label>
        </div>
      </div>
      </div>
    </div>
  );
};

export default FilterControls;