// src/components/CurrentPlaylist.jsx
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const CurrentPlaylist = ({ playlist, onSave, onRemove, onSelect, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="bg-white p-4 rounded-lg shadow-lg md:mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-bold">Current Setlist</h3>
          <button
            onClick={onSave}
            disabled={playlist.length < 2}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
        
        <Droppable droppableId="playlist">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              // This is the only line that changes:
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