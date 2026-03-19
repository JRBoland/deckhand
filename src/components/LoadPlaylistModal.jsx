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
    <div className="fixed inset-0 z-40 flex justify-center items-center p-4" style={{ backgroundColor: 'rgba(10,10,10,0.6)' }}>
      <div className="card-brutal w-full max-w-md p-6 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-display text-2xl font-bold text-ink">Saved Playlists</h2>
          <button
            onClick={() => setIsManageMode(!isManageMode)}
            className="btn-secondary px-3 py-1.5 text-sm"
          >
            {isManageMode ? 'Done' : 'Manage'}
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto flex-1">
          {savedPlaylists.length > 0 ? (
            savedPlaylists.map((playlist) => (
              <div key={playlist.id} className="p-3 rounded-brutal border-2 border-border bg-gray-50 shadow-brutal-sm">
                {editingId === playlist.id && isManageMode ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="input-brutal flex-1 min-w-0"
                    />
                    <button onClick={handleRenameSave} className="btn-primary px-3 py-2 text-sm">
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="btn-secondary px-3 py-2 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center gap-2 flex-wrap">
                    <div>
                      <p className="font-display font-semibold text-ink">{playlist.name}</p>
                      <p className="text-xs text-mute font-sans">
                        {playlist.songs.length} tracks • {new Date(playlist.id).toLocaleDateString()}
                      </p>
                    </div>
                    {isManageMode ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRenameClick(playlist)}
                          className="btn-brutal px-3 py-1.5 text-sm bg-warning text-ink border-border shadow-brutal-sm hover:bg-amber-400"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => onDelete(playlist.id)}
                          className="btn-brutal px-3 py-1.5 text-sm bg-destructive text-white border-border shadow-brutal-sm hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => onLoad(playlist.songs)} className="btn-primary px-3 py-1.5 text-sm">
                        Load
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-mute font-sans">No saved playlists yet.</p>
          )}
        </div>
        <button onClick={onClose} className="w-full mt-4 btn-brutal py-2 text-sm font-display font-semibold bg-ink text-surface border-border shadow-brutal hover:bg-gray-800">
          Close
        </button>
      </div>
    </div>
  );
};

export default LoadPlaylistModal;
