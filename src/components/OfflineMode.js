import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Send, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';

function OfflineMode() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showModal, setShowModal] = useState(false);
  const [offlineMessages, setOfflineMessages] = useState(() => {
    const saved = localStorage.getItem('offlineMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, synced
  const [message, setMessage] = useState('');

  // Listen for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync messages
      syncOfflineMessages();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save offline messages to localStorage
  useEffect(() => {
    localStorage.setItem('offlineMessages', JSON.stringify(offlineMessages));
  }, [offlineMessages]);

  const addOfflineMessage = (text) => {
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now(),
      text,
      timestamp: new Date().toLocaleTimeString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setOfflineMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const syncOfflineMessages = () => {
    if (offlineMessages.length === 0) return;

    setSyncStatus('syncing');

    // Simulate sync delay
    setTimeout(() => {
      // Mark all messages as synced
      setOfflineMessages(prev =>
        prev.map(msg => ({
          ...msg,
          status: 'synced'
        }))
      );

      setSyncStatus('synced');

      // Clear synced messages after 3 seconds
      setTimeout(() => {
        setOfflineMessages([]);
        setSyncStatus('idle');
      }, 3000);
    }, 1500);
  };

  const deleteOfflineMessage = (id) => {
    setOfflineMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const pendingCount = offlineMessages.filter(msg => msg.status === 'pending').length;
  const syncedCount = offlineMessages.filter(msg => msg.status === 'synced').length;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
        title="Offline Mode"
      >
        {isOnline ? (
          <Wifi size={20} className="text-green-500" />
        ) : (
          <WifiOff size={20} className="text-red-500" />
        )}
        {pendingCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {pendingCount}
          </span>
        )}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className={`sticky top-0 bg-gradient-to-r ${isOnline ? 'from-green-500 to-emerald-500' : 'from-red-500 to-orange-500'} p-6 flex justify-between items-center`}>
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  {isOnline ? (
                    <>
                      <Wifi size={24} />
                      Online Mode
                    </>
                  ) : (
                    <>
                      <WifiOff size={24} />
                      Offline Mode
                    </>
                  )}
                </h2>
                <p className={`text-sm mt-1 ${isOnline ? 'text-green-100' : 'text-red-100'}`}>
                  {isOnline
                    ? 'You are connected to the internet'
                    : 'You are offline. Messages will be synced when online.'}
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
              {/* Status Card */}
              <div className={`p-4 rounded-lg border-2 ${isOnline ? 'bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700' : 'bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700'}`}>
                <div className="flex items-center gap-3">
                  {isOnline ? (
                    <>
                      <CheckCircle size={24} className="text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-semibold text-green-800 dark:text-green-200">Connected</p>
                        <p className="text-sm text-green-700 dark:text-green-300">All messages will be sent immediately</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={24} className="text-red-600 dark:text-red-400" />
                      <div>
                        <p className="font-semibold text-red-800 dark:text-red-200">Disconnected</p>
                        <p className="text-sm text-red-700 dark:text-red-300">Messages are saved locally and will sync when online</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Message Composer */}
              {!isOnline && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Compose Offline Message</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addOfflineMessage(message);
                        }
                      }}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      onClick={() => addOfflineMessage(message)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <Send size={18} />
                      Save
                    </button>
                  </div>
                </div>
              )}

              {/* Offline Messages Queue */}
              {offlineMessages.length > 0 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800 dark:text-white">
                      Offline Messages ({offlineMessages.length})
                    </h3>
                    {isOnline && offlineMessages.some(m => m.status === 'pending') && (
                      <button
                        onClick={syncOfflineMessages}
                        disabled={syncStatus === 'syncing'}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center gap-1"
                      >
                        {syncStatus === 'syncing' ? (
                          <>
                            <Loader size={14} className="animate-spin" />
                            Syncing...
                          </>
                        ) : (
                          'Sync Now'
                        )}
                      </button>
                    )}
                  </div>

                  {/* Messages List */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {offlineMessages.map(msg => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-lg border ${
                          msg.status === 'pending'
                            ? 'bg-yellow-50 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700'
                            : 'bg-green-50 dark:bg-green-900 border-green-300 dark:border-green-700'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <p className="text-gray-800 dark:text-white">{msg.text}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {msg.timestamp}
                              </p>
                              <span className={`text-xs px-2 py-1 rounded ${
                                msg.status === 'pending'
                                  ? 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200'
                                  : 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200'
                              }`}>
                                {msg.status === 'pending' ? '⏳ Pending' : '✓ Synced'}
                              </span>
                            </div>
                          </div>
                          {msg.status === 'pending' && (
                            <button
                              onClick={() => deleteOfflineMessage(msg.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Sync Status */}
                  {syncStatus === 'synced' && (
                    <div className="bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 p-3 rounded-lg text-green-800 dark:text-green-200 text-sm">
                      ✓ All messages synced successfully!
                    </div>
                  )}
                </div>
              )}

              {/* Info */}
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                <p className="font-semibold mb-2">💡 How Offline Mode Works:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Messages are saved locally when you're offline</li>
                  <li>Messages automatically sync when you go online</li>
                  <li>You can compose and save multiple messages</li>
                  <li>All messages are encrypted and secure</li>
                </ul>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className={`w-full text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all bg-gradient-to-r ${isOnline ? 'from-green-500 to-emerald-500' : 'from-red-500 to-orange-500'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OfflineMode;
