import React, { useState, useEffect } from 'react';
import { X, Search, Play, Pause, SkipBack, SkipForward, Volume2, Heart, Loader } from 'lucide-react';

function MusicPlayer({ onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [spotifyToken, setSpotifyToken] = useState(null);
  const audioRef = React.useRef(null);

  // Spotify API Credentials
  const SPOTIFY_CLIENT_ID = 'bb33ed97dfad46a7a45ee4e81bc6e497';
  const SPOTIFY_CLIENT_SECRET = 'a6165a29a9c645d084c2f8ca4946ad11';

  // Extended mock songs database with working audio URLs
  const mockSongs = [
    // Hindi Songs - Using demo audio files
    { id: 1, title: 'Tum Hi Ho', artist: 'Arijit Singh', duration: 242, url: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', category: 'Hindi' },
    { id: 2, title: 'Tera Ban Jaunga', artist: 'Akhil Sachdeva', duration: 224, url: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', category: 'Hindi' },
    { id: 3, title: 'Raataan Lambiyan', artist: 'Jubin Nautiyal', duration: 236, url: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', category: 'Hindi' },
    { id: 4, title: 'Baarish Ban Jaana', artist: 'Payal Dev', duration: 218, url: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', category: 'Hindi' },
    { id: 5, title: 'Dil Diyan Gallan', artist: 'Atif Aslam', duration: 256, url: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', category: 'Hindi' },
    
    // Haryanvi Songs
    { id: 6, title: 'Haryanvi Meri Jaan', artist: 'Sapna Choudhary', duration: 240, url: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', category: 'Haryanvi' },
    { id: 7, title: 'Teri Yaad Mein', artist: 'Ruchika Jangid', duration: 228, url: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', category: 'Haryanvi' },
    { id: 8, title: 'Chaleya Jaunga', artist: 'Karan Randhawa', duration: 245, url: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', category: 'Haryanvi' },
    { id: 9, title: 'Haryana Meri Shaan', artist: 'Gulzaar Chhaniwala', duration: 232, url: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', category: 'Haryanvi' },
    { id: 10, title: 'Jaat Ka Swag', artist: 'Ravi Teja', duration: 238, url: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', category: 'Haryanvi' },
    
    // Punjabi Songs
    { id: 11, title: 'Mundian To Bach Ke', artist: 'Panjabi MC', duration: 244, url: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', category: 'Punjabi' },
    { id: 12, title: 'Tunak Tunak Tun', artist: 'Daler Mehndi', duration: 220, url: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', category: 'Punjabi' },
    
    // English Songs
    { id: 13, title: 'Blinding Lights', artist: 'The Weeknd', duration: 200, url: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', category: 'English' },
    { id: 14, title: 'Shape of You', artist: 'Ed Sheeran', duration: 234, url: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', category: 'English' },
    { id: 15, title: 'Levitating', artist: 'Dua Lipa', duration: 203, url: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', category: 'English' },
    { id: 16, title: 'Anti-Hero', artist: 'Taylor Swift', duration: 210, url: 'https://www.sample-videos.com/audio/mp3/crowd-cheering.mp3', category: 'English' },
  ];

  // Get Spotify Access Token
  const getSpotifyToken = async () => {
    try {
      const auth = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
      });

      if (!response.ok) {
        console.log('Spotify token error, using mock songs');
        return null;
      }

      const data = await response.json();
      setSpotifyToken(data.access_token);
      return data.access_token;
    } catch (error) {
      console.log('Spotify API error:', error);
      return null;
    }
  };

  // Search Spotify
  const searchSpotify = async (query, token) => {
    try {
      setIsLoading(true);
      setLoadingMessage('🎵 Searching Spotify...');

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=50`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();

      if (data.tracks?.items && data.tracks.items.length > 0) {
        const spotifySongs = data.tracks.items
          .filter(track => track.preview_url) // Only include tracks with preview URLs
          .slice(0, 20)
          .map((track, index) => ({
            id: `spotify_${track.id}`,
            title: track.name,
            artist: track.artists?.[0]?.name || 'Unknown',
            duration: Math.floor(track.duration_ms / 1000),
            url: track.preview_url, // Spotify preview URLs work directly
            category: 'Spotify',
            image: track.album?.images?.[0]?.url,
          }));

        if (spotifySongs.length > 0) {
          setSongs(spotifySongs);
          setIsLoading(false);
          setLoadingMessage('');
        } else {
          setLoadingMessage('⚠️ No previews available for these songs');
          setSongs(mockSongs);
          setIsLoading(false);
        }
      } else {
        setLoadingMessage('No songs found, showing local songs');
        setSongs(mockSongs);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Spotify search error:', error);
      setLoadingMessage('⚠️ Spotify error, using local songs');
      setSongs(mockSongs);
      setIsLoading(false);
    }
  };

  // Load initial songs on component mount
  useEffect(() => {
    setSongs(mockSongs);
    getSpotifyToken();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() && spotifyToken) {
      searchSpotify(query, spotifyToken);
    } else if (query.trim()) {
      filterSongs(query, selectedCategory);
    } else {
      setSongs(mockSongs);
    }
  };

  const filterSongs = (query, category) => {
    let filtered = mockSongs;

    if (category !== 'All') {
      filtered = filtered.filter((song) => song.category === category);
    }

    if (query.trim() !== '') {
      filtered = filtered.filter(
        (song) =>
          song.title.toLowerCase().includes(query.toLowerCase()) ||
          song.artist.toLowerCase().includes(query.toLowerCase())
      );
    }

    setSongs(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    filterSongs(searchQuery, category);
  };

  const toggleFavorite = (songId) => {
    setFavorites((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  const playSong = (song) => {
    setCurrentSong(song);
    setIsLoading(true);
    setLoadingMessage('🎵 Loading song...');
    setCurrentTime(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;

    if (isPlaying) {
      // Set source and play
      audio.src = currentSong.url;
      audio.volume = 0.5;
      
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        audio.play()
          .then(() => {
            setIsLoading(false);
            setLoadingMessage('');
          })
          .catch((error) => {
            console.error('Playback error:', error);
            setLoadingMessage('⚠️ Cannot play this song');
            setIsPlaying(false);
          });
      }, 100);
    } else {
      audio.pause();
    }
  }, [isPlaying, currentSong]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onCanPlay={() => {
          setIsLoading(false);
          setLoadingMessage('');
        }}
        onEnded={() => setIsPlaying(false)}
        onError={(e) => {
          console.error('Audio error:', e);
          setLoadingMessage('⚠️ Cannot play this song');
          setIsPlaying(false);
        }}
        crossOrigin="anonymous"
        preload="metadata"
      />

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 max-w-2xl w-full mx-4 border border-slate-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎵</span>
            <h2 className="text-2xl font-bold text-white">Music Player</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Now Playing */}
        {currentSong && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 mb-6">
            <p className="text-gray-200 text-sm mb-2">Now Playing</p>
            <h3 className="text-2xl font-bold text-white mb-1">{currentSong.title}</h3>
            <p className="text-gray-100 mb-4">{currentSong.artist}</p>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="mb-4 p-3 bg-white/20 rounded-lg flex items-center gap-2">
                <Loader className="w-4 h-4 text-white animate-spin" />
                <span className="text-white text-sm">{loadingMessage}</span>
              </div>
            )}

            {/* Player Controls */}
            <div className="space-y-4">
              {/* Progress Bar */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max={currentSong.duration}
                  value={currentTime}
                  onChange={(e) => {
                    if (audioRef.current) {
                      audioRef.current.currentTime = Number(e.target.value);
                    }
                    setCurrentTime(Number(e.target.value));
                  }}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-200">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(currentSong.duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-center gap-4">
                <button className="p-2 hover:bg-white/20 rounded-lg transition-all">
                  <SkipBack className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 bg-white hover:bg-gray-100 rounded-full transition-all disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-slate-800" />
                  ) : (
                    <Play className="w-6 h-6 text-slate-800" />
                  )}
                </button>
                <button className="p-2 hover:bg-white/20 rounded-lg transition-all">
                  <SkipForward className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Spotify Status */}
        <div className="mb-4 p-3 bg-gradient-to-r from-green-600/30 to-emerald-600/30 rounded-lg flex items-center justify-between border border-green-500/50">
          <div>
            <p className="text-white font-semibold text-sm">🎵 Spotify Music</p>
            <p className="text-green-300 text-xs font-semibold">
              {spotifyToken ? '✅ Connected' : '⚠️ Using Local Songs'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-green-300 text-xs">{songs.length} Songs Available</p>
          </div>
        </div>

        {/* Setup Instructions */}
        {!spotifyToken && (
          <div className="mb-4 p-3 bg-blue-600/20 border border-blue-500/50 rounded-lg">
            <p className="text-blue-300 text-xs">
              💡 <strong>To enable Spotify:</strong> Add your Client ID & Secret in the code (line 19-20)
            </p>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {['All', 'Hindi', 'Haryanvi', 'Punjabi', 'English'].map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search songs or artists..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Playlist */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">
            {selectedCategory !== 'All' && `${selectedCategory} - `}
            {searchQuery ? `Search Results (${songs.length})` : `Songs (${songs.length})`}
          </h3>
          {songs.length > 0 ? (
            songs.map((song) => (
              <div
                key={song.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer ${
                  currentSong?.id === song.id
                    ? 'bg-blue-500/30 border border-blue-500'
                    : 'bg-slate-700/30 hover:bg-slate-700/50'
                }`}
                onClick={() => playSong(song)}
              >
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{song.title}</p>
                  <p className="text-gray-400 text-xs">{song.artist} • {song.category}</p>
                </div>
                <span className="text-gray-400 text-xs">{formatTime(song.duration)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(song.id);
                  }}
                  className="p-2 hover:bg-slate-600 rounded-lg transition-all"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favorites.includes(song.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No songs found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
