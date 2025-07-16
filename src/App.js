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
      <div className="container mx-auto max-w-6xl">
        {allSongs.length === 0 ? (
          <div className="p-4 md:p-8">
            <WelcomeScreen onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="p-0 md:p-8">
            <header className="text-center mb-8 px-4 pt-8 md:px-0 md:pt-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">📀 DECKHAND 📀</h1>
              <p className="text-gray-600">Harmonic Mixing & Playlist Builder</p>
            </header>
            
            {/* Main layout now uses flexbox for reordering */}
            <div className="flex flex-col md:flex-row md:gap-8">
              
              {/* ## Right Column (Now appears FIRST on mobile) ## */}
              <div className="w-full md:w-1/2 order-1 md:order-2">
                {/* This container is sticky on ALL screen sizes */}
                <div className="sticky top-0 z-10 bg-gray-50 px-4 pt-4 md:px-0 md:pt-0 md:top-4 md:bg-transparent">
                  <div className="md:space-y-6">
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
                  </div>
                </div>
                
                {/* SavedPlaylists scrolls normally underneath */}
                <div className="mt-6 px-4 md:px-0">
                  <SavedPlaylists
                    savedPlaylists={savedPlaylists}
                    onLoad={loadPlaylist}
                    onDelete={deletePlaylist}
                  />
                </div>
              </div>

              {/* ## Left Column (Now appears SECOND on mobile) ## */}
              <div className="w-full md:w-1/2 order-2 md:order-1 px-4 md:px-0">
                <div className="mt-8 md:mt-0">
                  <Instructions />
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
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;