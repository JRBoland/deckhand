import React, { useState } from 'react';
import { useDetectOutsideClick } from '../utils/useDetectOutsideClick';

const FilterControls = ({ isDesktop, filterParams, onFilterChange, yearRange, filteredGenres = [], songLengthRange, isInstructionsVisible, onSetInstructionsVisible, selectedSong }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [genreDropdownRef, isGenreOpen, setIsGenreOpen] = useDetectOutsideClick(false);

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

  const TimeInput = ({ valueInSeconds, onChange }) => {
    const minutes = Math.floor(valueInSeconds / 60);
    const seconds = valueInSeconds % 60;

    const handleMinuteChange = (e) => {
      const newMinutes = parseInt(e.target.value) || 0;
      const currentSeconds = valueInSeconds % 60;
      onChange((newMinutes * 60) + currentSeconds);
    };

    const handleSecondChange = (e) => {
      const newSeconds = parseInt(e.target.value) || 0;
      const currentMinutesInSeconds = Math.floor(valueInSeconds / 60) * 60;
      onChange(currentMinutesInSeconds + newSeconds);
    };

    return (
      <div className="flex items-center gap-2 w-full">
        <input
          type="number"
          value={minutes || ''}
          onChange={handleMinuteChange}
          className="input-brutal py-1.5 text-sm"
          placeholder="Min"
        />
        <input
          type="number"
          value={seconds || ''}
          onChange={handleSecondChange}
          className="input-brutal py-1.5 text-sm"
          placeholder="Sec"
        />
      </div>
    );
  };

  const Switch = ({ label, filterName }) => (
    <div className="flex justify-between items-center">
      <label className="font-display font-semibold text-ink">{label}</label>
      <div className="relative inline-block w-11 h-6 align-middle select-none">
        <input
          type="checkbox"
          checked={filterParams[filterName].enabled}
          onChange={() => handleSwitch(filterName)}
          id={`toggle-${filterName}`}
          className="toggle-checkbox absolute block w-5 h-5 rounded-brutal border-2 border-border bg-surface appearance-none cursor-pointer z-10"
          style={{ boxShadow: '2px 2px 0 var(--color-ink)' }}
        />
        <label
          htmlFor={`toggle-${filterName}`}
          className="toggle-label block overflow-hidden h-6 w-full rounded-brutal bg-gray-200 cursor-pointer"
        />
      </div>
    </div>
  );

  return (
    <div className="card-brutal p-4 mb-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-lg font-bold text-ink">Filter Options</h3>
        {isDesktop && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-sm font-display font-semibold text-ink hover:underline underline-offset-2"
          >
            {isOpen ? 'Hide' : 'Show'}
          </button>
        )}
      </div>
      {(isOpen || !isDesktop) && (
        <>
          <hr className="my-3 border-border border-t-2" />
          <div className="space-y-4">
            <div className="p-3 rounded-brutal bg-gray-100 border-2 border-border">
              <Switch label="BPM" filterName="bpm" />
              {filterParams.bpm.enabled && (
                <div className="pt-3">
                  <label className="text-sm font-sans text-ink">Range: +/- {filterParams.bpm.value}%</label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={filterParams.bpm.value}
                    onChange={(e) => onFilterChange({ ...filterParams, bpm: { ...filterParams.bpm, value: parseInt(e.target.value) } })}
                    className="w-full mt-1 accent-primary"
                  />
                </div>
              )}
            </div>

            <div className="p-3 rounded-brutal bg-gray-100 border-2 border-border">
              <Switch label="Harmonic Key" filterName="key" />
            </div>

            <div className="p-3 rounded-brutal bg-gray-100 border-2 border-border">
              <Switch label="Genre" filterName="genre" />
              {filterParams.genre.enabled && (
                <div className="pt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-sans flex-wrap">
                    <label className="text-ink">Hide genres with less than</label>
                    <input
                      type="number"
                      value={filterParams.genre.minCount}
                      onChange={(e) => onFilterChange({ ...filterParams, genre: { ...filterParams.genre, minCount: parseInt(e.target.value) || 0 } })}
                      className="input-brutal w-16 py-1 text-sm"
                    />
                    <label className="text-ink">songs</label>
                  </div>
                  <div className="relative" ref={genreDropdownRef}>
                    <button
                      onClick={() => setIsGenreOpen(!isGenreOpen)}
                      className="input-brutal w-full text-left"
                    >
                      {filterParams.genre.selected.length > 0 ? `${filterParams.genre.selected.length} genre(s) selected` : 'Select Genres...'}
                    </button>
                    {isGenreOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full card-brutal z-30 max-h-48 overflow-y-auto p-1">
                        {filteredGenres.map(genre => (
                          <label
                            key={genre.name}
                            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-brutal cursor-pointer font-sans text-ink"
                          >
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={filterParams.genre.selected.includes(genre.name)}
                                onChange={() => handleGenreChange(genre.name)}
                                className="rounded border-2 border-border"
                              />
                              <span>{genre.name}</span>
                            </div>
                            <span className="text-xs text-mute">{genre.count}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 rounded-brutal bg-gray-100 border-2 border-border">
              <Switch label="Release Year" filterName="year" />
              {filterParams.year.enabled && (
                <div className="pt-3 flex items-center justify-between gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min={yearRange.min}
                    max={yearRange.max}
                    value={filterParams.year.min || ''}
                    onChange={(e) => onFilterChange({ ...filterParams, year: { ...filterParams.year, min: e.target.value ? parseInt(e.target.value) : null } })}
                    className="input-brutal py-1.5 text-sm"
                  />
                  <span className="font-display font-bold text-ink">–</span>
                  <input
                    type="number"
                    placeholder="Max"
                    min={yearRange.min}
                    max={yearRange.max}
                    value={filterParams.year.max || ''}
                    onChange={(e) => onFilterChange({ ...filterParams, year: { ...filterParams.year, max: e.target.value ? parseInt(e.target.value) : null } })}
                    className="input-brutal py-1.5 text-sm"
                  />
                </div>
              )}
            </div>

            <div className="p-3 rounded-brutal bg-gray-100 border-2 border-border">
              <Switch label="Song Length" filterName="length" />
              {filterParams.length.enabled && (
                <div className="pt-3 space-y-2">
                  <select
                    value={filterParams.length.comparison}
                    onChange={(e) => onFilterChange({ ...filterParams, length: { ...filterParams.length, comparison: e.target.value } })}
                    className="input-brutal text-sm"
                  >
                    <option value="between">Between</option>
                    <option value="greater">Greater than</option>
                    <option value="less">Less than</option>
                  </select>
                  <div className="flex items-center justify-between gap-2">
                    <TimeInput
                      valueInSeconds={filterParams.length.value1}
                      onChange={(newTotalSeconds) => onFilterChange({ ...filterParams, length: { ...filterParams.length, value1: newTotalSeconds } })}
                    />
                    {filterParams.length.comparison === 'between' && (
                      <>
                        <span className="font-display font-bold text-ink">–</span>
                        <TimeInput
                          valueInSeconds={filterParams.length.value2}
                          onChange={(newTotalSeconds) => onFilterChange({ ...filterParams, length: { ...filterParams.length, value2: newTotalSeconds } })}
                        />
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            <hr className="my-3 border-border border-t-2" />
            {!isDesktop && (
              <div className="flex justify-between items-center p-3 rounded-brutal bg-gray-100 border-2 border-border mb-4">
                <label className="font-display font-semibold text-ink">Show Quick Guide</label>
                <div className="relative inline-block w-11 h-6 align-middle select-none">
                  <input
                    type="checkbox"
                    checked={isInstructionsVisible}
                    onChange={() => onSetInstructionsVisible(!isInstructionsVisible)}
                    id="toggle-instructions-mobile"
                    className="toggle-checkbox absolute block w-5 h-5 rounded-brutal border-2 border-border bg-surface appearance-none cursor-pointer z-10"
                    style={{ boxShadow: '2px 2px 0 var(--color-ink)' }}
                  />
                  <label
                    htmlFor="toggle-instructions-mobile"
                    className="toggle-label block overflow-hidden h-6 w-full rounded-brutal bg-gray-200 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FilterControls;
