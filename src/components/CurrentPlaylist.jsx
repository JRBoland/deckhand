// src/components/CurrentPlaylist.jsx
import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { exportPlaylistToFile } from '../utils/exportHelper';

const CurrentPlaylist = ({ playlist, onSave, onRemove, onSelect, onDragEnd, onLoadClick, hasSavedPlaylists }) => {
  const listEndRef = useRef(null);
  const [showExportOptions, setShowExportOptions] = useState(false);

  useEffect(() => {
    if (listEndRef.current) {
      listEndRef.current.scrollTop = listEndRef.current.scrollHeight;
    }
  }, [playlist]);

  const handleExport = (fileType) => {
    exportPlaylistToFile(playlist, fileType);
    setShowExportOptions(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="bg-white p-4 rounded-lg shadow-lg md:mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold">Current Setlist</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={onLoadClick}
              disabled={!hasSavedPlaylists}
              className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 active:scale-95 transition-transform disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Load
            </button>
            <button
              onClick={onSave}
              disabled={playlist.length < 1}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 active:bg-indigo-800 active:scale-95 transition-transform rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              Save
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                disabled={playlist.length === 0}
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-600 active:bg-slate-800 active:scale-95 transition-transform rounded-lg shadow-md hover:bg-slate-700 disabled:bg-gray-400"
              >
                Export
              </button>
              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 text-left">
                  <button onClick={() => handleExport('txt')} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Export as .txt</button>
                  <button onClick={() => handleExport('csv')} className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Export as .csv</button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Droppable droppableId="playlist">
          {(provided) => (
            <div
              // FIXED: Use a callback to assign both refs
              ref={(el) => {
                provided.innerRef(el);
                listEndRef.current = el;
              }}
              {...provided.droppableProps}
              className="space-y-2 overflow-y-auto max-h-32 md:max-h-96"
            >
              {playlist.length > 0 ? (
                playlist.map((song, index) => (
                  <Draggable 
                    key={`${song.id}-${index}`} 
                    draggableId={`${song.id}-${index}`} 
                    index={index}
                    shouldRespectForcePress={true}
                  >
                    {/* Add the 'snapshot' parameter here */}
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        // Conditionally add animation classes when snapshot.isDragging is true
                        className={`p-2 bg-gray-100 rounded flex items-center justify-between transition-transform ${
                          snapshot.isDragging ? 'scale-105 shadow-lg rotate-1' : ''
                        }`}
                      >
                        <div className="flex-grow cursor-pointer truncate" onClick={() => onSelect(song)}>
                          <p className="font-semibold text-sm">
                            <span className="text-gray-500 mr-2">{index + 1}.</span>
                            {song.name} - {song.artist}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemove(index)}
                          className="ml-2 text-red-500 hover:text-red-700 font-bold text-xl flex-shrink-0 active:text-red-800 active:scale-125 transition-transform"
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