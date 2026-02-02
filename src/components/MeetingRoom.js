// Meeting Room Component
// Create and join meetings like WhatsApp

import React, { useState, useEffect } from 'react';
import { Video, Phone, Copy, Share2, Users, Calendar, Clock, MapPin, X, Plus, Loader, Check, AlertCircle } from 'lucide-react';
import axios from 'axios';

function MeetingRoom() {
  // State
  const [meetings, setMeetings] = useState([]);
  const [showCreateMeeting, setShowCreateMeeting] = useState(false);
  const [showJoinMeeting, setShowJoinMeeting] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDescription, setMeetingDescription] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Backend API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  // Load data on mount
  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        setCurrentUserId(user.id);
      } catch (err) {
        console.error('Error parsing user:', err);
      }
    }

    loadMeetings();
    loadUsers();
  }, []);

  // Load meetings
  const loadMeetings = async () => {
    try {
      const response = await axios.get(`${API_URL}/meetings`, {
        timeout: 5000
      });
      if (response.data) {
        setMeetings(response.data);
      }
    } catch (err) {
      console.error('Error loading meetings:', err);
      // Fallback to localStorage
      const saved = localStorage.getItem('meetings');
      if (saved) {
        setMeetings(JSON.parse(saved));
      }
    }
  };

  // Load users
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
      const saved = localStorage.getItem('registeredUsers');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setAllUsers(parsed);
          } else {
            setAllUsers(Object.values(parsed));
          }
        } catch (e) {
          console.error('Error parsing saved users:', e);
        }
      }
    }
  };

  // Generate meeting code
  const generateMeetingCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  // Create meeting
  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!meetingTitle.trim()) {
      setError('Please enter meeting title');
      return;
    }

    if (!meetingDate || !meetingTime) {
      setError('Please select date and time');
      return;
    }

    setLoading(true);

    try {
      const meetingCode = generateMeetingCode();
      const newMeeting = {
        id: Date.now(),
        code: meetingCode,
        title: meetingTitle,
        description: meetingDescription,
        date: meetingDate,
        time: meetingTime,
        createdBy: currentUserId,
        createdByName: currentUser?.username,
        participants: [currentUserId, ...selectedParticipants.map(u => u.id)],
        participantDetails: [
          { id: currentUserId, username: currentUser?.username },
          ...selectedParticipants
        ],
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        joinedUsers: [currentUserId]
      };

      try {
        await axios.post(`${API_URL}/meetings`, newMeeting, {
          timeout: 5000
        });
      } catch (err) {
        // Fallback to localStorage
        const existing = JSON.parse(localStorage.getItem('meetings') || '[]');
        existing.push(newMeeting);
        localStorage.setItem('meetings', JSON.stringify(existing));
      }

      setMeetings(prev => [...prev, newMeeting]);
      setSuccess(`✅ Meeting created! Code: ${meetingCode}`);
      
      // Reset form
      setMeetingTitle('');
      setMeetingDescription('');
      setMeetingTime('');
      setMeetingDate('');
      setSelectedParticipants([]);
      setShowCreateMeeting(false);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error creating meeting:', err);
      setError('Failed to create meeting');
    } finally {
      setLoading(false);
    }
  };

  // Join meeting
  const handleJoinMeeting = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!joinCode.trim()) {
      setError('Please enter meeting code');
      return;
    }

    setLoading(true);

    try {
      const meeting = meetings.find(m => m.code.toUpperCase() === joinCode.toUpperCase());
      
      if (!meeting) {
        setError('Meeting code not found');
        setLoading(false);
        return;
      }

      if (!meeting.joinedUsers.includes(currentUserId)) {
        meeting.joinedUsers.push(currentUserId);
      }

      try {
        await axios.post(`${API_URL}/meetings/${meeting.id}/join`, {
          userId: currentUserId,
          username: currentUser?.username
        }, {
          timeout: 5000
        });
      } catch (err) {
        // Fallback to localStorage
        const existing = JSON.parse(localStorage.getItem('meetings') || '[]');
        const idx = existing.findIndex(m => m.id === meeting.id);
        if (idx !== -1) {
          if (!existing[idx].joinedUsers.includes(currentUserId)) {
            existing[idx].joinedUsers.push(currentUserId);
          }
          localStorage.setItem('meetings', JSON.stringify(existing));
        }
      }

      setMeetings(prev => prev.map(m => 
        m.id === meeting.id ? meeting : m
      ));

      setSuccess(`✅ Joined meeting: ${meeting.title}`);
      setSelectedMeeting(meeting);
      setJoinCode('');
      setShowJoinMeeting(false);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error joining meeting:', err);
      setError('Failed to join meeting');
    } finally {
      setLoading(false);
    }
  };

  // Copy meeting code
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setSuccess('✅ Meeting code copied!');
    setTimeout(() => setSuccess(''), 2000);
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Toggle participant selection
  const toggleParticipant = (user) => {
    if (selectedParticipants.some(u => u.id === user.id)) {
      setSelectedParticipants(selectedParticipants.filter(u => u.id !== user.id));
    } else {
      setSelectedParticipants([...selectedParticipants, user]);
    }
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Video className="w-8 h-8 text-blue-500" />
          Meeting Rooms
        </h1>
        <p className="text-gray-400">Create and join meetings like WhatsApp</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-900 border border-green-700 rounded-lg text-green-200 flex items-start gap-2">
          <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowCreateMeeting(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Meeting
        </button>
        <button
          onClick={() => setShowJoinMeeting(true)}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
        >
          <Phone className="w-5 h-5" />
          Join Meeting
        </button>
      </div>

      {/* Create Meeting Modal */}
      {showCreateMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">Create Meeting</h2>
              <button
                onClick={() => setShowCreateMeeting(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateMeeting} className="p-4 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={meetingTitle}
                  onChange={(e) => setMeetingTitle(e.target.value)}
                  placeholder="e.g., Team Standup"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={meetingDescription}
                  onChange={(e) => setMeetingDescription(e.target.value)}
                  placeholder="Meeting details..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={meetingTime}
                  onChange={(e) => setMeetingTime(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Participants */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Invite Participants ({selectedParticipants.length})
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {allUsers
                    .filter(u => u.id !== currentUserId)
                    .map(user => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => toggleParticipant(user)}
                        className={`w-full p-2 text-left rounded-lg transition-colors flex items-center gap-2 ${
                          selectedParticipants.some(u => u.id === user.id)
                            ? 'bg-blue-600'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <div className="w-4 h-4 border border-gray-400 rounded flex items-center justify-center flex-shrink-0">
                          {selectedParticipants.some(u => u.id === user.id) && (
                            <Check className="w-3 h-3" />
                          )}
                        </div>
                        <span className="text-sm">{user.username || user.name}</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateMeeting(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Meeting Modal */}
      {showJoinMeeting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 flex justify-between items-center">
              <h2 className="text-lg font-bold">Join Meeting</h2>
              <button
                onClick={() => setShowJoinMeeting(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleJoinMeeting} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Meeting Code
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="e.g., ABC12345"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowJoinMeeting(false)}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4" />
                      Join
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Meetings List */}
      <div className="grid gap-4">
        <h2 className="text-xl font-bold mt-6 mb-4">Your Meetings</h2>
        {meetings.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No meetings yet. Create one to get started!</p>
          </div>
        ) : (
          meetings.map(meeting => (
            <div
              key={meeting.id}
              className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold text-white">{meeting.title}</h3>
                  {meeting.description && (
                    <p className="text-sm text-gray-400 mt-1">{meeting.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopyCode(meeting.code)}
                    className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
                    title="Copy meeting code"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedMeeting(meeting)}
                    className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
                    title="View details"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Meeting Info */}
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(meeting.date)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {meeting.time}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {meeting.joinedUsers.length} joined
                </div>
              </div>

              {/* Meeting Code */}
              <div className="mt-3 p-2 bg-gray-700 rounded text-center">
                <p className="text-xs text-gray-400">Meeting Code</p>
                <p className="text-lg font-bold text-blue-400">{meeting.code}</p>
              </div>

              {/* Join Button */}
              {!meeting.joinedUsers.includes(currentUserId) && (
                <button
                  onClick={() => {
                    setJoinCode(meeting.code);
                    handleJoinMeeting({ preventDefault: () => {} });
                  }}
                  className="w-full mt-3 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Join Meeting
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MeetingRoom;
