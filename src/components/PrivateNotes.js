import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Trash2, X, Lightbulb, Lock, Edit2 } from 'lucide-react';

function PrivateNotes({ selectedContact, onClose }) {
  const [showModal, setShowModal] = useState(false);
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(`privateNotes_${selectedContact?.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('general');

  const categories = [
    { id: 'general', name: 'General', emoji: '📝', color: 'blue' },
    { id: 'birthday', name: 'Birthday', emoji: '🎂', color: 'pink' },
    { id: 'goals', name: 'Goals', emoji: '🎯', color: 'purple' },
    { id: 'promises', name: 'Promises', emoji: '🤝', color: 'green' },
    { id: 'jokes', name: 'Inside Jokes', emoji: '😄', color: 'yellow' },
    { id: 'important', name: 'Important', emoji: '⭐', color: 'red' },
    { id: 'reminders', name: 'Reminders', emoji: '🔔', color: 'orange' },
    { id: 'preferences', name: 'Preferences', emoji: '❤️', color: 'rose' }
  ];

  useEffect(() => {
    localStorage.setItem(`privateNotes_${selectedContact?.id}`, JSON.stringify(notes));
  }, [notes, selectedContact?.id]);

  const addNote = () => {
    if (!newNote.trim()) return;

    const note = {
      id: Date.now(),
      text: newNote,
      category: selectedCategory,
      createdAt: new Date().toLocaleString(),
      isAiGenerated: false
    };

    setNotes([note, ...notes]);
    setNewNote('');
  };

  const updateNote = (id) => {
    setNotes(notes.map(n =>
      n.id === id ? { ...n, text: editText, updatedAt: new Date().toLocaleString() } : n
    ));
    setEditingId(null);
    setEditText('');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const addAiNote = (type) => {
    const aiNotes = {
      birthday: `🎂 Remember their birthday! Set a reminder.`,
      goals: `🎯 They mentioned wanting to achieve this. Check in on their progress.`,
      promises: `🤝 You promised to help with this. Don't forget!`,
      jokes: `😄 This is their favorite joke/humor style. Use it to break the ice.`,
      important: `⭐ This is important to them. Remember it in future conversations.`,
      preferences: `❤️ They prefer this. Keep it in mind for recommendations.`
    };

    const note = {
      id: Date.now(),
      text: aiNotes[type] || 'AI Generated Note',
      category: type,
      createdAt: new Date().toLocaleString(),
      isAiGenerated: true
    };

    setNotes([note, ...notes]);
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    switch (category?.color) {
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200';
      case 'pink':
        return 'bg-pink-100 dark:bg-pink-900 border-pink-300 dark:border-pink-700 text-pink-800 dark:text-pink-200';
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200';
      case 'green':
        return 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200';
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200';
      case 'red':
        return 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200';
      case 'orange':
        return 'bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200';
      case 'rose':
        return 'bg-rose-100 dark:bg-rose-900 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Private Notes"
      >
        <BookOpen size={20} className="text-purple-600 dark:text-purple-400" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-3xl w-full my-8">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-indigo-500 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Lock size={24} />
                  Private Notes
                </h2>
                <p className="text-purple-100 text-sm mt-1">Only you can see these notes about {selectedContact?.name || 'this contact'}</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Add Note Section */}
              <div className="bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200">Add a Note</h3>

                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write something you want to remember about this person..."
                  className="w-full px-4 py-2 border border-purple-300 dark:border-purple-600 rounded-lg bg-white dark:bg-purple-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 resize-none"
                  rows="3"
                />

                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">Category:</span>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                        selectedCategory === cat.id
                          ? `${getCategoryColor(cat.id)} ring-2 ring-offset-2 dark:ring-offset-gray-900`
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                      }`}
                    >
                      {cat.emoji} {cat.name}
                    </button>
                  ))}
                </div>

                <button
                  onClick={addNote}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add Note
                </button>
              </div>

              {/* AI Suggestions */}
              <div className="bg-indigo-50 dark:bg-indigo-900 border border-indigo-200 dark:border-indigo-700 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-indigo-800 dark:text-indigo-200 flex items-center gap-2">
                  <Lightbulb size={20} />
                  AI Suggestions
                </h3>
                <p className="text-sm text-indigo-700 dark:text-indigo-300">
                  Let AI help you remember important things. Click to add:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {categories.slice(1).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => addAiNote(cat.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${getCategoryColor(cat.id)}`}
                    >
                      {cat.emoji} {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 dark:text-white">📝 Your Notes ({notes.length})</h3>

                {notes.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No notes yet. Add one to get started! 📝
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notes.map(note => {
                      const category = categories.find(c => c.id === note.category);
                      return (
                        <div
                          key={note.id}
                          className={`p-4 rounded-lg border-2 ${getCategoryColor(note.category)}`}
                        >
                          {editingId === note.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 resize-none"
                                rows="3"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => updateNote(note.id)}
                                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{category?.emoji}</span>
                                  <span className="font-semibold">{category?.name}</span>
                                  {note.isAiGenerated && (
                                    <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                                      🤖 AI
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-sm mb-2">{note.text}</p>
                              <p className="text-xs opacity-70 mb-2">
                                {note.updatedAt ? `Updated: ${note.updatedAt}` : `Created: ${note.createdAt}`}
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    setEditingId(note.id);
                                    setEditText(note.text);
                                  }}
                                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center justify-center gap-1"
                                >
                                  <Edit2 size={14} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => deleteNote(note.id)}
                                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center justify-center gap-1"
                                >
                                  <Trash2 size={14} />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 p-4 rounded-lg text-sm text-purple-800 dark:text-purple-200">
                <p className="font-semibold mb-2">🔒 Privacy & Features:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Only you can see these notes (completely private)</li>
                  <li>Organize notes by categories</li>
                  <li>AI suggestions for important info</li>
                  <li>Edit and delete notes anytime</li>
                  <li>Notes persist across sessions</li>
                  <li>Perfect for remembering birthdays, goals, promises, and jokes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PrivateNotes;
