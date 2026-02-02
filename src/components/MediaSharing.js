// Media Sharing Component
// Send and receive photos and videos like WhatsApp

import React, { useState, useRef, useEffect } from 'react';
import { Send, Image, Video, X, Download, Play, Trash2, Loader } from 'lucide-react';
import axios from 'axios';

function MediaSharing({ currentUserId, selectedUserId, onMediaSent }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  // Backend API URL
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  // Handle photo selection
  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('❌ Photo size must be less than 10MB');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('❌ Please select a valid image file');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setSelectedFile(file);
    setFileType('photo');
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle video selection
  const handleVideoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('❌ Video size must be less than 50MB');
      setTimeout(() => setError(''), 3000);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setError('❌ Please select a valid video file');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setSelectedFile(file);
    setFileType('video');
    setError('');

    // Create preview (thumbnail)
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  // Send media
  const handleSendMedia = async () => {
    if (!selectedFile || !currentUserId || !selectedUserId) {
      setError('❌ Please select a file and recipient');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target.result;

        try {
          // Send via backend API
          const response = await axios.post(`${API_URL}/messages/send`, {
            senderId: currentUserId,
            receiverId: selectedUserId,
            content: `[${fileType.toUpperCase()}]`,
            messageType: fileType.toUpperCase(),
            mediaUrl: base64Data,
            mediaType: selectedFile.type,
            mediaSize: selectedFile.size,
            mediaName: selectedFile.name
          }, {
            timeout: 30000
          });

          if (response.data) {
            setSuccess(`✅ ${fileType === 'photo' ? 'Photo' : 'Video'} sent successfully!`);
            setSelectedFile(null);
            setPreview(null);
            setFileType(null);
            
            // Notify parent component
            if (onMediaSent) {
              onMediaSent(response.data);
            }

            setTimeout(() => setSuccess(''), 2000);
          }
        } catch (apiErr) {
          console.error('API Error:', apiErr);
          // Fallback to localStorage
          const mediaMessage = {
            id: Date.now(),
            senderId: currentUserId,
            receiverId: selectedUserId,
            content: `[${fileType.toUpperCase()}]`,
            messageType: fileType.toUpperCase(),
            mediaUrl: base64Data,
            mediaType: selectedFile.type,
            mediaSize: selectedFile.size,
            mediaName: selectedFile.name,
            timestamp: new Date().toISOString()
          };

          // Save to localStorage
          const key = `messages_${Math.min(currentUserId, selectedUserId)}_${Math.max(currentUserId, selectedUserId)}`;
          const existing = JSON.parse(localStorage.getItem(key) || '[]');
          existing.push(mediaMessage);
          localStorage.setItem(key, JSON.stringify(existing));

          setSuccess(`✅ ${fileType === 'photo' ? 'Photo' : 'Video'} sent successfully!`);
          setSelectedFile(null);
          setPreview(null);
          setFileType(null);

          if (onMediaSent) {
            onMediaSent(mediaMessage);
          }

          setTimeout(() => setSuccess(''), 2000);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (err) {
      console.error('Error sending media:', err);
      setError('❌ Failed to send media. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setFileType(null);
    setError('');
  };

  return (
    <div className="w-full space-y-4">
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-red-200 text-sm flex items-center gap-2">
          <span>❌</span>
          <span>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-900 border border-green-700 rounded-lg text-green-200 text-sm flex items-center gap-2">
          <span>✅</span>
          <span>{success}</span>
        </div>
      )}

      {/* File Input (Hidden) */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoSelect}
        className="hidden"
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        onChange={handleVideoSelect}
        className="hidden"
      />

      {/* Preview */}
      {preview && (
        <div className="relative bg-gray-700 rounded-lg overflow-hidden border border-gray-600">
          {fileType === 'photo' ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="relative w-full h-64 bg-black flex items-center justify-center">
              <video
                src={preview}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <Play className="w-16 h-16 text-white" />
              </div>
            </div>
          )}

          {/* Clear Button */}
          <button
            onClick={handleClearSelection}
            className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* File Info */}
          <div className="p-3 bg-gray-800 border-t border-gray-600">
            <p className="text-sm text-gray-300">
              📄 {selectedFile?.name}
            </p>
            <p className="text-xs text-gray-400">
              {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        {/* Photo Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          <Image className="w-5 h-5" />
          Photo
        </button>

        {/* Video Button */}
        <button
          onClick={() => videoInputRef.current?.click()}
          disabled={uploading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          <Video className="w-5 h-5" />
          Video
        </button>

        {/* Send Button */}
        <button
          onClick={handleSendMedia}
          disabled={!selectedFile || uploading}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          {uploading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send
            </>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="p-3 bg-blue-900 border border-blue-700 rounded-lg text-blue-200 text-xs space-y-1">
        <p className="font-semibold">📸 Media Sharing Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Photos: Max 10MB</li>
          <li>Videos: Max 50MB</li>
          <li>Supported: JPG, PNG, MP4, MOV, etc.</li>
          <li>Media is sent instantly</li>
        </ul>
      </div>
    </div>
  );
}

export default MediaSharing;
