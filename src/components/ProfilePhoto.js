import React, { useState, useEffect } from 'react';
import { X, Upload, Camera } from 'lucide-react';

function ProfilePhoto({ onClose, userAddress }) {
  // Clean up old large images from localStorage
  const cleanupStorage = () => {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('profilePhoto_')) {
          const value = localStorage.getItem(key);
          // Remove if it's a large base64 image (starts with data: and is very long)
          if (value && value.startsWith('data:') && value.length > 100000) {
            localStorage.removeItem(key);
          }
        }
      }
    } catch (err) {
      console.log('Cleanup error:', err);
    }
  };

  // Clean up on mount
  useEffect(() => {
    cleanupStorage();
  }, []);

  const [profilePhoto, setProfilePhoto] = useState(() => {
    const saved = localStorage.getItem(`profilePhoto_${userAddress}`);
    return saved || '👤';
  });
  const [selectedEmoji, setSelectedEmoji] = useState(profilePhoto);

  const emojiOptions = [
    '👤', '👨', '👩', '🧑', '👨‍🦱', '👩‍🦱', '👨‍🦲', '👩‍🦲',
    '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
    '🥰', '😍', '😘', '😗', '😚', '😙', '🥲', '😋',
    '😛', '😜', '🤪', '😝', '😑', '😐', '😶', '🤐',
    '🤨', '🤔', '🤭', '🤫', '🤬', '🤥', '😌', '😔',
    '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮',
    '🤮', '🤧', '🤬', '🤡', '👹', '👺', '👻', '👽',
  ];

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10485760) { // 10MB in bytes
        alert('Image too large! Please use an image smaller than 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result;
        
        // Compress the image using canvas
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Set max dimensions (larger for better quality)
          let width = img.width;
          let height = img.height;
          const maxSize = 400; // Increased from 200 to 400
          
          if (width > height) {
            if (width > maxSize) {
              height = Math.round((height * maxSize) / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = Math.round((width * maxSize) / height);
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress to JPEG with better quality
          let quality = 0.8;
          let compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          
          // If still too large, reduce quality
          while (compressedBase64.length > 2000000 && quality > 0.3) {
            quality -= 0.1;
            compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          }
          
          try {
            localStorage.setItem(`profilePhoto_${userAddress}`, compressedBase64);
            setProfilePhoto(compressedBase64);
            alert('✅ Profile photo updated successfully!');
          } catch (err) {
            alert('❌ Storage limit exceeded. Please use a smaller image or emoji.');
          }
        };
        img.src = base64;
      };
      reader.readAsDataURL(file);
    }
  };

  const selectEmoji = (emoji) => {
    setSelectedEmoji(emoji);
    setProfilePhoto(emoji);
    localStorage.setItem(`profilePhoto_${userAddress}`, emoji);
    alert('✅ Emoji avatar updated!');
  };

  const saveProfile = () => {
    localStorage.setItem(`profilePhoto_${userAddress}`, selectedEmoji);
    setProfilePhoto(selectedEmoji);
    // Trigger a storage event to update the parent component
    window.dispatchEvent(new Event('profilePhotoUpdated'));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-md border border-slate-700/50 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <h2 className="text-2xl font-bold text-white">Profile Photo</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Photo Preview */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-2 rounded-full">
              {selectedEmoji && selectedEmoji.startsWith('data:') ? (
                <img src={selectedEmoji} alt="profile" className="w-32 h-32 rounded-full object-cover" />
              ) : (
                <div className="text-8xl w-32 h-32 flex items-center justify-center">
                  {selectedEmoji}
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm">Your Profile Photo</p>
          </div>

          {/* Upload Photo */}
          <div className="space-y-3">
            <label className="block">
              <div className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg cursor-pointer transition-all">
                <Upload className="w-5 h-5" />
                <span>Upload Photo</span>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Emoji Selector */}
          <div>
            <p className="text-white font-semibold mb-3">Or Choose Emoji Avatar</p>
            <div className="bg-slate-800/50 rounded-lg p-4 grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => selectEmoji(emoji)}
                  className={`text-3xl p-2 rounded-lg transition-all ${
                    selectedEmoji === emoji
                      ? 'bg-blue-600 scale-125'
                      : 'hover:bg-slate-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveProfile}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Save Profile Photo
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePhoto;
