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
              className="px-4 py-2 text-sm font-semibold bg-gray-200 text-gray-700 rounded-lg shadow-sm hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Load
            </button>
            <button
              onClick={onSave}
              disabled={playlist.length < 1}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400"
            >
              Save
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                disabled={playlist.length === 0}
                className="px-4 py-2 text-sm font-semibold text-white bg-slate-600 rounded-lg shadow-md hover:bg-slate-700 disabled:bg-gray-400"
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