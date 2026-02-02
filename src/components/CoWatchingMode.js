import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2, X, Plus, Trash2, Eye, Music, Share2 } from 'lucide-react';

function CoWatchingMode({ selectedContact, onClose, onShareMedia }) {
  const [showModal, setShowModal] = useState(false);
  const [playlist, setPlaylist] = useState(() => {
    const saved = localStorage.getItem(`coWatchPlaylist_${selectedContact?.id}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [currentItem, setCurrentItem] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [itemType, setItemType] = useState('video'); // video, audio, document
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const sampleItems = [
    { id: 1, title: 'Study Music - Focus Beats', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', type: 'audio', duration: '3:45' },
    { id: 2, title: 'Python Tutorial - Part 1', url: 'https://www.youtube.com/embed/kqtZrmDKwOc', type: 'video', duration: '12:30' },
    { id: 3, title: 'Biology Lecture Recording', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', type: 'audio', duration: '45:20' },
    { id: 4, title: 'Math Problem Solving', url: 'https://www.youtube.com/embed/9vLj8cJ5HQs', type: 'video', duration: '8:15' },
  ];

  const convertToEmbedUrl = (url) => {
    // Convert YouTube watch URL to embed URL
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Handle youtu.be short URLs
    if (url.includes('youtu.be')) {
      const videoId = url.split('/').pop().split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  const addItem = () => {
    if (!newTitle.trim() || !newUrl.trim()) {
      alert('Please enter both title and URL');
      return;
    }

    let url = newUrl.trim();
    let detectedType = itemType;

    // Auto-detect type from URL if possible
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      detectedType = 'video';
      url = convertToEmbedUrl(url);
    } else if (url.match(/\.(mp3|wav|ogg|m4a)$/i)) {
      detectedType = 'audio';
    } else if (url.match(/\.(mp4|webm|mov|avi)$/i)) {
      detectedType = 'video';
    } else if (url.match(/\.(pdf|doc|docx)$/i)) {
      detectedType = 'document';
    }

    const newItem = {
      id: Date.now(),
      title: newTitle,
      url: url,
      type: detectedType,
      duration: '0:00',
      addedBy: selectedContact?.name || 'You',
      originalUrl: newUrl
    };

    const updated = [...playlist, newItem];
    setPlaylist(updated);
    localStorage.setItem(`coWatchPlaylist_${selectedContact?.id}`, JSON.stringify(updated));
    setNewTitle('');
    setNewUrl('');
  };

  const removeItem = (id) => {
    const updated = playlist.filter(item => item.id !== id);
    setPlaylist(updated);
    localStorage.setItem(`coWatchPlaylist_${selectedContact?.id}`, JSON.stringify(updated));
    if (currentItem?.id === id) {
      setCurrentItem(null);
      setIsPlaying(false);
    }
  };

  const playItem = (item) => {
    setCurrentItem(item);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (currentItem?.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    } else if (currentItem?.type === 'audio' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const displayItems = playlist.length > 0 ? playlist : sampleItems;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Co-Watching Mode"
      >
        <Eye size={20} className="text-gray-600 dark:text-gray-400" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-red-500 to-pink-500 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Eye size={24} />
                  Co-Watching / Co-Listening
                </h2>
                <p className="text-red-100 text-sm mt-1">Watch videos, listen to music, or view documents together</p>
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
              {/* Current Item Player */}
              {currentItem && (
                <div className="bg-gray-900 rounded-lg p-6 space-y-4">
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-2">🎬 Now Playing</h3>
                    <p className="text-gray-300">{currentItem.title}</p>
                    <p className="text-sm text-gray-500 mt-1">Added by {currentItem.addedBy}</p>
                  </div>

                  {/* Video Player */}
                  {currentItem.type === 'video' && (
                    <div className="bg-black rounded-lg overflow-hidden">
                      {currentItem.url.includes('youtube') || currentItem.url.includes('embed') ? (
                        <iframe
                          width="100%"
                          height="400"
                          src={currentItem.url}
                          title={currentItem.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          style={{ display: 'block' }}
                        />
                      ) : (
                        <video
                          ref={videoRef}
                          width="100%"
                          height="400"
                          controls
                          controlsList="nodownload"
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          crossOrigin="anonymous"
                          style={{ backgroundColor: '#000' }}
                        >
                          <source src={currentItem.url} type="video/mp4" />
                          <source src={currentItem.url} type="video/webm" />
                          <source src={currentItem.url} type="video/ogg" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  )}

                  {/* Audio Player */}
                  {currentItem.type === 'audio' && (
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <Music size={32} className="text-white" />
                        <div className="flex-1">
                          <p className="text-white font-semibold">{currentItem.title}</p>
                          <p className="text-purple-100 text-sm">{currentItem.duration}</p>
                        </div>
                      </div>
                      <audio
                        ref={audioRef}
                        controls
                        className="w-full"
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        crossOrigin="anonymous"
                      >
                        <source src={currentItem.url} type="audio/mpeg" />
                        <source src={currentItem.url} type="audio/wav" />
                        <source src={currentItem.url} type="audio/ogg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex gap-2">
                    <button
                      onClick={togglePlayPause}
                      className={`flex-1 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all ${
                        isPlaying
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause size={20} />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play size={20} />
                          Play
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        if (onShareMedia && currentItem) {
                          onShareMedia({
                            type: currentItem.type,
                            title: currentItem.title,
                            url: currentItem.url,
                            messageType: currentItem.type === 'audio' ? 'audio' : currentItem.type === 'video' ? 'video' : 'media'
                          });
                          alert(`📤 "${currentItem.title}" shared with ${selectedContact?.name}!`);
                        }
                      }}
                      className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <Share2 size={20} />
                      Share
                    </button>
                    <button
                      onClick={() => {
                        setCurrentItem(null);
                        setIsPlaying(false);
                      }}
                      className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
                    >
                      Stop
                    </button>
                  </div>
                </div>
              )}

              {/* Add New Item */}
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                  <Plus size={20} />
                  Add to Playlist
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                      Type
                    </label>
                    <select
                      value={itemType}
                      onChange={(e) => setItemType(e.target.value)}
                      className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-blue-800 text-gray-900 dark:text-white"
                    >
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                      <option value="document">Document</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g., Python Tutorial"
                      className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-blue-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-blue-700 dark:text-blue-300 mb-1">
                      URL
                    </label>
                    <input
                      type="text"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      placeholder="Paste URL here"
                      className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-blue-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  onClick={addItem}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={18} />
                  Add to Playlist
                </button>
              </div>

              {/* Playlist */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  📋 Playlist ({displayItems.length})
                </h3>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {displayItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        currentItem?.id === item.id
                          ? 'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900 border-red-500 dark:border-red-400'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-400'
                      }`}
                      onClick={() => playItem(item)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">
                              {item.type === 'video' ? '🎬' : item.type === 'audio' ? '🎵' : '📄'}
                            </span>
                            <div>
                              <p className="font-semibold text-gray-800 dark:text-white">{item.title}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {item.duration} • Added by {item.addedBy}
                              </p>
                            </div>
                          </div>
                        </div>
                        {currentItem?.id === item.id && (
                          <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                            {isPlaying ? '▶️ Playing' : '⏸️ Paused'}
                          </span>
                        )}
                        {playlist.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeItem(item.id);
                            }}
                            className="text-red-500 hover:text-red-700 transition-colors ml-2"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 p-4 rounded-lg text-sm text-red-800 dark:text-red-200">
                <p className="font-semibold mb-2">💡 Features:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Watch YouTube videos together</li>
                  <li>Listen to music and podcasts</li>
                  <li>Share documents and presentations</li>
                  <li>Synchronized playback for group study</li>
                  <li>Create custom playlists</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CoWatchingMode;
