import React, { useState, useEffect } from 'react';
import { Palette, Sun, Moon, Settings, BarChart3, TrendingUp, Users, MessageSquare, Activity, X, Share2, Check } from 'lucide-react';

function ThemeCustomizationPage({ onBack }) {
  const [activeTab, setActiveTab] = useState('theme');
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('selectedTheme') || 'dark';
  });
  const [primaryColor, setPrimaryColor] = useState(() => {
    return localStorage.getItem('primaryColor') || '#3b82f6';
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('accentColor') || '#ec4899';
  });
  const [modeToggle, setModeToggle] = useState(() => {
    return localStorage.getItem('modeToggle') || 'auto';
  });
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [selectedUsersToShare, setSelectedUsersToShare] = useState([]);
  const [shareMessage, setShareMessage] = useState('');
  const [analytics, setAnalytics] = useState({
    totalMessages: 0,
    dailyActiveUsers: 0,
    chatVolume: 0,
    messageDeliveryRate: 95,
    averageResponseTime: '2.5 min',
    peakHours: '2-4 PM',
    mostActiveContact: 'N/A',
    totalContacts: 0
  });

  // Predefined themes
  const themes = [
    {
      name: 'Light Mode',
      id: 'light',
      icon: '☀️',
      colors: { bg: '#ffffff', text: '#000000', secondary: '#f3f4f6' }
    },
    {
      name: 'Dark Mode',
      id: 'dark',
      icon: '🌙',
      colors: { bg: '#1f2937', text: '#ffffff', secondary: '#111827' }
    },
    {
      name: 'Midnight',
      id: 'midnight',
      icon: '🌃',
      colors: { bg: '#0f172a', text: '#e2e8f0', secondary: '#1e293b' }
    },
    {
      name: 'Ocean',
      id: 'ocean',
      icon: '🌊',
      colors: { bg: '#0c4a6e', text: '#e0f2fe', secondary: '#164e63' }
    },
    {
      name: 'Forest',
      id: 'forest',
      icon: '🌲',
      colors: { bg: '#14532d', text: '#dcfce7', secondary: '#166534' }
    },
    {
      name: 'Sunset',
      id: 'sunset',
      icon: '🌅',
      colors: { bg: '#7c2d12', text: '#fef3c7', secondary: '#92400e' }
    }
  ];

  const presetColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
  ];

  // Load registered users
  useEffect(() => {
    const saved = localStorage.getItem('registeredUsers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const users = Array.isArray(parsed) ? parsed : Object.values(parsed);
        setRegisteredUsers(users);
      } catch (e) {
        setRegisteredUsers([]);
      }
    }
  }, []);

  // Calculate analytics
  useEffect(() => {
    let totalMessages = 0;
    let mostActiveContact = 'N/A';
    let maxMessages = 0;

    const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    
    contacts.forEach(contact => {
      const contactMessages = contact.messages || [];
      totalMessages += contactMessages.length;
      
      if (contactMessages.length > maxMessages) {
        maxMessages = contactMessages.length;
        mostActiveContact = contact.name || 'N/A';
      }
    });

    // Also check for messages stored in ChatHome format
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith('messages_')) {
        try {
          const msgs = JSON.parse(localStorage.getItem(key) || '[]');
          if (Array.isArray(msgs)) {
            totalMessages += msgs.length;
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    });

    const dailyActiveUsers = contacts.filter(c => c.status === 'Online').length;
    const chatVolume = contacts.length;

    setAnalytics(prev => ({
      ...prev,
      totalMessages,
      dailyActiveUsers,
      chatVolume,
      totalContacts: contacts.length,
      mostActiveContact
    }));
  }, []);

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    localStorage.setItem('selectedTheme', themeId);
    
    // Apply theme to document
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      document.documentElement.style.setProperty('--bg-color', theme.colors.bg);
      document.documentElement.style.setProperty('--text-color', theme.colors.text);
      document.documentElement.style.setProperty('--secondary-color', theme.colors.secondary);
    }
  };

  const handlePrimaryColorChange = (color) => {
    setPrimaryColor(color);
    localStorage.setItem('primaryColor', color);
    document.documentElement.style.setProperty('--primary-color', color);
  };

  const handleAccentColorChange = (color) => {
    setAccentColor(color);
    localStorage.setItem('accentColor', color);
    document.documentElement.style.setProperty('--accent-color', color);
  };

  const handleModeToggle = (mode) => {
    setModeToggle(mode);
    localStorage.setItem('modeToggle', mode);
    
    if (mode === 'light') {
      handleThemeChange('light');
    } else if (mode === 'dark') {
      handleThemeChange('dark');
    }
  };

  const toggleUserSelection = (username) => {
    setSelectedUsersToShare(prev => 
      prev.includes(username) 
        ? prev.filter(u => u !== username)
        : [...prev, username]
    );
  };

  const handleShareTheme = () => {
    if (selectedUsersToShare.length === 0) {
      alert('Please select at least one user to share with');
      return;
    }

    const themeData = {
      theme: currentTheme,
      primaryColor,
      accentColor,
      modeToggle,
      sharedAt: new Date().toISOString(),
      sharedBy: localStorage.getItem('currentUsername') || 'Anonymous'
    };

    const sharedThemes = JSON.parse(localStorage.getItem('sharedThemes') || '{}');
    
    selectedUsersToShare.forEach(username => {
      if (!sharedThemes[username]) {
        sharedThemes[username] = [];
      }
      sharedThemes[username].push(themeData);
    });

    localStorage.setItem('sharedThemes', JSON.stringify(sharedThemes));
    
    setShareMessage(`✅ Theme shared with ${selectedUsersToShare.length} user(s)!`);
    setSelectedUsersToShare([]);
    
    setTimeout(() => setShareMessage(''), 3000);
  };

  const stats = [
    {
      title: 'Total Messages',
      value: analytics.totalMessages,
      icon: '💬',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Daily Active Users',
      value: analytics.dailyActiveUsers,
      icon: '👥',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Chat Volume',
      value: analytics.chatVolume,
      icon: '📊',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Delivery Rate',
      value: `${analytics.messageDeliveryRate}%`,
      icon: '✓',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const details = [
    { label: 'Avg Response Time', value: analytics.averageResponseTime },
    { label: 'Peak Hours', value: analytics.peakHours },
    { label: 'Most Active Contact', value: analytics.mostActiveContact },
    { label: 'Total Contacts', value: analytics.totalContacts }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Palette size={32} />
            Theme & Customization
          </h1>
          <p className="text-purple-100 text-sm mt-1">Personalize your chat experience</p>
        </div>
        <button
          onClick={onBack}
          className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700 bg-gray-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('theme')}
          className={`py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'theme'
              ? 'border-b-2 border-purple-500 text-purple-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Palette size={20} className="inline mr-2" />
          Themes
        </button>
        <button
          onClick={() => setActiveTab('mode')}
          className={`py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'mode'
              ? 'border-b-2 border-purple-500 text-purple-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Sun size={20} className="inline mr-2" />
          Light/Dark
        </button>
        <button
          onClick={() => setActiveTab('colors')}
          className={`py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'colors'
              ? 'border-b-2 border-purple-500 text-purple-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Settings size={20} className="inline mr-2" />
          Colors
        </button>
        <button
          onClick={() => setActiveTab('share')}
          className={`py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'share'
              ? 'border-b-2 border-purple-500 text-purple-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <Share2 size={20} className="inline mr-2" />
          Share
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'border-b-2 border-purple-500 text-purple-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          <BarChart3 size={20} className="inline mr-2" />
          Analytics
        </button>
      </div>

      {/* Content */}
      <div className="p-8 max-w-6xl mx-auto">
        {/* Theme Tab */}
        {activeTab === 'theme' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Palette size={24} />
                Choose Theme
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`p-6 rounded-lg border-2 transition-all ${
                      currentTheme === theme.id
                        ? 'border-purple-500 bg-gray-800'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-4xl mb-3">{theme.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{theme.name}</h3>
                    <div className="flex gap-2 mb-3">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-gray-600"
                        style={{ backgroundColor: theme.colors.bg }}
                      />
                      <div
                        className="w-8 h-8 rounded-full border-2 border-gray-600"
                        style={{ backgroundColor: theme.colors.secondary }}
                      />
                    </div>
                    {currentTheme === theme.id && (
                      <div className="text-purple-400 text-sm font-semibold">✓ Active</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Light/Dark Mode Tab */}
        {activeTab === 'mode' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sun size={24} />
                Light & Dark Mode
              </h2>
              <p className="text-gray-400 mb-6">Choose your preferred display mode</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Light Mode */}
                <button
                  onClick={() => handleModeToggle('light')}
                  className={`p-8 rounded-lg border-2 transition-all ${
                    modeToggle === 'light'
                      ? 'border-yellow-400 bg-gray-800'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="text-6xl mb-4">☀️</div>
                  <h3 className="text-xl font-semibold mb-2">Light Mode</h3>
                  <p className="text-gray-400 text-sm mb-4">Bright and clean interface</p>
                  {modeToggle === 'light' && (
                    <div className="text-yellow-400 text-sm font-semibold flex items-center gap-2">
                      <Check size={16} /> Active
                    </div>
                  )}
                </button>

                {/* Dark Mode */}
                <button
                  onClick={() => handleModeToggle('dark')}
                  className={`p-8 rounded-lg border-2 transition-all ${
                    modeToggle === 'dark'
                      ? 'border-blue-400 bg-gray-800'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="text-6xl mb-4">🌙</div>
                  <h3 className="text-xl font-semibold mb-2">Dark Mode</h3>
                  <p className="text-gray-400 text-sm mb-4">Easy on the eyes</p>
                  {modeToggle === 'dark' && (
                    <div className="text-blue-400 text-sm font-semibold flex items-center gap-2">
                      <Check size={16} /> Active
                    </div>
                  )}
                </button>

                {/* Auto Mode */}
                <button
                  onClick={() => handleModeToggle('auto')}
                  className={`p-8 rounded-lg border-2 transition-all ${
                    modeToggle === 'auto'
                      ? 'border-purple-400 bg-gray-800'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="text-6xl mb-4">🔄</div>
                  <h3 className="text-xl font-semibold mb-2">Auto</h3>
                  <p className="text-gray-400 text-sm mb-4">Follow system settings</p>
                  {modeToggle === 'auto' && (
                    <div className="text-purple-400 text-sm font-semibold flex items-center gap-2">
                      <Check size={16} /> Active
                    </div>
                  )}
                </button>
              </div>

              <div className="mt-8 p-6 bg-blue-900/30 border border-blue-700 rounded-lg">
                <p className="text-blue-300 text-sm">
                  💡 <strong>Tip:</strong> Light Mode is perfect for daytime use, Dark Mode is great for night time, and Auto mode will switch based on your system preferences.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Share Theme Tab */}
        {activeTab === 'share' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Share2 size={24} />
                Share Theme with Users
              </h2>
              <p className="text-gray-400 mb-6">Share your current theme and color settings with registered users</p>
              
              {shareMessage && (
                <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300">
                  {shareMessage}
                </div>
              )}

              {registeredUsers.length === 0 ? (
                <div className="p-8 bg-gray-800 border border-gray-700 rounded-lg text-center">
                  <p className="text-gray-400 mb-2">No registered users found</p>
                  <p className="text-gray-500 text-sm">Register users first to share themes with them</p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Select Users to Share With</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {registeredUsers.map((user) => (
                        <button
                          key={user.username}
                          onClick={() => toggleUserSelection(user.username)}
                          className={`p-4 rounded-lg border-2 transition-all text-left ${
                            selectedUsersToShare.includes(user.username)
                              ? 'border-purple-500 bg-purple-900/30'
                              : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-semibold text-white">{user.username}</p>
                              <p className="text-sm text-gray-400">{user.email}</p>
                            </div>
                            {selectedUsersToShare.includes(user.username) && (
                              <Check size={20} className="text-purple-400" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8 p-6 bg-gray-800 border border-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Current Theme Settings</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Theme</p>
                        <p className="text-lg font-semibold text-white capitalize">{currentTheme}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Mode</p>
                        <p className="text-lg font-semibold text-white capitalize">{modeToggle}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Primary Color</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-6 h-6 rounded border border-gray-600"
                            style={{ backgroundColor: primaryColor }}
                          />
                          <p className="text-sm font-mono">{primaryColor}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Accent Color</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className="w-6 h-6 rounded border border-gray-600"
                            style={{ backgroundColor: accentColor }}
                          />
                          <p className="text-sm font-mono">{accentColor}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleShareTheme}
                    disabled={selectedUsersToShare.length === 0}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                      selectedUsersToShare.length === 0
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    }`}
                  >
                    <Share2 size={20} />
                    Share Theme with {selectedUsersToShare.length} User{selectedUsersToShare.length !== 1 ? 's' : ''}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Customize Colors</h2>
              
              {/* Primary Color */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Primary Color</h3>
                <div className="flex gap-3 flex-wrap mb-4">
                  {presetColors.map(color => (
                    <button
                      key={color}
                      onClick={() => handlePrimaryColorChange(color)}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        primaryColor === color
                          ? 'border-white scale-110'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => handlePrimaryColorChange(e.target.value)}
                    className="w-16 h-16 rounded-lg cursor-pointer"
                  />
                  <div>
                    <p className="text-sm text-gray-400">Custom Color</p>
                    <p className="text-lg font-mono font-semibold">{primaryColor}</p>
                  </div>
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Accent Color</h3>
                <div className="flex gap-3 flex-wrap mb-4">
                  {presetColors.map(color => (
                    <button
                      key={color}
                      onClick={() => handleAccentColorChange(color)}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        accentColor === color
                          ? 'border-white scale-110'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => handleAccentColorChange(e.target.value)}
                    className="w-16 h-16 rounded-lg cursor-pointer"
                  />
                  <div>
                    <p className="text-sm text-gray-400">Custom Color</p>
                    <p className="text-lg font-mono font-semibold">{accentColor}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BarChart3 size={24} />
                Track your chat insights and metrics
              </h2>

              {/* Key Stats */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} />
                  Key Metrics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, idx) => (
                    <div
                      key={idx}
                      className={`bg-gradient-to-br ${stat.color} p-6 rounded-lg text-white shadow-lg`}
                    >
                      <p className="text-3xl mb-2">{stat.icon}</p>
                      <p className="text-sm opacity-90">{stat.title}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Insights */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center gap-2">
                  <Activity size={20} />
                  Detailed Insights
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {details.map((detail, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-800 p-4 rounded-lg border border-gray-700"
                    >
                      <p className="text-sm text-gray-400 mb-1">
                        {detail.label}
                      </p>
                      <p className="text-xl font-bold text-white">
                        {detail.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Delivery Analytics */}
              <div className="bg-gradient-to-r from-blue-900 to-cyan-900 p-6 rounded-lg border border-blue-700 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <MessageSquare size={20} />
                  Message Delivery Analytics
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">Delivered</span>
                      <span className="text-sm font-semibold text-green-400">95%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">Read</span>
                      <span className="text-sm font-semibold text-blue-400">87%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '87%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-300">Failed</span>
                      <span className="text-sm font-semibold text-red-400">5%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '5%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* User Insights */}
              <div className="bg-gradient-to-r from-green-900 to-emerald-900 p-6 rounded-lg border border-green-700">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Users size={20} />
                  User Insights
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-300">Active Users Today</p>
                    <p className="text-3xl font-bold text-green-400 mt-1">
                      {analytics.dailyActiveUsers}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-300">Total Contacts</p>
                    <p className="text-3xl font-bold text-green-400 mt-1">
                      {analytics.totalContacts}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ThemeCustomizationPage;
