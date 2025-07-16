// src/App.jsx
import { useState, useEffect } from 'react';
import { checkCamelotCompatibility } from './utils/camelotWheelHelper';
import FileUpload from './components/FileUpload';
import SongList from './components/SongList';
import FilterControls from './components/FilterControls';
import SearchBar from './components/SearchBar';
import SelectedSongDisplay from './components/SelectedSongDisplay';
import CurrentPlaylist from './components/CurrentPlaylist'; // Import new component
import SavedPlaylists from './components/SavedPlaylists'; // Import new component
import WelcomeScreen from './components/WelcomeScreen';
import Instructions from './components/Instructions';

function App() {
  const [allSongs, setAllSongs] = useState([]);
  const [displaySongs, setDisplaySongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterParams, setFilterParams] = useState({
    bpmPercent: 5,
    useHarmonic: true, // Default to harmonic mixing
  });
  
  // New State for playlist building and saving
  const [currentPlaylist, setCurrentPlaylist] = useState([]);
  const [savedPlaylists, setSavedPlaylists] = useState([]);

  // Load saved playlists from localStorage on initial render
  useEffect(() => {
    const loadedPlaylists = JSON.parse(localStorage.getItem('dj-saved-playlists')) || [];
    setSavedPlaylists(loadedPlaylists);
  }, []);

  const handleFileUpload = (songs) => setAllSongs(songs);
  const handleSongSelect = (song) => setSelectedSong(song);
  const clearSelection = () => setSelectedSong(null);
  const addToPlaylist = (song) => setCurrentPlaylist([...currentPlaylist, song]);

  const saveCurrentPlaylist = () => {
    const playlistName = prompt("Enter a name for this playlist:", `My Setlist ${savedPlaylists.length + 1}`);
    if (playlistName) {
      const newPlaylist = {
        id: Date.now(), // simple unique id
        name: playlistName,
        songs: currentPlaylist,
      };
      const updatedSavedPlaylists = [...savedPlaylists, newPlaylist];
      setSavedPlaylists(updatedSavedPlaylists);
      localStorage.setItem('dj-saved-playlists', JSON.stringify(updatedSavedPlaylists));
      setCurrentPlaylist([]); // Clear the current playlist after saving
    }
  };

  const loadPlaylist = (songs) => {
    setCurrentPlaylist(songs);
  };

  const deletePlaylist = (playlistId) => {
    if (window.confirm("Are you sure you want to delete this playlist?")) {
      const updatedSavedPlaylists = savedPlaylists.filter(p => p.id !== playlistId);
      setSavedPlaylists(updatedSavedPlaylists);
      localStorage.setItem('dj-saved-playlists', JSON.stringify(updatedSavedPlaylists));
    }
  };

   const removeFromPlaylist = (indexToRemove) => {
    setCurrentPlaylist(currentPlaylist.filter((_, index) => index !== indexToRemove));
  };

  const handlePlaylistDragEnd = (result) => {
    if (!result.destination) return; // Dropped outside the list

    const items = Array.from(currentPlaylist);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCurrentPlaylist(items);
  };

  useEffect(() => {
    let songsToShow = [...allSongs];

    if (searchTerm && !selectedSong) {
      songsToShow = songsToShow.filter(
        (song) =>
          song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSong) {
      const lowerBpm = selectedSong.bpm * (1 - filterParams.bpmPercent / 100);
      const upperBpm = selectedSong.bpm * (1 + filterParams.bpmPercent / 100);

      songsToShow = allSongs.filter((song) => {
        if (song.id === selectedSong.id) return false;

        const isBpmMatch = song.bpm >= lowerBpm && song.bpm <= upperBpm;
        
        // UPDATED KEY MATCH LOGIC
        const isKeyMatch = filterParams.useHarmonic
  ? checkCamelotCompatibility(selectedSong.key, song.key)
  : selectedSong.key === song.key;

        return isBpmMatch && isKeyMatch;
      });
    }
    setDisplaySongs(songsToShow);
  }, [searchTerm, selectedSong, allSongs, filterParams]);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-4 md:p-8 max-w-6xl">
        {allSongs.length === 0 ? (
          // If no songs are loaded, show the Welcome Screen
          <WelcomeScreen onFileUpload={handleFileUpload} />
        ) : (
          // Otherwise, show the main application interface
          <>
            <header className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800">📀 DECKHAND 📀</h1>
              <p className="text-gray-600">Harmonic Mixing & Playlist Builder</p>
            </header>

          <Instructions />

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
              {/* ## Left Column (Library & Search) ## */}
              <div>
                {/* SearchBar is now always visible */}
                <SearchBar onSearch={setSearchTerm} />
                <h2 className="text-2xl font-semibold my-4 border-b pb-2">
                  {selectedSong ? 'Compatible Tracks' : 'Your Library'}
                </h2>
                <SongList
                  songs={displaySongs}
                  onSongSelect={handleSongSelect}
                  onAddToPlaylist={addToPlaylist}
                />
              </div>

              {/* ## Right Column (Filtering & Playlists) ## */}
              <div>
                {/* MOVED HERE: These components are now in the right column */}
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
        />
      </>
    )}

    <CurrentPlaylist
      playlist={currentPlaylist}
      onSave={saveCurrentPlaylist}
      onRemove={removeFromPlaylist}
      onSelect={handleSongSelect}
      onDragEnd={handlePlaylistDragEnd}
    />
  

  {/* SavedPlaylists will now scroll underneath the sticky panel */}
  <div className="mt-6">
      <SavedPlaylists
        savedPlaylists={savedPlaylists}
        onLoad={loadPlaylist}
        onDelete={deletePlaylist}
      />
  </div>
  </div>
</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;