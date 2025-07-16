// src/components/CurrentPlaylist.jsx
import React, { useState, useEffect, useRef } from 'react'; // Import useState
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { exportPlaylistToFile } from '../utils/exportHelper'; // Import our new helper

const CurrentPlaylist = ({ playlist, onSave, onRemove, onSelect, onDragEnd }) => {
  const listEndRef = useRef(null);
  const [showExportOptions, setShowExportOptions] = useState(false); // State for dropdown

  useEffect(() => {
    if (listEndRef.current) {
      listEndRef.current.scrollTop = listEndRef.current.scrollHeight;
    }
  }, [playlist]);

  const handleExport = (fileType) => {
    exportPlaylistToFile(playlist, fileType);
    setShowExportOptions(false); // Hide options after exporting
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="bg-white p-4 rounded-lg shadow-lg md:mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold">Current Setlist</h3>
          {/* Container for the action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              disabled={playlist.length < 2}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              Save
            </button>
            {/* New Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                disabled={playlist.length === 0}
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-600 rounded-lg shadow-md hover:bg-slate-700 disabled:bg-gray-400"
              >
                Export
              </button>
              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                  <a onClick={() => handleExport('txt')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Export as .txt</a>
                  <a onClick={() => handleExport('csv')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Export as .csv</a>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Droppable droppableId="playlist">
        {/* ... rest of the component remains the same ... */}
          {(provided) => (
            <div
              ref={listEndRef}
              {...provided.droppableProps}
              className="space-y-2 overflow-y-auto max-h-32 md:max-h-96"
            >
              {playlist.length > 0 ? (
                playlist.map((song, index) => (
                  <Draggable key={`${song.id}-${index}`} draggableId={`${song.id}-${index}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="p-2 bg-gray-100 rounded flex items-center justify-between"
                      >
                        <div className="flex-grow cursor-pointer truncate" onClick={() => onSelect(song)}>
                          <p className="font-semibold text-sm">
                            <span className="text-gray-500 mr-2">{index + 1}.</span>
                            {song.name} - {song.artist}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => onRemove(index)}
                          className="ml-2 text-red-500 hover:text-red-700 font-bold text-xl flex-shrink-0"
                          aria-label="Remove song"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <p className="text-sm text-gray-500 p-2">Add songs to build your setlist.</p>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  );
};

export default CurrentPlaylist;