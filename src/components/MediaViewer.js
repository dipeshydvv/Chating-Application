// Media Viewer Component
// Display photos and videos in chat

import React, { useState } from 'react';
import { X, Download, Play, Pause } from 'lucide-react';

function MediaViewer({ media, onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoRef, setVideoRef] = useState(null);

  if (!media) return null;

  const isPhoto = media.messageType === 'PHOTO' || media.messageType === 'photo';
  const isVideo = media.messageType === 'VIDEO' || media.messageType === 'video';
  const mediaUrl = media.mediaUrl || media.content;

  // Download media
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = mediaUrl;
    link.download = media.mediaName || `media_${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle video play/pause
  const togglePlayPause = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[10000] p-4">
      <div className="relative max-w-4xl w-full max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-red-600 hover:bg-red-700 rounded-full text-white z-10 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Photo */}
        {isPhoto && (
          <div className="flex flex-col items-center justify-center">
            <img
              src={mediaUrl}
              alt="Shared photo"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
            </div>
          </div>
        )}

        {/* Video */}
        {isVideo && (
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-full max-h-[80vh] bg-black rounded-lg overflow-hidden">
              <video
                ref={setVideoRef}
                src={mediaUrl}
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Play/Pause Overlay */}
              <button
                onClick={togglePlayPause}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-50 transition-all"
              >
                {isPlaying ? (
                  <Pause className="w-16 h-16 text-white" />
                ) : (
                  <Play className="w-16 h-16 text-white" />
                )}
              </button>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue="0"
                  onChange={(e) => {
                    if (videoRef) {
                      videoRef.currentTime = (e.target.value / 100) * videoRef.duration;
                    }
                  }}
                  className="w-full"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={togglePlayPause}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Play
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
            </div>
          </div>
        )}

        {/* Media Info */}
        <div className="mt-4 text-center text-gray-300 text-sm">
          <p>📄 {media.mediaName || 'Media'}</p>
          {media.mediaSize && (
            <p className="text-xs text-gray-400">
              {(media.mediaSize / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaViewer;
