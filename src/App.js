// src/App.js
import { useState, useEffect, useMemo, useRef } from 'react';
import { checkCamelotCompatibility } from './utils/camelotWheelHelper';
import SongList from './components/SongList';
import FilterControls from './components/FilterControls';
import SearchBar from './components/SearchBar';
import SelectedSongDisplay from './components/SelectedSongDisplay';
import CurrentPlaylist from './components/CurrentPlaylist';
import WelcomeScreen from './components/WelcomeScreen';
import Instructions from './components/Instructions';
import MobileFilters from './components/MobileFilters';
import LoadPlaylistModal from './components/LoadPlaylistModal';

function App() {
  const [allSongs, setAllSongs] = useState(() => {
    const saved = localStorage.getItem('deckhand-allSongs');
    return saved ? JSON.parse(saved) : [];
  });
  const [displaySongs, setDisplaySongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const renamePlaylist = (playlistId, newName) => {
    setSavedPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === playlistId ? { ...playlist, name: newName } : playlist
      )
    );
  };
  const [isSearchHighlighted, setIsSearchHighlighted] = useState(false);
  const searchBarRef = useRef(null);
  const scrollToSearch = () => {
    searchBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Activate the highlight
    setIsSearchHighlighted(true);

    // Set a timer to remove the highlight after 2 seconds (2000 milliseconds)
    setTimeout(() => {
      setIsSearchHighlighted(false);
    }, 2000);
  };
  
  const [filterParams, setFilterParams] = useState({
    bpm: { enabled: true, value: 5 },
    key: { enabled: true },
    genre: { enabled: false, selected: [], minCount: 2 },
    year: { enabled: false, min: null, max: null },
    length: { enabled: false, comparison: 'between', value1: 0, value2: 600 }, 
  });
  
  const [currentPlaylist, setCurrentPlaylist] = useState(() => {
    const saved = localStorage.getItem('deckhand-currentPlaylist');
    return saved ? JSON.parse(saved) : [];
  });
  const [savedPlaylists, setSavedPlaylists] = useState(() => {
    const saved = localStorage.getItem('deckhand-savedPlaylists');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('deckhand-currentPlaylist', JSON.stringify(currentPlaylist));
    localStorage.setItem('deckhand-savedPlaylists', JSON.stringify(savedPlaylists));
  }, [currentPlaylist, savedPlaylists]);

  const handleFileUpload = (songs) => {
    setAllSongs(songs);
    localStorage.setItem('deckhand-allSongs', JSON.stringify(songs));
  };

  const handleSongSelect = (song) => setSelectedSong(song);
  const clearSelection = () => setSelectedSong(null);
  
  const addToPlaylist = (song) => {
    setCurrentPlaylist((prevPlaylist) => [...prevPlaylist, song]);
    setSelectedSong(song);
  };

  const clearLibrary = () => {
    if (window.confirm("Are you sure you want to clear your library and all saved playlists?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const { yearRange, genreData, songLengthRange } = useMemo(() => {
    if (allSongs.length === 0) {
      return {
        yearRange: { min: 1980, max: new Date().getFullYear() },
        genreData: [],
        songLengthRange: { min: 0, max: 600 }
      };
    }
    const years = allSongs.map(s => parseInt(s.year, 10)).filter(y => !isNaN(y));
    const lengths = allSongs.map(s => s.totalTime).filter(t => !isNaN(t));
    const genreCounts = allSongs.reduce((acc, song) => {
      if (song.genre) {
        acc[song.genre] = (acc[song.genre] || 0) + 1;
      }
      return acc;
    }, {});
    const calculatedGenreData = Object.entries(genreCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    return {
      yearRange: { min: years.length ? Math.min(...years) : 1980, max: years.length ? Math.max(...years) : new Date().getFullYear() },
      genreData: calculatedGenreData,
      songLengthRange: { min: lengths.length ? Math.min(...lengths) : 0, max: lengths.length ? Math.max(...lengths) : 600 }
    };
  }, [allSongs]);

  const filteredGenres = genreData.filter(g => g.count >= filterParams.genre.minCount);

  const saveCurrentPlaylist = () => {
    const playlistName = prompt("Enter a name for this playlist:", `My Setlist ${savedPlaylists.length + 1}`);
    if (playlistName) {
      const newPlaylist = { id: Date.now(), name: playlistName, songs: currentPlaylist };
      setSavedPlaylists(prev => [...prev, newPlaylist]);
      setCurrentPlaylist([]);
    }
  };

  const loadPlaylist = (songs) => {
    setCurrentPlaylist(songs);
  };

  const deletePlaylist = (playlistId) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      setSavedPlaylists(prev => prev.filter(p => p.id !== playlistId));
    }
  };

  const removeFromPlaylist = (indexToRemove) => {
    setCurrentPlaylist(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handlePlaylistDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(currentPlaylist);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCurrentPlaylist(items);
  };

  useEffect(() => {
    if (songLengthRange) {
      setFilterParams(prev => ({
        ...prev,
        length: { 
          ...prev.length,
          value1: songLengthRange.min, 
          value2: songLengthRange.max
        },
      }));
    }
  }, [songLengthRange]);

  useEffect(() => {
    if (!allSongs.length) return;
    let songsToShow = [...allSongs];
    if (selectedSong) {
      songsToShow = allSongs.filter((song) => {
        if (song.id === selectedSong.id) return false;
        const isBpmMatch = !filterParams.bpm.enabled || (song.bpm >= (selectedSong.bpm * (1 - filterParams.bpm.value / 100)) && song.bpm <= (selectedSong.bpm * (1 + filterParams.bpm.value / 100)));
        const isKeyMatch = !filterParams.key.enabled || checkCamelotCompatibility(selectedSong.key, song.key);
        const songYear = parseInt(song.year, 10);
        const isYearMatch = !filterParams.year.enabled || (!song.year ? false : ((!filterParams.year.min || songYear >= filterParams.year.min) && (!filterParams.year.max || songYear <= filterParams.year.max)));
        const isGenreMatch = !filterParams.genre.enabled || filterParams.genre.selected.length === 0 || filterParams.genre.selected.includes(song.genre);
        const lengthParams = filterParams.length;
        let isLengthMatch = !lengthParams.enabled;
        if (lengthParams.enabled) {
          switch (lengthParams.comparison) {
            case 'greater': isLengthMatch = song.totalTime >= lengthParams.value1; break;
            case 'less': isLengthMatch = song.totalTime <= lengthParams.value1; break;
            case 'between': isLengthMatch = song.totalTime >= lengthParams.value1 && song.totalTime <= lengthParams.value2; break;
            default: isLengthMatch = true;
          }
        }
        return isBpmMatch && isKeyMatch && isYearMatch && isGenreMatch && isLengthMatch;
      });
    } else if (searchTerm) {
      songsToShow = songsToShow.filter((song) => song.name.toLowerCase().includes(searchTerm.toLowerCase()) || song.artist.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setDisplaySongs(songsToShow);
  }, [searchTerm, selectedSong, allSongs, filterParams]);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      <div className="container mx-auto max-w-6xl flex-grow">
        <MobileFilters 
          isOpen={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
          filterParams={filterParams}
          onFilterChange={setFilterParams}
          yearRange={yearRange}
          filteredGenres={filteredGenres}
          songLengthRange={songLengthRange}
          onClearLibrary={clearLibrary}
        />
        <LoadPlaylistModal
          isOpen={isLoadModalOpen}
          onClose={() => setIsLoadModalOpen(false)}
          savedPlaylists={savedPlaylists}
          onLoad={(songs) => {
            loadPlaylist(songs);
            setIsLoadModalOpen(false);
          }}
          onDelete={deletePlaylist}
          onRename={renamePlaylist}
        />
        {allSongs.length === 0 ? (
          <div className="p-4 md:p-8">
            <WelcomeScreen onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="p-0 md:p-8">
            <header className="relative md:text-center mb-4 md:mb-8 px-4 pt-4 md:px-0 md:pt-0">
              <div className="flex items-center justify-between md:justify-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">📀 DECKHAND</h1>
                {/* Grouping the mobile buttons */}
                <div className="flex items-center md:hidden">
                  <button onClick={scrollToSearch} className="p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  <button onClick={() => setIsMobileFiltersOpen(true)} className="p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 16v-2m8-8h2M4 12H2m15.364 6.364l1.414 1.414M4.222 4.222l1.414 1.414m12.728 0l-1.414 1.414M5.636 18.364l-1.414 1.414" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="text-gray-600 hidden sm:block">Harmonic Mixing & Playlist Builder</p>
              {allSongs.length > 0 && (
                <button
                  onClick={clearLibrary}
                  className="hidden md:block absolute top-0 right-0 text-xs text-gray-500 hover:text-red-600"
                >
                  Clear Library
                </button>
              )}
            </header>
            {/* MOBILE-ONLY LAYOUT */}
            <div className="md:hidden flex flex-col h-[calc(100vh-100px)]">
              <div className="flex-shrink-0 bg-white p-4 border-b border-black-300 shadow-lg">
                <Instructions />
                {selectedSong && (
                  <SelectedSongDisplay
                    song={selectedSong}
                    onClear={clearSelection}
                    onAddToPlaylist={addToPlaylist}
                  />
                )}
                <CurrentPlaylist
                  playlist={currentPlaylist}
                  onSave={saveCurrentPlaylist}
                  onRemove={removeFromPlaylist}
                  onSelect={handleSongSelect}
                  onDragEnd={handlePlaylistDragEnd}
                  onLoadClick={() => setIsLoadModalOpen(true)} 
                  hasSavedPlaylists={savedPlaylists.length > 0}
                />
              </div>
              <div className="flex-grow overflow-y-auto p-4">
                <SearchBar onSearch={setSearchTerm} ref={searchBarRef} isHighlighted={isSearchHighlighted}/>
                <h2 className="text-xl font-semibold my-4 border-b pb-2">
                  {selectedSong ? 'Compatible Tracks' : 'Your Library'}
                </h2>
                <SongList
                  songs={displaySongs}
                  onSongSelect={handleSongSelect}
                  onAddToPlaylist={addToPlaylist}
                />
              </div>
            </div>

            {/* DESKTOP-ONLY LAYOUT */}
            <div className="hidden md:grid md:grid-cols-2 md:gap-8">
              <div className="overflow-visible">
                <Instructions />
                <div className="sticky top-0 z-10 bg-[#F9FAFB] pt-4 -mx-4 px-4">
                  <SearchBar onSearch={setSearchTerm} isHighlighted={isSearchHighlighted}/>
                </div>
                <h2 className="text-2xl font-semibold my-4 border-b pb-2">
                  {selectedSong ? 'Compatible Tracks' : 'Your Library'}
                </h2>
                <SongList
                  songs={displaySongs}
                  onSongSelect={handleSongSelect}
                  onAddToPlaylist={addToPlaylist}
                />
              </div>
              <div className="overflow-visible">
                <div className="sticky top-4 space-y-6">
                  {selectedSong && (
                    <>
                      <SelectedSongDisplay
                        song={selectedSong}
                        onClear={clearSelection}
                        onAddToPlaylist={addToPlaylist}
                      />
                      <FilterControls
                        filterParams={filterParams}
                        onFilterChange={setFilterParams}
                        selectedSong={selectedSong}
                        yearRange={yearRange}
                        filteredGenres={filteredGenres}
                        songLengthRange={songLengthRange}
                      />
                    </>
                  )}
                  <CurrentPlaylist
                    playlist={currentPlaylist}
                    onSave={saveCurrentPlaylist}
                    onRemove={removeFromPlaylist}
                    onSelect={handleSongSelect}
                    onDragEnd={handlePlaylistDragEnd}
                    onLoadClick={() => setIsLoadModalOpen(true)} 
                    hasSavedPlaylists={savedPlaylists.length > 0}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer className="text-center text-xs text-gray-500 py-1 md:mt-4">
        <p>
          © 2025 Deckhand
          <span className="mx-2">•</span>
          Made by{' '}
          <a 
            href="https://jbdev.io" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-semibold text-indigo-600 hover:underline"
          >
            jbdev.io
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;