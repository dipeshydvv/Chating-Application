import React, { useState } from 'react';
import { Video, X, Copy, Check, Loader } from 'lucide-react';
import { safeSetItem, performFullCleanup } from '../utils/storageCleanup';

function GoogleMeetIntegration({ selectedContact, onClose }) {
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState(null);

  // Generate unique meeting ID using Google Meet's format
  const generateMeetingId = () => {
    // Use a combination of lowercase letters and numbers for meeting code
    // Format: xxxxxxx-xxxx-xxx (more flexible for Google Meet)
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    
    // Generate first part: 7 characters
    for (let i = 0; i < 7; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    id += '-';
    
    // Generate second part: 4 characters
    for (let i = 0; i < 4; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    id += '-';
    
    // Generate third part: 3 characters
    for (let i = 0; i < 3; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return id;
  };

  // Start Google Meet
  const startGoogleMeet = async () => {
    setLoading(true);
    
    try {
      // Use Google Meet's create new meeting URL
      // This will automatically create a new meeting room
      const googleMeetUrl = `https://meet.google.com/new`;
      
      setMeetingLink(googleMeetUrl);
      setMeetingStarted(true);
      
      // Store meeting info
      const meetingData = {
        id: `meeting-${Date.now()}`,
        link: googleMeetUrl,
        startedBy: localStorage.getItem('userAddress') || 'User',
        startedWith: selectedContact?.name || 'Unknown',
        startTime: new Date().toISOString(),
        participants: [
          localStorage.getItem('userAddress') || 'User',
          selectedContact?.name || 'Unknown'
        ]
      };
      
      setMeetingInfo(meetingData);
      
      // Save meeting to localStorage with safe storage
      try {
        const meetingHistory = JSON.parse(localStorage.getItem('meetingHistory') || '[]');
        meetingHistory.push(meetingData);
        safeSetItem('meetingHistory', JSON.stringify(meetingHistory));
      } catch (e) {
        console.error('Error saving meeting history:', e);
        // Perform cleanup and try again
        performFullCleanup();
      }
      
      // Open Google Meet in new tab after a short delay
      setTimeout(() => {
        window.open(googleMeetUrl, '_blank', 'width=1200,height=800');
      }, 500);
      
    } catch (error) {
      console.error('Error starting Google Meet:', error);
      alert('Error starting Google Meet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Copy meeting link
  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // End meeting
  const endMeeting = () => {
    setMeetingStarted(false);
    setMeetingLink('');
    setMeetingInfo(null);
  };

  // Share meeting link in chat
  const shareMeetingInChat = () => {
    const currentUser = localStorage.getItem('userAddress') || 'You';
    const contactUsername = selectedContact?.username || selectedContact?.name || 'Unknown';
    
    // Create message object
    const messageText = `📹 Google Meet Link: ${meetingLink}\n\nJoin the video call!`;
    const newMessage = {
      id: Date.now(),
      sender: currentUser,
      senderUsername: currentUser,
      text: messageText,
      type: 'text',
      timestamp: new Date().toLocaleTimeString(),
      isOwn: true
    };

    // Save to localStorage with bidirectional keys using safe storage
    try {
      const messagesKey = `messages_${currentUser}_${contactUsername}`;
      const existingMessages = JSON.parse(localStorage.getItem(messagesKey) || '[]');
      const updatedMessages = [...existingMessages, newMessage];
      safeSetItem(messagesKey, JSON.stringify(updatedMessages));

      // Also save with reverse key for receiver
      const reverseMessagesKey = `messages_${contactUsername}_${currentUser}`;
      const existingReverseMessages = JSON.parse(localStorage.getItem(reverseMessagesKey) || '[]');
      const receivedMessage = {
        ...newMessage,
        isOwn: false
      };
      safeSetItem(reverseMessagesKey, JSON.stringify([...existingReverseMessages, receivedMessage]));
    } catch (e) {
      console.error('Error saving message:', e);
      // Perform cleanup and try again
      performFullCleanup();
    }

    // Emit event to update chat UI
    window.dispatchEvent(new CustomEvent('messageAdded', { 
      detail: { 
        message: newMessage,
        contactUsername: contactUsername
      } 
    }));

    alert('✅ Meeting link shared in chat!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-lg">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Google Meet</h2>
              <p className="text-blue-100 text-sm">Start a video call instantly</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!meetingStarted ? (
            // Start Meeting View
            <div className="space-y-6">
              {/* Info Box */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-blue-200 text-sm">
                  <strong>📹 Quick Video Call:</strong> Click the button below to start a Google Meet video call with {selectedContact?.name || 'this contact'}. A new tab will open with your meeting room.
                </p>
              </div>

              {/* Meeting Details */}
              <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                    {(selectedContact?.name || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{selectedContact?.name || 'Unknown Contact'}</p>
                    <p className="text-gray-400 text-sm">Ready for video call</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <p className="text-2xl mb-1">📹</p>
                  <p className="text-gray-300 text-sm">HD Video</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <p className="text-2xl mb-1">🎤</p>
                  <p className="text-gray-300 text-sm">Crystal Audio</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <p className="text-2xl mb-1">🔒</p>
                  <p className="text-gray-300 text-sm">Secure</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                  <p className="text-2xl mb-1">∞</p>
                  <p className="text-gray-300 text-sm">Unlimited Time</p>
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={startGoogleMeet}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Starting Meeting...
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5" />
                    Start Google Meet Call
                  </>
                )}
              </button>

              {/* Info */}
              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                <p className="text-gray-400 text-xs">
                  ✅ Google Meet will open in a new tab
                </p>
              </div>
            </div>
          ) : (
            // Active Meeting View
            <div className="space-y-6">
              {/* Success Message */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-200 text-sm">
                  <strong>✅ Meeting Started!</strong> Google Meet has opened in a new tab. Share the link below with {selectedContact?.name || 'your contact'}.
                </p>
              </div>

              {/* Meeting Link */}
              <div className="bg-slate-700/50 rounded-lg p-4 space-y-3">
                <p className="text-gray-400 text-sm">Meeting Link:</p>
                <div className="flex items-center gap-2 bg-slate-800 p-3 rounded-lg">
                  <input
                    type="text"
                    value={meetingLink}
                    readOnly
                    className="flex-1 bg-transparent text-white text-sm font-mono outline-none"
                  />
                  <button
                    onClick={copyMeetingLink}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors"
                  >
                    {copied ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Meeting Info */}
              <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                <p className="text-gray-400 text-sm">Meeting Details:</p>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-300">
                    <strong>Started by:</strong> {meetingInfo?.startedBy}
                  </p>
                  <p className="text-gray-300">
                    <strong>With:</strong> {meetingInfo?.startedWith}
                  </p>
                  <p className="text-gray-300">
                    <strong>Time:</strong> {new Date(meetingInfo?.startTime).toLocaleTimeString()}
                  </p>
                  <p className="text-gray-300">
                    <strong>Participants:</strong> {meetingInfo?.participants.join(', ')}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={shareMeetingInChat}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <span>📤</span>
                  Share Link in Chat
                </button>
                <button
                  onClick={() => window.open(meetingLink, '_blank')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Video className="w-5 h-5" />
                  Open Meeting
                </button>
                <button
                  onClick={endMeeting}
                  className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-3 rounded-lg font-semibold transition-all"
                >
                  End Meeting
                </button>
              </div>

              {/* Info */}
              <div className="bg-slate-700/30 rounded-lg p-3 text-center">
                <p className="text-gray-400 text-xs">
                  💡 Meeting link can be shared with anyone. They can join without a Google account.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GoogleMeetIntegration;
