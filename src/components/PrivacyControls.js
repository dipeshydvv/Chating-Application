import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Lock, X, Check } from 'lucide-react';

function PrivacyControls() {
  const [showModal, setShowModal] = useState(false);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('privacySettings');
    return saved ? JSON.parse(saved) : {
      hideLastSeen: false,
      hideProfilePicture: false,
      hideReadReceipts: false
    };
  });

  useEffect(() => {
    localStorage.setItem('privacySettings', JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const privacyOptions = [
    {
      id: 'hideLastSeen',
      title: 'Hide Last Seen',
      description: 'Others won\'t see when you were last online',
      icon: '👁️'
    },
    {
      id: 'hideProfilePicture',
      title: 'Hide Profile Picture',
      description: 'Your profile picture won\'t be visible to others',
      icon: '📷'
    },
    {
      id: 'hideReadReceipts',
      title: 'Hide Read Receipts',
      description: 'Others won\'t see if you\'ve read their messages',
      icon: '✓'
    }
  ];

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Privacy Controls"
      >
        <Lock size={20} className="text-gray-600 dark:text-gray-400" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Lock size={24} />
                  Privacy Controls
                </h2>
                <p className="text-blue-100 text-sm mt-1">Manage your online visibility</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {privacyOptions.map(option => (
                <div
                  key={option.id}
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{option.icon}</span>
                        <h3 className="font-semibold text-gray-800 dark:text-white">
                          {option.title}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleSetting(option.id)}
                      className={`ml-4 px-4 py-2 rounded-lg font-semibold transition-all ${
                        settings[option.id]
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {settings[option.id] ? (
                        <Check size={18} className="inline" />
                      ) : (
                        <EyeOff size={18} className="inline" />
                      )}
                    </button>
                  </div>
                </div>
              ))}

              {/* Status Display */}
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Current Status:</strong>
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                  {settings.hideLastSeen && <li>✓ Last seen is hidden</li>}
                  {settings.hideProfilePicture && <li>✓ Profile picture is hidden</li>}
                  {settings.hideReadReceipts && <li>✓ Read receipts are hidden</li>}
                  {!settings.hideLastSeen && !settings.hideProfilePicture && !settings.hideReadReceipts && (
                    <li>All privacy settings are off</li>
                  )}
                </ul>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PrivacyControls;
