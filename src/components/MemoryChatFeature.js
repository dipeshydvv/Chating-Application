import React, { useState, useEffect } from 'react';
import { Brain, Bell, Calendar, Heart, Lightbulb, X, Check } from 'lucide-react';

function MemoryChatFeature({ selectedContact, onClose }) {
  const [showModal, setShowModal] = useState(false);
  const [memories, setMemories] = useState(() => {
    const saved = localStorage.getItem(`chatMemories_${selectedContact?.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem(`memoryReminders_${selectedContact?.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddMemory, setShowAddMemory] = useState(false);
  const [memoryType, setMemoryType] = useState('birthday');
  const [memoryDate, setMemoryDate] = useState('');
  const [memoryDescription, setMemoryDescription] = useState('');

  const memoryTypes = [
    { id: 'birthday', name: 'Birthday', emoji: '🎂', color: 'pink' },
    { id: 'anniversary', name: 'Anniversary', emoji: '💑', color: 'red' },
    { id: 'goal', name: 'Goal', emoji: '🎯', color: 'purple' },
    { id: 'promise', name: 'Promise', emoji: '🤝', color: 'blue' },
    { id: 'achievement', name: 'Achievement', emoji: '🏆', color: 'yellow' },
    { id: 'joke', name: 'Inside Joke', emoji: '😄', color: 'green' },
    { id: 'preference', name: 'Preference', emoji: '❤️', color: 'rose' },
    { id: 'event', name: 'Event', emoji: '📅', color: 'orange' }
  ];

  useEffect(() => {
    localStorage.setItem(`chatMemories_${selectedContact?.id}`, JSON.stringify(memories));
  }, [memories, selectedContact?.id]);

  useEffect(() => {
    localStorage.setItem(`memoryReminders_${selectedContact?.id}`, JSON.stringify(reminders));
  }, [reminders, selectedContact?.id]);

  const addMemory = () => {
    if (!memoryDescription.trim()) return;

    const memory = {
      id: Date.now(),
      type: memoryType,
      description: memoryDescription,
      date: memoryDate,
      createdAt: new Date().toLocaleString(),
      reminderSet: false
    };

    setMemories([memory, ...memories]);
    setMemoryDescription('');
    setMemoryDate('');
    setShowAddMemory(false);
  };

  const setReminder = (memory) => {
    if (!memory.date) {
      alert('Please set a date for this memory to enable reminders');
      return;
    }

    const reminder = {
      id: Date.now(),
      memoryId: memory.id,
      type: memory.type,
      description: memory.description,
      date: memory.date,
      message: generateReminderMessage(memory),
      isActive: true,
      createdAt: new Date().toLocaleString()
    };

    setReminders([...reminders, reminder]);

    // Update memory to show reminder is set
    setMemories(memories.map(m =>
      m.id === memory.id ? { ...m, reminderSet: true } : m
    ));
  };

  const generateReminderMessage = (memory) => {
    const messages = {
      birthday: `🎂 Don't forget! It's ${selectedContact?.name || 'their'} birthday today!`,
      anniversary: `💑 Happy anniversary! It's been a special day for you both.`,
      goal: `🎯 Check in on this goal: "${memory.description}"`,
      promise: `🤝 Remember your promise: "${memory.description}"`,
      achievement: `🏆 Celebrate their achievement: "${memory.description}"`,
      joke: `😄 Remember this inside joke: "${memory.description}"`,
      preference: `❤️ They prefer: "${memory.description}"`,
      event: `📅 Important event: "${memory.description}"`
    };
    return messages[memory.type] || `📝 Reminder: ${memory.description}`;
  };

  const deleteMemory = (id) => {
    setMemories(memories.filter(m => m.id !== id));
    setReminders(reminders.filter(r => r.memoryId !== id));
  };

  const deleteReminder = (id) => {
    setReminders(reminders.filter(r => r.id !== id));
    const memoryId = reminders.find(r => r.id === id)?.memoryId;
    if (memoryId) {
      setMemories(memories.map(m =>
        m.id === memoryId ? { ...m, reminderSet: false } : m
      ));
    }
  };

  const getMemoryColor = (typeId) => {
    const type = memoryTypes.find(t => t.id === typeId);
    switch (type?.color) {
      case 'pink':
        return 'bg-pink-100 dark:bg-pink-900 border-pink-300 dark:border-pink-700 text-pink-800 dark:text-pink-200';
      case 'red':
        return 'bg-red-100 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-800 dark:text-red-200';
      case 'purple':
        return 'bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700 text-purple-800 dark:text-purple-200';
      case 'blue':
        return 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 text-blue-800 dark:text-blue-200';
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-200';
      case 'green':
        return 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 text-green-800 dark:text-green-200';
      case 'rose':
        return 'bg-rose-100 dark:bg-rose-900 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200';
      case 'orange':
        return 'bg-orange-100 dark:bg-orange-900 border-orange-300 dark:border-orange-700 text-orange-800 dark:text-orange-200';
      default:
        return 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Memory Chat"
      >
        <Brain size={20} className="text-cyan-600 dark:text-cyan-400" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-3xl w-full my-8">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-cyan-500 to-blue-500 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Brain size={24} />
                  Memory Chat
                </h2>
                <p className="text-cyan-100 text-sm mt-1">Remember important moments and get AI reminders</p>
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
              {/* Add Memory Section */}
              {!showAddMemory ? (
                <button
                  onClick={() => setShowAddMemory(true)}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Lightbulb size={20} />
                  Add a Memory
                </button>
              ) : (
                <div className="bg-cyan-50 dark:bg-cyan-900 border border-cyan-200 dark:border-cyan-700 p-4 rounded-lg space-y-3">
                  <h3 className="font-semibold text-cyan-800 dark:text-cyan-200">Create a Memory</h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {memoryTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setMemoryType(type.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                          memoryType === type.id
                            ? `${getMemoryColor(type.id)} ring-2 ring-offset-2 dark:ring-offset-gray-900`
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
                        }`}
                      >
                        {type.emoji} {type.name}
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={memoryDescription}
                    onChange={(e) => setMemoryDescription(e.target.value)}
                    placeholder="Describe this memory..."
                    className="w-full px-4 py-2 border border-cyan-300 dark:border-cyan-600 rounded-lg bg-white dark:bg-cyan-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 resize-none"
                    rows="3"
                  />

                  <div>
                    <label className="block text-sm font-semibold text-cyan-800 dark:text-cyan-200 mb-1">
                      Date (for reminders)
                    </label>
                    <input
                      type="date"
                      value={memoryDate}
                      onChange={(e) => setMemoryDate(e.target.value)}
                      className="w-full px-4 py-2 border border-cyan-300 dark:border-cyan-600 rounded-lg bg-white dark:bg-cyan-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={addMemory}
                      className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                    >
                      Save Memory
                    </button>
                    <button
                      onClick={() => setShowAddMemory(false)}
                      className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg font-semibold transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Active Reminders */}
              {reminders.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <Bell size={20} />
                    Active Reminders ({reminders.length})
                  </h3>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {reminders.map(reminder => {
                      const memoryType = memoryTypes.find(t => t.id === reminder.type);
                      return (
                        <div
                          key={reminder.id}
                          className={`p-3 rounded-lg border-2 ${getMemoryColor(reminder.type)}`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-semibold">{memoryType?.emoji} {memoryType?.name}</p>
                              <p className="text-sm mt-1">{reminder.message}</p>
                              <p className="text-xs opacity-70 mt-1">
                                📅 {new Date(reminder.date).toLocaleDateString()}
                              </p>
                            </div>
                            <button
                              onClick={() => deleteReminder(reminder.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Memories List */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 dark:text-white">💭 Memories ({memories.length})</h3>

                {memories.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                    No memories yet. Create one to get started! 💭
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {memories.map(memory => {
                      const memoryType = memoryTypes.find(t => t.id === memory.type);
                      return (
                        <div
                          key={memory.id}
                          className={`p-4 rounded-lg border-2 ${getMemoryColor(memory.type)}`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{memoryType?.emoji}</span>
                              <div>
                                <p className="font-semibold">{memoryType?.name}</p>
                                {memory.date && (
                                  <p className="text-xs opacity-70">
                                    📅 {new Date(memory.date).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>
                            {memory.reminderSet && (
                              <span className="text-xs bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-1 rounded flex items-center gap-1">
                                <Check size={12} />
                                Reminder Set
                              </span>
                            )}
                          </div>

                          <p className="text-sm mb-3">{memory.description}</p>
                          <p className="text-xs opacity-70 mb-3">Created: {memory.createdAt}</p>

                          <div className="flex gap-2">
                            {!memory.reminderSet && memory.date && (
                              <button
                                onClick={() => setReminder(memory)}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors flex items-center justify-center gap-1"
                              >
                                <Bell size={14} />
                                Set Reminder
                              </button>
                            )}
                            <button
                              onClick={() => deleteMemory(memory.id)}
                              className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="bg-cyan-50 dark:bg-cyan-900 border border-cyan-200 dark:border-cyan-700 p-4 rounded-lg text-sm text-cyan-800 dark:text-cyan-200">
                <p className="font-semibold mb-2">🧠 Memory Chat Features:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Remember birthdays, anniversaries, and important dates</li>
                  <li>Track goals and promises you've made</li>
                  <li>Store inside jokes and preferences</li>
                  <li>Get AI-powered reminders on important dates</li>
                  <li>Never forget important details about your contacts</li>
                  <li>Completely private - only you can see these memories</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MemoryChatFeature;
