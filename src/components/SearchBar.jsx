import React from 'react';

const SearchBar = React.forwardRef(({ onSearch, isHighlighted }, ref) => {
  return (
    <div className="mb-6 scroll-mt-4" ref={ref}>
      <label htmlFor="search" className="sr-only">
        Search Songs
      </label>
      <input
        type="text"
        id="search"
        placeholder="Search for a song or artist..."
        className={`input-brutal ${isHighlighted ? 'animate-glow-pulse shadow-glow border-accent' : ''}`}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
});

export default SearchBar;
