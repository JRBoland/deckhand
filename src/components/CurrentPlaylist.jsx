// src/components/CurrentPlaylist.jsx
import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { exportPlaylistToFile } from '../utils/exportHelper';

const CurrentPlaylist = ({ playlist, onSave, onRemove, onSelect, onDragEnd, onLoadClick, hasSavedPlaylists }) => {
  const listEndRef = useRef(null);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const prevPlaylistLengthRef = useRef(playlist.length);

  useEffect(() => {
    if (listEndRef.current && playlist.length > prevPlaylistLengthRef.current) {
      listEndRef.current.scrollTop = listEndRef.current.scrollHeight;
    }
    prevPlaylistLengthRef.current = playlist.length;
  }, [playlist]);

  const handleExport = (fileType) => {
    exportPlaylistToFile(playlist, fileType);
    setShowExportOptions(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="card-brutal p-4 md:mb-6">
        <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
          <h3 className="font-display text-xl font-bold text-ink">Current Setlist</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onLoadClick}
              disabled={!hasSavedPlaylists}
              className="btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-0"
            >
              Load
            </button>
            <button
              onClick={onSave}
              disabled={playlist.length < 1}
              className="btn-primary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-0"
            >
              Save
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                disabled={playlist.length === 0}
                className="btn-brutal px-4 py-2 text-sm bg-ink text-surface border-border shadow-brutal hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-0"
              >
                Export
              </button>
              {showExportOptions && (
                <div className="absolute right-0 mt-2 w-48 card-brutal z-20 text-left overflow-hidden p-1">
                  <button
                    onClick={() => handleExport('txt')}
                    className="w-full text-left block px-4 py-2 text-sm font-sans text-ink hover:bg-gray-100 rounded-brutal transition-colors"
                  >
                    Export as .txt
                  </button>
                  <button
                    onClick={() => handleExport('csv')}
                    className="w-full text-left block px-4 py-2 text-sm font-sans text-ink hover:bg-gray-100 rounded-brutal transition-colors"
                  >
                    Export as .csv
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Droppable droppableId="playlist">
          {(provided) => (
            <div
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
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-2 rounded-brutal flex items-center justify-between border-2 border-border bg-gray-50 transition-all ${
                          snapshot.isDragging ? 'shadow-brutal-lg rotate-1 scale-[1.02] bg-surface' : 'shadow-brutal-sm'
                        }`}
                      >
                        <div className="flex-grow cursor-pointer truncate font-sans" onClick={() => onSelect(song)}>
                          <p className="font-semibold text-sm text-ink">
                            <span className="text-mute mr-2">{index + 1}.</span>
                            {song.name} – {song.artist}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemove(index)}
                          className="ml-2 w-8 h-8 flex items-center justify-center rounded-brutal border-2 border-border bg-surface text-destructive font-display font-bold shadow-brutal-sm hover:bg-red-50 active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all"
                          aria-label="Remove song"
                        >
                          &times;
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))
              ) : (
                <p className="text-sm text-mute font-sans p-2">Add songs to build your setlist.</p>
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
