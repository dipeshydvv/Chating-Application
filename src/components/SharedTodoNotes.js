import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, X, Trash2, Calendar, Bell, BarChart3, Flag, Check } from 'lucide-react';

function SharedTodoNotes({ selectedContact, onClose }) {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('todos'); // todos, notes, polls
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem(`sharedTodos_${selectedContact?.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem(`sharedNotes_${selectedContact?.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [polls, setPolls] = useState(() => {
    const saved = localStorage.getItem(`sharedPolls_${selectedContact?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [newTodo, setNewTodo] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newPoll, setNewPoll] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');

  useEffect(() => {
    localStorage.setItem(`sharedTodos_${selectedContact?.id}`, JSON.stringify(todos));
  }, [todos, selectedContact?.id]);

  useEffect(() => {
    localStorage.setItem(`sharedNotes_${selectedContact?.id}`, JSON.stringify(notes));
  }, [notes, selectedContact?.id]);

  useEffect(() => {
    localStorage.setItem(`sharedPolls_${selectedContact?.id}`, JSON.stringify(polls));
  }, [polls, selectedContact?.id]);

  // Todo Functions
  const addTodo = () => {
    if (!newTodo.trim()) return;
    const todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      dueDate,
      priority,
      createdBy: selectedContact?.name || 'You',
      createdAt: new Date().toLocaleString()
    };
    setTodos([...todos, todo]);
    setNewTodo('');
    setDueDate('');
    setPriority('medium');
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  // Note Functions
  const addNote = () => {
    if (!newNote.trim()) return;
    const note = {
      id: Date.now(),
      text: newNote,
      createdBy: selectedContact?.name || 'You',
      createdAt: new Date().toLocaleString()
    };
    setNotes([...notes, note]);
    setNewNote('');
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  // Poll Functions
  const addPoll = () => {
    if (!newPoll.trim() || pollOptions.some(o => !o.trim())) {
      alert('Please enter poll question and at least 2 options');
      return;
    }
    const poll = {
      id: Date.now(),
      question: newPoll,
      options: pollOptions.map(opt => ({ text: opt, votes: 0 })),
      createdBy: selectedContact?.name || 'You',
      createdAt: new Date().toLocaleString(),
      voters: []
    };
    setPolls([...polls, poll]);
    setNewPoll('');
    setPollOptions(['', '']);
  };

  const votePoll = (pollId, optionIndex) => {
    setPolls(polls.map(p => {
      if (p.id === pollId) {
        const newOptions = [...p.options];
        newOptions[optionIndex].votes += 1;
        return { ...p, options: newOptions };
      }
      return p;
    }));
  };

  const deletePoll = (id) => {
    setPolls(polls.filter(p => p.id !== id));
  };

  const completedTodos = todos.filter(t => t.completed).length;
  const totalTodos = todos.length;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900';
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900';
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Shared To-Do & Notes"
      >
        <CheckSquare size={20} className="text-gray-600 dark:text-gray-400" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-500 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <CheckSquare size={24} />
                  Shared To-Do & Notes
                </h2>
                <p className="text-indigo-100 text-sm mt-1">Collaborate on tasks, notes, and polls</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="sticky top-16 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex">
              <button
                onClick={() => setActiveTab('todos')}
                className={`flex-1 px-4 py-3 font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'todos'
                    ? 'bg-indigo-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <CheckSquare size={18} />
                To-Do ({totalTodos})
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 px-4 py-3 font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'notes'
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                📝 Notes ({notes.length})
              </button>
              <button
                onClick={() => setActiveTab('polls')}
                className={`flex-1 px-4 py-3 font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'polls'
                    ? 'bg-pink-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <BarChart3 size={18} />
                Polls ({polls.length})
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* TO-DO TAB */}
              {activeTab === 'todos' && (
                <div className="space-y-4">
                  {/* Progress */}
                  {totalTodos > 0 && (
                    <div className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg border border-indigo-200 dark:border-indigo-700">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold text-indigo-800 dark:text-indigo-200">Progress</span>
                        <span className="text-indigo-800 dark:text-indigo-200">{completedTodos}/{totalTodos}</span>
                      </div>
                      <div className="w-full bg-indigo-300 dark:bg-indigo-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${(completedTodos / totalTodos) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Add Todo */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                    <input
                      type="text"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') addTodo();
                      }}
                      placeholder="Add a new task..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    />

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Due Date
                        </label>
                        <input
                          type="date"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Priority
                        </label>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={addTodo}
                          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={18} />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Todos List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {todos.length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">No tasks yet. Add one to get started! 📝</p>
                    ) : (
                      todos.map(todo => (
                        <div
                          key={todo.id}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            todo.completed
                              ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
                              : 'bg-white dark:bg-gray-800 border-indigo-200 dark:border-indigo-700'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <button
                              onClick={() => toggleTodo(todo.id)}
                              className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all mt-1 ${
                                todo.completed
                                  ? 'bg-indigo-500 border-indigo-500'
                                  : 'border-indigo-300 dark:border-indigo-600 hover:border-indigo-500'
                              }`}
                            >
                              {todo.completed && <Check size={16} className="text-white" />}
                            </button>
                            <div className="flex-1">
                              <p className={`${todo.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                                {todo.text}
                              </p>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {todo.dueDate && (
                                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(todo.dueDate).toLocaleDateString()}
                                  </span>
                                )}
                                <span className={`text-xs px-2 py-1 rounded font-semibold ${getPriorityColor(todo.priority)}`}>
                                  <Flag size={12} className="inline mr-1" />
                                  {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">by {todo.createdBy}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => deleteTodo(todo.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* NOTES TAB */}
              {activeTab === 'notes' && (
                <div className="space-y-4">
                  {/* Add Note */}
                  <div className="space-y-2">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Write a shared note..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 resize-none"
                      rows="4"
                    />
                    <button
                      onClick={addNote}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Add Note
                    </button>
                  </div>

                  {/* Notes List */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notes.length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">No notes yet. Create one! 📝</p>
                    ) : (
                      notes.map(note => (
                        <div
                          key={note.id}
                          className="p-4 bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 rounded-lg"
                        >
                          <div className="flex justify-between items-start gap-2 mb-2">
                            <div className="flex-1">
                              <p className="text-sm text-gray-600 dark:text-gray-400">by {note.createdBy}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">{note.createdAt}</p>
                            </div>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                          <p className="text-gray-800 dark:text-white whitespace-pre-wrap">{note.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* POLLS TAB */}
              {activeTab === 'polls' && (
                <div className="space-y-4">
                  {/* Create Poll */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                    <input
                      type="text"
                      value={newPoll}
                      onChange={(e) => setNewPoll(e.target.value)}
                      placeholder="Ask a question..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500"
                    />

                    <div className="space-y-2">
                      {pollOptions.map((option, idx) => (
                        <input
                          key={idx}
                          type="text"
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...pollOptions];
                            newOptions[idx] = e.target.value;
                            setPollOptions(newOptions);
                          }}
                          placeholder={`Option ${idx + 1}`}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-500"
                        />
                      ))}
                      <button
                        onClick={() => setPollOptions([...pollOptions, ''])}
                        className="text-pink-600 dark:text-pink-400 text-sm font-semibold hover:underline"
                      >
                        + Add Option
                      </button>
                    </div>

                    <button
                      onClick={addPoll}
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Create Poll
                    </button>
                  </div>

                  {/* Polls List */}
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {polls.length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400 py-8">No polls yet. Create one! 📊</p>
                    ) : (
                      polls.map(poll => {
                        const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                        return (
                          <div
                            key={poll.id}
                            className="p-4 bg-pink-50 dark:bg-pink-900 border border-pink-200 dark:border-pink-700 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-semibold text-gray-800 dark:text-white">{poll.question}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">by {poll.createdBy}</p>
                              </div>
                              <button
                                onClick={() => deletePoll(poll.id)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                            <div className="space-y-2">
                              {poll.options.map((option, idx) => {
                                const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => votePoll(poll.id, idx)}
                                    className="w-full text-left"
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-semibold text-gray-800 dark:text-white">{option.text}</span>
                                      <span className="text-xs text-gray-600 dark:text-gray-400">({option.votes})</span>
                                    </div>
                                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                                      <div
                                        className="bg-gradient-to-r from-pink-500 to-rose-500 h-2 rounded-full transition-all"
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Total votes: {totalVotes}</p>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SharedTodoNotes;
