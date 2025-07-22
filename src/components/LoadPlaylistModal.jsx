import React, { useState } from 'react';

const LoadPlaylistModal = ({ isOpen, onClose, savedPlaylists, onLoad, onDelete, onRename }) => {
  const [isManageMode, setIsManageMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');

  if (!isOpen) return null;

  const handleRenameClick = (playlist) => {
    setEditingId(playlist.id);
    setNewName(playlist.name);
  };

  const handleRenameSave = () => {
    onRename(editingId, newName);
    setEditingId(null);
    setNewName('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Saved Playlists</h2>
          <button onClick={() => setIsManageMode(!isManageMode)} className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
            {isManageMode ? 'Done' : 'Manage'}
          </button>
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {savedPlaylists.length > 0 ? (
            savedPlaylists.map((playlist) => (
              <div key={playlist.id} className="bg-gray-100 p-3 rounded-lg">
                {editingId === playlist.id && isManageMode ? (
                  // Rename View
                  <div className="flex items-center gap-2">
                    <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full p-2 border rounded" />
                    <button onClick={handleRenameSave} className="px-3 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-3 py-2 text-sm bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
                  </div>
                ) : (
                  // Default View (changes based on mode)
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold">{playlist.name}</p>
                      <p className="text-xs text-gray-500">
                        {playlist.songs.length} tracks • {new Date(playlist.id).toLocaleDateString()}
                      </p>
                    </div>
                    {isManageMode ? (
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleRenameClick(playlist)} className="px-3 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600">Rename</button>
                        <button onClick={() => onDelete(playlist.id)} className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                      </div>
                    ) : (
                      <button onClick={() => onLoad(playlist.songs)} className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600">Load</button>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No saved playlists yet.</p>
          )}
        </div>
        <button onClick={onClose} className="w-full mt-4 py-2 text-sm font-semibold text-white bg-slate-600 rounded-lg hover:bg-slate-700">Close</button>
      </div>
    </div>
  );
};

export default LoadPlaylistModal;