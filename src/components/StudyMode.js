import React, { useState, useEffect } from 'react';
import { BookOpen, Users, Clock, Target, X, Plus, Check, Trash2, Award, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

function StudyMode({ selectedContact, onClose, currentUser }) {
  const [showModal, setShowModal] = useState(false);
  const [studySession, setStudySession] = useState(() => {
    const saved = localStorage.getItem(`studySession_${selectedContact?.id}`);
    return saved ? JSON.parse(saved) : {
      isActive: false,
      startTime: null,
      duration: 0,
      topic: '',
      participants: [],
      goals: [],
      focusLevel: 0
    };
  });

  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(30);
  const [goal, setGoal] = useState('');
  const [focusMode, setFocusMode] = useState(false);
  const [newParticipant, setNewParticipant] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const saved = localStorage.getItem('registeredUsers');
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      // Handle both array and object formats
      return Array.isArray(parsed) ? parsed : Object.values(parsed);
    } catch (e) {
      return [];
    }
  });
  const [allUsers, setAllUsers] = useState([]);
  const [participantError, setParticipantError] = useState('');
  const [participantSuccess, setParticipantSuccess] = useState('');

  // Backend API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  // Load users from backend
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/all`, {
          timeout: 5000
        });
        if (response.data) {
          setAllUsers(response.data);
        }
      } catch (err) {
        console.error('Error loading users:', err);
      }
    };

    loadUsers();
  }, [API_URL]);

  useEffect(() => {
    localStorage.setItem(`studySession_${selectedContact?.id}`, JSON.stringify(studySession));
  }, [studySession, selectedContact?.id]);

  useEffect(() => {
    let interval;
    if (studySession.isActive) {
      interval = setInterval(() => {
        setStudySession(prev => ({
          ...prev,
          duration: prev.duration + 1
        }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [studySession.isActive]);

  const startStudySession = () => {
    if (!topic.trim()) {
      alert('Please enter a study topic');
      return;
    }

    setStudySession(prev => ({
      ...prev,
      isActive: true,
      startTime: new Date().toISOString(),
      topic,
      participants: [selectedContact?.name || 'You'],
      focusLevel: 100
    }));
  };

  const endStudySession = () => {
    setStudySession(prev => ({
      ...prev,
      isActive: false
    }));
    setTopic('');
  };

  const addGoal = () => {
    if (!goal.trim()) return;
    
    const currentUser = localStorage.getItem('userAddress') || 'User';
    const newGoal = {
      id: Date.now(),
      text: goal,
      completed: false,
      author: currentUser,
      createdAt: new Date().toISOString(),
      sharedWith: selectedContact?.username || selectedContact?.name || 'Unknown'
    };

    setStudySession(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));

    // Save goal to shared storage for other user to see
    const sharedGoalsKey = `studyGoals_${selectedContact?.id}`;
    const existingGoals = JSON.parse(localStorage.getItem(sharedGoalsKey) || '[]');
    localStorage.setItem(sharedGoalsKey, JSON.stringify([...existingGoals, newGoal]));

    // Send notification to other user
    const notificationsKey = `studyNotifications_${selectedContact?.username || selectedContact?.name}`;
    const existingNotifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');
    const notification = {
      id: Date.now(),
      type: 'goal_added',
      message: `${currentUser} added a goal: "${goal}"`,
      author: currentUser,
      timestamp: new Date().toISOString(),
      read: false
    };
    localStorage.setItem(notificationsKey, JSON.stringify([...existingNotifications, notification]));

    setGoal('');
  };

  const toggleGoal = (goalId) => {
    setStudySession(prev => ({
      ...prev,
      goals: prev.goals.map(g =>
        g.id === goalId ? { ...g, completed: !g.completed } : g
      )
    }));
  };

  const deleteGoal = (goalId) => {
    setStudySession(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g.id !== goalId)
    }));
  };

  const addParticipant = () => {
    setParticipantError('');
    setParticipantSuccess('');

    if (!newParticipant.trim()) {
      setParticipantError('Please enter a participant name');
      return;
    }

    const participantName = newParticipant.trim();

    // Check if participant already exists in session
    if (studySession.participants.some(p => p.username === participantName || p.name === participantName)) {
      setParticipantError('❌ This participant is already in the study group!');
      setTimeout(() => setParticipantError(''), 3000);
      return;
    }

    // Check if user is registered - try multiple sources
    let userData = null;

    // 1. Check backend users (new system)
    const backendUser = allUsers.find(u => 
      u.username && u.username.toLowerCase() === participantName.toLowerCase()
    );
    if (backendUser) {
      userData = {
        username: backendUser.username,
        email: backendUser.email,
        registeredAt: backendUser.createdAt,
        source: 'backend'
      };
    }

    // 2. Check localStorage users (array format - new)
    if (!userData && Array.isArray(registeredUsers)) {
      const localUser = registeredUsers.find(u => 
        u.username && u.username.toLowerCase() === participantName.toLowerCase()
      );
      if (localUser) {
        userData = {
          username: localUser.username,
          email: localUser.email,
          registeredAt: localUser.registeredAt,
          source: 'localStorage'
        };
      }
    }

    // 3. Check if it's in the old format (object keys)
    if (!userData && !Array.isArray(registeredUsers)) {
      for (const key in registeredUsers) {
        if (key.toLowerCase() === participantName.toLowerCase()) {
          userData = {
            username: key,
            email: registeredUsers[key].email,
            registeredAt: registeredUsers[key].registeredAt,
            source: 'localStorage'
          };
          break;
        }
      }
    }

    // If user not found in any source
    if (!userData) {
      setParticipantError('❌ User not registered! Only real registered users can participate.');
      setTimeout(() => setParticipantError(''), 3000);
      return;
    }

    // Add participant with user data
    setStudySession(prev => ({
      ...prev,
      participants: [...prev.participants, {
        username: userData.username,
        email: userData.email,
        registeredAt: userData.registeredAt,
        joinedAt: new Date().toISOString()
      }]
    }));

    setParticipantSuccess(`✅ ${userData.username} added successfully!`);
    setNewParticipant('');
    setTimeout(() => setParticipantSuccess(''), 2000);
  };

  const removeParticipant = (username) => {
    setStudySession(prev => ({
      ...prev,
      participants: prev.participants.filter(p => p.username !== username)
    }));
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const completedGoals = studySession.goals.filter(g => g.completed).length;
  const totalGoals = studySession.goals.length;
  const progressPercentage = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Study Mode"
      >
        <BookOpen size={20} className="text-gray-600 dark:text-gray-400" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className={`sticky top-0 bg-gradient-to-r ${studySession.isActive ? 'from-green-500 to-emerald-500' : 'from-blue-500 to-cyan-500'} p-6 flex justify-between items-center`}>
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BookOpen size={24} />
                  Study Mode
                </h2>
                <p className={`text-sm mt-1 ${studySession.isActive ? 'text-green-100' : 'text-blue-100'}`}>
                  {studySession.isActive ? 'Study session active' : 'Start a collaborative study session'}
                </p>
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
              {!studySession.isActive ? (
                // Start Session Form
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-2">
                      📚 Study Topic
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Mathematics Chapter 5, Biology Revision"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 dark:text-white mb-2">
                      ⏱️ Planned Duration (minutes)
                    </label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      min="5"
                      max="480"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-4 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>💡 Study Mode Features:</strong>
                    </p>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1 list-disc list-inside">
                      <li>Track study time and progress</li>
                      <li>Set and track learning goals</li>
                      <li>Focus mode with distraction blocking</li>
                      <li>Collaborative study with group members</li>
                      <li>Study statistics and achievements</li>
                    </ul>
                  </div>

                  <button
                    onClick={startStudySession}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Start Study Session
                  </button>
                </div>
              ) : (
                // Active Session
                <div className="space-y-6">
                  {/* Session Info */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 p-6 rounded-lg border border-green-200 dark:border-green-700">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400">Topic</p>
                        <p className="text-lg font-bold text-green-800 dark:text-green-200">{studySession.topic}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400">Time Spent</p>
                        <p className="text-lg font-bold text-green-800 dark:text-green-200">{formatTime(studySession.duration)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400">Participants</p>
                        <p className="text-lg font-bold text-green-800 dark:text-green-200">{studySession.participants.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-green-600 dark:text-green-400">Focus Level</p>
                        <p className="text-lg font-bold text-green-800 dark:text-green-200">{studySession.focusLevel}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Focus Mode Toggle */}
                  <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900 rounded-lg border border-purple-200 dark:border-purple-700">
                    <input
                      type="checkbox"
                      checked={focusMode}
                      onChange={(e) => setFocusMode(e.target.checked)}
                      className="w-5 h-5 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-purple-800 dark:text-purple-200">🎯 Focus Mode</p>
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        {focusMode ? 'Notifications muted, distractions minimized' : 'Enable to minimize distractions'}
                      </p>
                    </div>
                    {focusMode && <Award size={24} className="text-purple-600 dark:text-purple-400" />}
                  </div>

                  {/* Goals Section */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <Target size={20} />
                      Learning Goals ({completedGoals}/{totalGoals})
                    </h3>

                    {/* Progress Bar */}
                    {totalGoals > 0 && (
                      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    )}

                    {/* Add Goal */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') addGoal();
                        }}
                        placeholder="Add a learning goal..."
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={addGoal}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                      >
                        <Plus size={18} />
                        Add
                      </button>
                    </div>

                    {/* Goals List */}
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {studySession.goals.map(g => (
                        <div
                          key={g.id}
                          className="flex flex-col gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700"
                        >
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => toggleGoal(g.id)}
                              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                g.completed
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                              }`}
                            >
                              {g.completed && <Check size={16} className="text-white" />}
                            </button>
                            <span className={`flex-1 ${g.completed ? 'line-through text-gray-500' : 'text-gray-800 dark:text-white'}`}>
                              {g.text}
                            </span>
                            <button
                              onClick={() => deleteGoal(g.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 ml-8">
                            <span className="font-semibold text-blue-600 dark:text-blue-400">✍️ {g.author}</span>
                            <span>•</span>
                            <span>{new Date(g.createdAt).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {studySession.goals.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        No goals yet. Add one to get started! 📝
                      </p>
                    )}
                  </div>

                  {/* Participants */}
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
                    <p className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <Users size={20} />
                      Study Group ({studySession.participants.length})
                    </p>

                    {/* Add Participant Input */}
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newParticipant}
                          onChange={(e) => setNewParticipant(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') addParticipant();
                          }}
                          placeholder="Enter registered username..."
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={addParticipant}
                          className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1 text-sm font-semibold"
                        >
                          <Plus size={16} />
                          Add
                        </button>
                      </div>

                      {/* Error Message */}
                      {participantError && (
                        <div className="flex items-center gap-2 p-2 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-200 text-sm">
                          <AlertCircle size={16} />
                          {participantError}
                        </div>
                      )}

                      {/* Success Message */}
                      {participantSuccess && (
                        <div className="flex items-center gap-2 p-2 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg text-green-700 dark:text-green-200 text-sm">
                          <CheckCircle size={16} />
                          {participantSuccess}
                        </div>
                      )}
                    </div>

                    {/* Participants List */}
                    <div className="space-y-2">
                      {studySession.participants.map((participant, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-2 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg text-sm flex items-center justify-between group hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">✅</span>
                              <div>
                                <p className="font-semibold text-blue-800 dark:text-blue-200">👤 {participant.username}</p>
                                <p className="text-xs text-blue-600 dark:text-blue-400">{participant.email}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Registered: {new Date(participant.registeredAt).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeParticipant(participant.username)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400 hover:text-red-600 dark:hover:text-red-400 text-lg"
                            title="Remove participant"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>

                    {studySession.participants.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        No registered participants yet. Add one to start! 👥
                      </p>
                    )}
                  </div>

                  {/* End Session Button */}
                  <button
                    onClick={endStudySession}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    End Study Session
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StudyMode;
