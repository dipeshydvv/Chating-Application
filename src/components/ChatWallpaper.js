import React, { useState, useEffect } from 'react';
import { Image, X, Check, Upload } from 'lucide-react';

function ChatWallpaper() {
  const [showModal, setShowModal] = useState(false);
  const [currentWallpaper, setCurrentWallpaper] = useState(() => {
    return localStorage.getItem('chatWallpaper') || 'default';
  });
  const [customWallpaper, setCustomWallpaper] = useState('');
  const [opacity, setOpacity] = useState(() => {
    return parseFloat(localStorage.getItem('wallpaperOpacity') || '0.1');
  });

  // Initialize IndexedDB for large image storage
  const initDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('ChatWallpaperDB', 1);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('wallpapers')) {
          db.createObjectStore('wallpapers', { keyPath: 'id' });
        }
      };
    });
  };

  // Load custom wallpaper from IndexedDB on mount
  useEffect(() => {
    const loadCustomWallpaper = async () => {
      try {
        const db = await initDB();
        const transaction = db.transaction('wallpapers', 'readonly');
        const store = transaction.objectStore('wallpapers');
        const request = store.get('customWallpaper');
        
        request.onsuccess = () => {
          if (request.result) {
            setCustomWallpaper(request.result.data);
          }
        };
      } catch (error) {
        console.error('Error loading wallpaper from IndexedDB:', error);
      }
    };

    loadCustomWallpaper();
  }, []);

  const wallpapers = [
    {
      id: 'default',
      name: 'Default',
      emoji: '⚪',
      gradient: 'linear-gradient(135deg, #ffffff 0%, #f3f4f6 100%)',
      color: '#ffffff'
    },
    {
      id: 'gradient-blue',
      name: 'Blue Gradient',
      emoji: '🔵',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea'
    },
    {
      id: 'gradient-pink',
      name: 'Pink Gradient',
      emoji: '🌸',
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f093fb'
    },
    {
      id: 'gradient-green',
      name: 'Green Gradient',
      emoji: '🌿',
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: '#4facfe'
    },
    {
      id: 'gradient-sunset',
      name: 'Sunset',
      emoji: '🌅',
      gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      color: '#fa709a'
    },
    {
      id: 'gradient-ocean',
      name: 'Ocean',
      emoji: '🌊',
      gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      color: '#a8edea'
    },
    {
      id: 'gradient-forest',
      name: 'Forest',
      emoji: '🌲',
      gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
      color: '#134e5e'
    },
    {
      id: 'gradient-night',
      name: 'Night',
      emoji: '🌙',
      gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      color: '#0f2027'
    },
    {
      id: 'gradient-fire',
      name: 'Fire',
      emoji: '🔥',
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 50%, #c44569 100%)',
      color: '#ff6b6b'
    },
    {
      id: 'gradient-purple',
      name: 'Purple',
      emoji: '💜',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea'
    },
    {
      id: 'pattern-dots',
      name: 'Dots Pattern',
      emoji: '⚫',
      pattern: 'radial-gradient(circle, #667eea 1px, transparent 1px)',
      color: '#667eea'
    },
    {
      id: 'pattern-grid',
      name: 'Grid Pattern',
      emoji: '▦',
      pattern: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)',
      color: '#667eea'
    }
  ];

  // Apply wallpaper to chat area
  useEffect(() => {
    const chatArea = document.querySelector('[data-chat-area]');
    if (chatArea) {
      const wallpaper = wallpapers.find(w => w.id === currentWallpaper);
      if (wallpaper) {
        if (wallpaper.gradient) {
          chatArea.style.backgroundImage = wallpaper.gradient;
        } else if (wallpaper.pattern) {
          chatArea.style.backgroundImage = wallpaper.pattern;
          chatArea.style.backgroundColor = wallpaper.color;
          chatArea.style.backgroundSize = '50px 50px';
        }
        chatArea.style.backgroundAttachment = 'fixed';
      }
    }

    localStorage.setItem('chatWallpaper', currentWallpaper);
  }, [currentWallpaper]);

  // Apply custom wallpaper
  useEffect(() => {
    const chatArea = document.querySelector('[data-chat-area]');
    if (chatArea && customWallpaper) {
      chatArea.style.backgroundImage = `url('${customWallpaper}')`;
      chatArea.style.backgroundSize = 'cover';
      chatArea.style.backgroundPosition = 'center';
      chatArea.style.backgroundAttachment = 'fixed';
      chatArea.style.opacity = opacity;
    }

    // Store opacity in localStorage (small data)
    localStorage.setItem('wallpaperOpacity', opacity);

    // Store custom wallpaper in IndexedDB (large data)
    if (customWallpaper) {
      const saveToIndexedDB = async () => {
        try {
          const db = await initDB();
          const transaction = db.transaction('wallpapers', 'readwrite');
          const store = transaction.objectStore('wallpapers');
          store.put({ id: 'customWallpaper', data: customWallpaper });
        } catch (error) {
          console.error('Error saving wallpaper to IndexedDB:', error);
        }
      };
      saveToIndexedDB();
    }
  }, [customWallpaper, opacity]);

  const handleWallpaperChange = (id) => {
    setCurrentWallpaper(id);
    setCustomWallpaper('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomWallpaper(event.target.result);
        setCurrentWallpaper('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveCustom = async () => {
    setCustomWallpaper('');
    setCurrentWallpaper('default');
    
    // Remove from IndexedDB
    try {
      const db = await initDB();
      const transaction = db.transaction('wallpapers', 'readwrite');
      const store = transaction.objectStore('wallpapers');
      store.delete('customWallpaper');
    } catch (error) {
      console.error('Error removing wallpaper from IndexedDB:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Chat Wallpaper"
      >
        <Image size={20} className="text-gray-600 dark:text-gray-400" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-500 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Image size={24} />
                  Chat Wallpaper
                </h2>
                <p className="text-indigo-100 text-sm mt-1">Personalize your chat background</p>
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
              {/* Custom Upload */}
              <div className="bg-indigo-50 dark:bg-indigo-900 p-6 rounded-lg border-2 border-dashed border-indigo-300 dark:border-indigo-700">
                <label className="flex flex-col items-center cursor-pointer">
                  <Upload size={32} className="text-indigo-600 dark:text-indigo-400 mb-2" />
                  <p className="font-semibold text-indigo-900 dark:text-indigo-100">Upload Custom Wallpaper</p>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">Click to select an image</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Custom Wallpaper Preview */}
              {customWallpaper && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Custom Wallpaper Preview</p>
                    <div
                      className="w-full h-32 rounded-lg border border-gray-300 dark:border-gray-600"
                      style={{
                        backgroundImage: `url('${customWallpaper}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Opacity: {Math.round(opacity * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={opacity}
                      onChange={(e) => setOpacity(parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <button
                    onClick={handleRemoveCustom}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Remove Custom Wallpaper
                  </button>
                </div>
              )}

              {/* Preset Wallpapers */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Preset Wallpapers</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wallpapers.map(wallpaper => (
                    <button
                      key={wallpaper.id}
                      onClick={() => handleWallpaperChange(wallpaper.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        currentWallpaper === wallpaper.id && !customWallpaper
                          ? 'border-indigo-500 ring-2 ring-indigo-300'
                          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300'
                      }`}
                    >
                      <div
                        className="w-full h-20 rounded-lg mb-3 border border-gray-300 dark:border-gray-600"
                        style={{
                          backgroundImage: wallpaper.gradient || wallpaper.pattern,
                          backgroundColor: wallpaper.color,
                          backgroundSize: wallpaper.pattern ? '50px 50px' : 'cover'
                        }}
                      />
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">{wallpaper.emoji} {wallpaper.name}</p>
                      {currentWallpaper === wallpaper.id && !customWallpaper && (
                        <div className="mt-2 flex justify-center">
                          <Check size={18} className="text-indigo-500" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-4 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                💡 Wallpapers are applied to the chat message area. Choose from presets or upload your own image!
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
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

export default ChatWallpaper;
