import React, { useState, useRef, useEffect } from 'react';
import { performFullCleanup, isStorageLow, safeSetItem } from '../utils/storageCleanup';
import {
  LogOut,
  MapPin,
  Mic,
  Smile,
  Send,
  Settings,
  Bell,
  Search,
  Play,
  Pause,
  Trash2,
  Copy,
  Phone,
  MoreVertical,
  X,
  Volume2,
  StopCircle,
  Gamepad2,
  Music,
  Zap,
  Instagram,
  Users,
  User,
  Lock,
  Palette,
  Image,
  MessageCircle,
  Video,
  Menu,
} from 'lucide-react';
import GameRoom from '../components/GameRoom';
import MusicPlayer from '../components/MusicPlayer';
import AIAssistant from '../components/AIAssistant';
import InstagramIntegration from '../components/InstagramIntegration';
import GroupChat from '../components/GroupChat';
import ProfilePhoto from '../components/ProfilePhoto';
import ChatLock from '../components/ChatLock';
import MessageFeatures from '../components/MessageFeatures';
import SmartReply from '../components/SmartReply';
import ChatSummary from '../components/ChatSummary';
import MediaCleanup from '../components/MediaCleanup';
import VoiceToText from '../components/VoiceToText';
import ThemeManager from '../components/ThemeManager';
import ChatWallpaper from '../components/ChatWallpaper';
import PrivacyControls from '../components/PrivacyControls';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import OfflineMode from '../components/OfflineMode';
import ChatbotAssistant from '../components/ChatbotAssistant';
import SmartSuggestions from '../components/SmartSuggestions';
import TypingBubble from '../components/TypingBubble';
import AnimatedStatusIndicator from '../components/AnimatedStatusIndicator';
import StudyMode from '../components/StudyMode';
import SharedWhiteboard from '../components/SharedWhiteboard';
import CoWatchingMode from '../components/CoWatchingMode';
import SharedTodoNotes from '../components/SharedTodoNotes';
import PrivateNotes from '../components/PrivateNotes';
import MemoryChatFeature from '../components/MemoryChatFeature';
import UserRegistrationManager from '../components/UserRegistrationManager_DatabaseSync';
import SimpleMessaging from '../components/SimpleMessaging';
import ThemeCustomizationPage from './ThemeCustomizationPage';
import GoogleMeetIntegration from '../components/GoogleMeetIntegration';
import CommunityManager from '../components/CommunityManager';

function ChatHome({ userAddress, onLogout }) {
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedEmojis, setSelectedEmojis] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showGameRoom, setShowGameRoom] = useState(false);
  const [showMusicPlayer, setShowMusicPlayer] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showInstagramIntegration, setShowInstagramIntegration] = useState(false);
  const [showGroupChat, setShowGroupChat] = useState(false);
  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const [showChatLock, setShowChatLock] = useState(false);
  const [showUserRegistration, setShowUserRegistration] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [showThemeCustomization, setShowThemeCustomization] = useState(false);
  const [showGoogleMeet, setShowGoogleMeet] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(() => {
    return localStorage.getItem(`profilePhoto_${userAddress}`) || '👤';
  });
  const [blockedUsers, setBlockedUsers] = useState(() => {
    const saved = localStorage.getItem('blockedUsers');
    return saved ? JSON.parse(saved) : [];
  });
  const [pinnedMessages, setPinnedMessages] = useState(() => {
    const saved = localStorage.getItem('pinnedMessages');
    return saved ? JSON.parse(saved) : [];
  });
  const [forwardingMessage, setForwardingMessage] = useState(null);
  const [lastReceivedMessage, setLastReceivedMessage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [lockedChats, setLockedChats] = useState(() => {
    const saved = localStorage.getItem('lockedChats');
    return saved ? JSON.parse(saved) : [];
  });

  // Listen for profile photo updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      const updated = localStorage.getItem(`profilePhoto_${userAddress}`) || '👤';
      setProfilePhoto(updated);
    };

    window.addEventListener('profilePhotoUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profilePhotoUpdated', handleProfileUpdate);
  }, [userAddress]);

  // Check for study mode notifications
  useEffect(() => {
    const checkNotifications = () => {
      const currentUser = localStorage.getItem('userAddress');
      if (!currentUser) return;

      const notificationsKey = `studyNotifications_${currentUser}`;
      const savedNotifications = JSON.parse(localStorage.getItem(notificationsKey) || '[]');
      
      // Filter unread notifications
      const unreadNotifications = savedNotifications.filter(n => !n.read);
      
      if (unreadNotifications.length > 0) {
        setNotifications(unreadNotifications);
        
        // Auto-hide notification after 5 seconds
        const timer = setTimeout(() => {
          setNotifications([]);
          // Mark as read
          const updated = savedNotifications.map(n => ({ ...n, read: true }));
          localStorage.setItem(notificationsKey, JSON.stringify(updated));
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    };

    const interval = setInterval(checkNotifications, 1000);
    return () => clearInterval(interval);
  }, []);

  // Periodic storage cleanup
  useEffect(() => {
    // Check storage every 5 minutes
    const cleanupInterval = setInterval(() => {
      if (isStorageLow()) {
        console.log('Storage running low, performing cleanup...');
        performFullCleanup();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(cleanupInterval);
  }, []);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);
  const recordingInterval = useRef(null);
  const recordingDuration = useRef(0);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const emojiList = ['😀', '😂', '😍', '🤔', '😎', '🔥', '🎉', '🚀', '💯', '👍', '❤️', '🌟', '🎊', '🎈', '💝', '🌈'];

  const [contacts, setContacts] = useState([]);

  // Format time to show HH:MM AM/PM
  const formatMessageTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

  // Message Reactions Handler
  const handleMessageReaction = (messageId, reactions) => {
    if (!selectedContact) return;
    const updatedMessages = selectedContact.messages.map(msg =>
      msg.id === messageId ? { ...msg, reactions } : msg
    );
    const updatedContact = { ...selectedContact, messages: updatedMessages };
    setSelectedContact(updatedContact);
    updateContactInList(updatedContact);
  };

  // Message Forwarding Handler
  const handleForwardMessage = (msg) => {
    setForwardingMessage(msg);
    alert('📤 Message copied for forwarding. Select a contact to forward to.');
  };

  // Pin Message Handler
  const handlePinMessage = (messageId) => {
    let newPinned = [...pinnedMessages];
    if (!newPinned.includes(messageId)) {
      newPinned.push(messageId);
    } else {
      newPinned = newPinned.filter(id => id !== messageId);
    }
    setPinnedMessages(newPinned);
    localStorage.setItem('pinnedMessages', JSON.stringify(newPinned));
  };

  // Block User Handler
  const handleBlockUser = (userId) => {
    const newBlocked = [...blockedUsers, userId];
    setBlockedUsers(newBlocked);
    localStorage.setItem('blockedUsers', JSON.stringify(newBlocked));
    
    // Remove blocked user from contacts
    setContacts(contacts.filter(c => c.id !== userId));
    setSelectedContact(null);
  };

  // Delete Message Handler
  const handleDeleteMessage = (messageId) => {
    if (!selectedContact) return;
    const updatedMessages = selectedContact.messages.filter(msg => msg.id !== messageId);
    const updatedContact = { ...selectedContact, messages: updatedMessages };
    setSelectedContact(updatedContact);
    updateContactInList(updatedContact);
  };

  // Update contact in list
  const updateContactInList = (updatedContact) => {
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
  };

  // Smart Reply Handler
  const handleSmartReply = (suggestion) => {
    setMessage(suggestion);
  };

  useEffect(() => {
    // Load registered users from localStorage (try both keys for compatibility)
    let registeredUsers = JSON.parse(localStorage.getItem('otpLoginUsers') || '[]');
    if (registeredUsers.length === 0) {
      registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    }
    
    const currentUserAddress = localStorage.getItem('userAddress');
    
    // Filter out current user and convert to contacts
    const userContacts = registeredUsers
      .filter(u => u.username !== currentUserAddress)
      .map((u, index) => {
        // Load messages for this contact from localStorage
        const messagesKey = `messages_${currentUserAddress}_${u.username}`;
        const savedMessages = JSON.parse(localStorage.getItem(messagesKey) || '[]');
        
        // Get last message
        const lastMsg = savedMessages.length > 0 ? savedMessages[savedMessages.length - 1] : null;
        
        return {
          id: u.id || index,
          name: u.username,
          username: u.username,
          avatar: u.avatar || '👤',
          status: 'Offline',
          lastMessage: lastMsg 
            ? (lastMsg.type === 'text' ? lastMsg.text : lastMsg.type === 'voice' ? '🎤 Voice message' : '📍 Location')
            : 'No messages yet',
          timestamp: lastMsg ? lastMsg.timestamp : 'now',
          unread: 0,
          messages: savedMessages,
          registrationType: u.registrationType,
        };
      });
    
    setContacts(userContacts);
  }, []);

  useEffect(() => {
    if (selectedContact === null && contacts.length > 0) {
      setSelectedContact(contacts[0]);
    }
  }, [contacts]);

  useEffect(() => {
    if (isRecording) {
      recordingDuration.current = 0;
      recordingInterval.current = setInterval(() => {
        recordingDuration.current += 1;
        setRecordingTime(recordingDuration.current);
      }, 1000);
    } else {
      clearInterval(recordingInterval.current);
    }
    return () => clearInterval(recordingInterval.current);
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });
      
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm' 
        : 'audio/mp4';
      
      mediaRecorder.current = new MediaRecorder(stream, { mimeType });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: mediaRecorder.current.mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        addMessageToChat({
          type: 'voice',
          url: audioUrl,
          duration: recordingDuration.current,
          blob: audioBlob,
        });
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      alert('Unable to access microphone. Please check permissions: ' + error.message);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert('❌ Geolocation is not supported by your browser.\n\nPlease use: Chrome, Firefox, Safari, or Edge');
      return;
    }

    // Use console log instead of alert to avoid blocking
    console.log('📍 Getting your location...');

    // Request location with shorter timeout
    navigator.geolocation.getCurrentPosition(
      (position) => {
        try {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Create location message
          const locationMessage = {
            type: 'location',
            lat: latitude,
            lng: longitude,
            accuracy: accuracy,
            timestamp: new Date().toLocaleTimeString(),
            address: `📍 Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`
          };

          // Add to chat
          addMessageToChat(locationMessage);
          
          // Show success with console log
          console.log(`✅ Location shared: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          
          // Show brief success notification
          alert(`✅ Location Shared!\n\n📍 ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n📏 Accuracy: ${accuracy.toFixed(0)}m`);
        } catch (err) {
          console.error('Error processing location:', err);
          alert('❌ Error processing location. Please try again.');
        }
      },
      (error) => {
        let errorMessage = '';
        
        if (error.code === 1) {
          // PERMISSION_DENIED
          errorMessage = '❌ Permission Denied\n\nSteps to fix:\n1. Click lock icon in address bar\n2. Select "Location" → "Allow"\n3. Refresh page\n4. Try again';
        } else if (error.code === 2) {
          // POSITION_UNAVAILABLE
          errorMessage = '❌ Location Unavailable\n\nPlease:\n1. Enable GPS/Location\n2. Check internet\n3. Move to open area\n4. Try again';
        } else if (error.code === 3) {
          // TIMEOUT
          errorMessage = '⏱️ Request Timed Out\n\nPlease:\n1. Check internet connection\n2. Enable location services\n3. Try again';
        } else {
          errorMessage = `❌ Error: ${error.message}`;
        }
        
        console.error('Geolocation error:', error);
        alert(errorMessage);
      },
      {
        enableHighAccuracy: false,  // Changed to false for faster response
        timeout: 5000,              // Reduced timeout to 5 seconds
        maximumAge: 30000           // Allow cached position up to 30 seconds old
      }
    );
  };

  const handleAddInstagramContact = (newContact) => {
    setContacts([...contacts, newContact]);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result;
        
        // Check for duplicates
        const duplicateInfo = checkForDuplicateMedia(imageData, 'image');
        if (duplicateInfo?.isDuplicate) {
          const confirmSend = window.confirm(
            `⚠️ Duplicate Image Detected!\n\n` +
            `This image was already sent ${duplicateInfo.count} time(s) in this conversation.\n` +
            `Last sent: ${duplicateInfo.lastSent}\n\n` +
            `Do you want to send it again?`
          );
          if (!confirmSend) {
            if (imageInputRef.current) imageInputRef.current.value = '';
            return;
          }
        }

        addMessageToChat({
          type: 'image',
          url: imageData,
          fileName: file.name,
          fileSize: file.size,
          isDuplicate: duplicateInfo?.isDuplicate || false,
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const videoData = event.target?.result;
        
        // Check for duplicates
        const duplicateInfo = checkForDuplicateMedia(videoData, 'video');
        if (duplicateInfo?.isDuplicate) {
          const confirmSend = window.confirm(
            `⚠️ Duplicate Video Detected!\n\n` +
            `This video was already sent ${duplicateInfo.count} time(s) in this conversation.\n` +
            `Last sent: ${duplicateInfo.lastSent}\n\n` +
            `Do you want to send it again?`
          );
          if (!confirmSend) {
            if (videoInputRef.current) videoInputRef.current.value = '';
            return;
          }
        }

        addMessageToChat({
          type: 'video',
          url: videoData,
          fileName: file.name,
          fileSize: file.size,
          isDuplicate: duplicateInfo?.isDuplicate || false,
        });
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (videoInputRef.current) {
      videoInputRef.current.value = '';
    }
  };

  // Generate hash for duplicate detection
  const generateMediaHash = (mediaData) => {
    let hash = 0;
    if (mediaData.length === 0) return hash.toString();
    // Sample the data to avoid hashing huge base64 strings
    const sample = mediaData.substring(0, 1000) + mediaData.substring(mediaData.length - 1000);
    for (let i = 0; i < sample.length; i++) {
      const char = sample.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  // Check for duplicate media in conversation
  const checkForDuplicateMedia = (mediaUrl, mediaType) => {
    if (!selectedContact) return null;

    const currentMessages = selectedContact.messages || [];
    const mediaHash = generateMediaHash(mediaUrl);

    // Find similar media in conversation
    const duplicates = currentMessages.filter(msg => {
      if (msg.type === mediaType && msg.url) {
        const msgHash = generateMediaHash(msg.url);
        return msgHash === mediaHash;
      }
      return false;
    });

    if (duplicates.length > 0) {
      return {
        isDuplicate: true,
        count: duplicates.length,
        lastSent: duplicates[duplicates.length - 1].timestamp,
        senders: [...new Set(duplicates.map(d => d.sender))]
      };
    }

    return null;
  };

  // Check localStorage quota and clean up if needed
  const checkAndCleanupStorage = () => {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
    } catch (e) {
      // Storage full, remove oldest media messages
      const keys = Object.keys(localStorage);
      const messageKeys = keys.filter(k => k.startsWith('messages_'));
      
      for (let key of messageKeys) {
        try {
          const messages = JSON.parse(localStorage.getItem(key) || '[]');
          // Remove oldest media messages (keep text messages)
          const filtered = messages.filter((msg, idx) => {
            if (msg.type === 'image' || msg.type === 'video') {
              return idx > messages.length - 5; // Keep only last 5 media messages
            }
            return true;
          });
          if (filtered.length < messages.length) {
            localStorage.setItem(key, JSON.stringify(filtered));
            return; // Stop after cleanup
          }
        } catch (err) {
          console.error('Cleanup error:', err);
        }
      }
    }
  };

  // Compress image to reduce size
  const compressImage = (base64String, maxWidth = 800, maxHeight = 600) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7)); // 70% quality
      };
      img.src = base64String;
    });
  };

  const addMessageToChat = async (content) => {
    if (!selectedContact) return;

    const currentTime = formatMessageTime();
    const currentUserAddress = localStorage.getItem('userAddress');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const senderName = currentUser.username || currentUserAddress || 'You';

    // Compress images before saving
    let processedContent = content;
    if (content.type === 'image' && content.url) {
      try {
        processedContent.url = await compressImage(content.url);
      } catch (err) {
        console.error('Image compression error:', err);
      }
    }

    const newMessage = {
      id: selectedContact.messages.length + 1,
      sender: senderName,
      senderUsername: senderName,
      ...processedContent,
      timestamp: currentTime,
    };

    // Update state
    const updatedContacts = contacts.map((contact) =>
      contact.id === selectedContact.id
        ? {
            ...contact,
            messages: [...contact.messages, newMessage],
            lastMessage:
              processedContent.type === 'text'
                ? processedContent.text
                : processedContent.type === 'voice'
                ? '🎤 Voice message'
                : processedContent.type === 'image'
                ? '🖼️ Image'
                : processedContent.type === 'video'
                ? '🎥 Video'
                : '📍 Location',
            timestamp: currentTime,
          }
        : contact
    );

    setContacts(updatedContacts);

    const updatedSelectedContact = {
      ...selectedContact,
      messages: [...selectedContact.messages, newMessage],
    };

    setSelectedContact(updatedSelectedContact);

    // Check storage before saving
    checkAndCleanupStorage();

    try {
      // Save messages to localStorage with proper key format
      const messagesKey = `messages_${currentUserAddress}_${selectedContact.username}`;
      safeSetItem(messagesKey, JSON.stringify(updatedSelectedContact.messages));
      
      // Also save with reverse key for receiver to see messages
      const reverseMessagesKey = `messages_${selectedContact.username}_${currentUserAddress}`;
      const existingReverse = JSON.parse(localStorage.getItem(reverseMessagesKey) || '[]');
      
      // Add message with receiver info
      const receivedMessage = {
        ...newMessage,
        sender: senderName,
        isReceived: true,
      };
      
      safeSetItem(reverseMessagesKey, JSON.stringify([...existingReverse, receivedMessage]));
    } catch (e) {
      console.error('Storage error:', e);
      alert('⚠️ Storage is full. Cleaning up old data...');
      performFullCleanup();
      
      // Try one more time after cleanup
      try {
        const messagesKey = `messages_${currentUserAddress}_${selectedContact.username}`;
        safeSetItem(messagesKey, JSON.stringify(updatedSelectedContact.messages));
      } catch (e2) {
        console.error('Failed to save message after cleanup:', e2);
      }
    }

    setMessage('');
    setSelectedEmojis([]);
  };

  const handleSendMessage = () => {
    if (message.trim() || selectedEmojis.length > 0) {
      addMessageToChat({
        type: 'text',
        text: `${message}${selectedEmojis.length > 0 ? ' ' + selectedEmojis.join('') : ''}`,
      });
      setSelectedEmojis([]);
    }
  };

  const toggleEmoji = (emoji) => {
    setSelectedEmojis((prev) => {
      if (prev.includes(emoji)) {
        return prev.filter((e) => e !== emoji);
      } else {
        return [...prev, emoji];
      }
    });
  };

  const handleSendVoiceMessage = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredContacts = contacts.filter((contact) => {
    const currentUserAddress = localStorage.getItem('userAddress');
    // Exclude current user from contacts list
    if (contact.username === currentUserAddress || contact.name === currentUserAddress) {
      return false;
    }
    return contact.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pulse"
            >
              <div className="flex-1">
                <p className="font-semibold text-sm">📚 Study Mode Notification</p>
                <p className="text-xs mt-1">{notif.message}</p>
              </div>
              <button
                onClick={() => setNotifications([])}
                className="text-white hover:bg-white/20 p-1 rounded"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Clean Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-xl border-b border-slate-700">
        <div className="w-full px-4 py-3 flex items-center justify-between">
          {/* Left - Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <span className="text-xl font-bold text-white">💬</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Quick Connect</h1>
          </div>

          {/* Right - User Controls Only */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowProfilePhoto(true)}
              className="p-1 hover:bg-slate-700 rounded-lg transition-all duration-300"
              title="Edit Profile Photo"
            >
              {profilePhoto && profilePhoto.startsWith('data:') ? (
                <img src={profilePhoto} alt="profile" className="w-6 h-6 rounded-full object-cover border border-blue-400" />
              ) : (
                <span className="text-2xl inline-block">{profilePhoto}</span>
              )}
            </button>
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-300">
              <Bell className="w-5 h-5 text-gray-300 hover:text-white" />
            </button>
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-300" title="More Features">
              <Menu className="w-5 h-5 text-gray-300 hover:text-white" />
            </button>
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-300">
              <Settings className="w-5 h-5 text-gray-300 hover:text-white" />
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 flex items-center gap-1 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Chat Area - Simplified */}
      <div className="flex-1 flex overflow-hidden">
        {/* Contacts Sidebar */}
        <div className="w-80 bg-slate-800/30 backdrop-blur-sm border-r border-slate-700/50 flex flex-col">
          {/* Current User Profile */}
          <div className="p-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
                {profilePhoto}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {localStorage.getItem('userAddress') || 'User'}
                </p>
                <p className="text-xs text-gray-400">Logged In</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts..."
                className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
            </div>
          </div>

          {/* Locked Chats Section */}
          {lockedChats.length > 0 && (
            <div className="border-t border-slate-700/50 pt-3">
              <div className="px-4 py-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-400" />
                <h3 className="text-xs font-semibold text-gray-400 uppercase">
                  🔒 Locked ({lockedChats.length})
                </h3>
              </div>
              <div className="space-y-1">
                {lockedChats.map((chat) => (
                  <button
                    key={`locked-${chat.id}`}
                    onClick={() => setShowChatLock(true)}
                    className="w-full px-4 py-2 flex items-center gap-3 transition-all duration-300 border-l-4 border-l-red-500 bg-red-500/10 hover:bg-red-500/20"
                  >
                    <div className="relative">
                      <div className="text-xl">{chat.avatar}</div>
                      <Lock className="absolute bottom-0 right-0 w-3 h-3 text-red-400 bg-slate-800 rounded-full p-0.5" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-white text-sm flex items-center gap-1">
                        {chat.name}
                        <Lock className="w-3 h-3 text-red-400" />
                      </h3>
                      <p className="text-gray-400 text-xs">{chat.messages.length} messages</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {filteredContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-300 border-l-4 ${
                  selectedContact?.id === contact.id
                    ? 'bg-slate-700/50 border-l-blue-500'
                    : 'border-l-transparent hover:bg-slate-700/30'
                }`}
              >
                <div className="relative">
                  <div className="text-2xl">{contact.avatar}</div>
                  <div
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-slate-800 ${
                      contact.status === 'Online' ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                  ></div>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-white text-sm">{contact.name}</h3>
                  <p className="text-gray-400 text-xs truncate">{contact.lastMessage}</p>
                </div>
                {contact.unread > 0 && (
                  <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {contact.unread}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-slate-900/50">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedContact.avatar}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white">{selectedContact.name}</h2>
                      {selectedContact.isInstagramContact && (
                        <span className="text-pink-400 text-xs font-semibold flex items-center gap-1">
                          <Instagram className="w-3 h-3" /> Instagram
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {selectedContact.isInstagramContact ? (
                        <span>@{selectedContact.username} • {selectedContact.followers} followers</span>
                      ) : selectedContact.status === 'Online' ? (
                        <span className="text-green-400">● Online</span>
                      ) : (
                        <span>Offline</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedContact.isInstagramContact && (
                    <button
                      onClick={() => {
                        if (selectedContact.instagramUrl) {
                          window.open(selectedContact.instagramUrl, '_blank');
                        }
                      }}
                      className="px-3 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
                      title="Call on Instagram"
                    >
                      <Phone className="w-4 h-4" />
                      Call on Instagram
                    </button>
                  )}
                  {!selectedContact.isInstagramContact && (
                    <button
                      onClick={() => setShowGoogleMeet(true)}
                      className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-300"
                      title="Start Google Meet"
                    >
                      <Video className="w-5 h-5 text-gray-400 hover:text-blue-400" />
                    </button>
                  )}
                  <button
                    onClick={() => setShowGameRoom(true)}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-300"
                    title="Play games"
                  >
                    <Gamepad2 className="w-5 h-5 text-gray-400 hover:text-green-400" />
                  </button>
                  <button
                    onClick={() => {
                      const contact = selectedContact;
                      const lockedChats = JSON.parse(localStorage.getItem('lockedChats') || '[]');
                      const isLocked = lockedChats.find(c => c.id === contact.id);
                      
                      if (isLocked) {
                        alert('✅ This chat is already locked!');
                      } else {
                        const lockedChat = {
                          id: contact.id,
                          name: contact.name,
                          avatar: contact.avatar,
                          messages: [],
                          lockedAt: new Date().toISOString(),
                        };
                        lockedChats.push(lockedChat);
                        localStorage.setItem('lockedChats', JSON.stringify(lockedChats));
                        alert(`✅ Chat with ${contact.name} is now locked!`);
                      }
                    }}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-300"
                    title="Lock this chat"
                  >
                    <Lock className="w-5 h-5 text-gray-400 hover:text-red-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-all duration-300">
                    <MoreVertical className="w-5 h-5 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>

              {/* Pinned Messages Section */}
              {pinnedMessages.length > 0 && (
                <div className="bg-yellow-500/10 border-l-4 border-yellow-500 p-3 mb-4">
                  <p className="text-xs text-yellow-400 font-semibold">📌 {pinnedMessages.length} Pinned Message{pinnedMessages.length > 1 ? 's' : ''}</p>
                </div>
              )}

              {/* Messages Container - Scrollable */}
              <div className="flex-1 overflow-y-auto flex flex-col" data-chat-area>
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                  {selectedContact.messages.map((msg) => {
                    const currentUserAddress = localStorage.getItem('userAddress');
                    const isOwnMessage = msg.sender === 'You' || msg.sender === currentUserAddress || msg.senderUsername === currentUserAddress;
                    
                    return (
                    <div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        isOwnMessage
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                          : 'bg-slate-700/50 text-gray-200'
                      } ${pinnedMessages.includes(msg.id) ? 'ring-2 ring-yellow-400' : ''}`}
                    >
                      {msg.type === 'text' && (
                        <>
                          <p className="text-sm">{msg.text}</p>
                          <div className="flex items-center justify-between gap-2 mt-1">
                            <p className="text-xs opacity-70">{msg.timestamp}</p>
                            {isOwnMessage && (
                              <AnimatedStatusIndicator status={msg.status || 'delivered'} />
                            )}
                          </div>
                        </>
                      )}
                      {msg.type === 'voice' && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <audio
                              controls
                              className="h-8 w-full max-w-xs"
                              src={msg.url}
                              controlsList="nodownload"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs opacity-70">🎤 Voice message - {formatTime(msg.duration)}</span>
                          </div>
                          <p className="text-xs opacity-70">{msg.timestamp}</p>
                        </div>
                      )}
                      {msg.type === 'location' && (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-blue-400" />
                            <div>
                              <p className="text-sm font-semibold">📍 Location Shared</p>
                              <p className="text-xs opacity-70">Lat: {msg.lat?.toFixed(4)}, Lng: {msg.lng?.toFixed(4)}</p>
                            </div>
                          </div>
                          <a
                            href={`https://maps.google.com/?q=${msg.lat},${msg.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-blue-500/30 hover:bg-blue-500/50 px-3 py-2 rounded-lg text-blue-300 hover:text-blue-200 transition-all inline-block"
                          >
                            🗺️ View on Google Maps
                          </a>
                          <p className="text-xs opacity-70">{msg.timestamp}</p>
                        </div>
                      )}
                      {msg.type === 'image' && (
                        <div className="flex flex-col gap-2">
                          <div className="relative">
                            <img
                              src={msg.url}
                              alt="Shared image"
                              className="w-full max-w-xs rounded-lg object-cover max-h-96"
                            />
                            {msg.isDuplicate && (
                              <div className="absolute top-2 right-2 bg-yellow-500/90 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                                ⚠️ Duplicate
                              </div>
                            )}
                          </div>
                          <p className="text-xs opacity-70">🖼️ {msg.fileName}</p>
                          <p className="text-xs opacity-70">{msg.timestamp}</p>
                        </div>
                      )}
                      {msg.type === 'video' && (
                        <div className="flex flex-col gap-2">
                          <div className="relative">
                            <video
                              controls
                              className="w-full max-w-xs rounded-lg object-cover max-h-96"
                              src={msg.url}
                              controlsList="nodownload"
                            />
                            {msg.isDuplicate && (
                              <div className="absolute top-2 right-2 bg-yellow-500/90 text-white px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                                ⚠️ Duplicate
                              </div>
                            )}
                          </div>
                          <p className="text-xs opacity-70">🎥 {msg.fileName}</p>
                          <p className="text-xs opacity-70">{msg.timestamp}</p>
                        </div>
                      )}
                      {msg.type === 'media' && (
                        <div className="flex flex-col gap-2">
                          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-3">
                            <p className="text-sm font-semibold text-white mb-2">{msg.title}</p>
                            {msg.mediaType === 'audio' && (
                              <audio
                                controls
                                className="w-full max-w-xs h-8"
                                src={msg.url}
                                controlsList="nodownload"
                                crossOrigin="anonymous"
                              />
                            )}
                            {msg.mediaType === 'video' && (
                              <video
                                controls
                                className="w-full max-w-xs rounded-lg"
                                src={msg.url}
                                controlsList="nodownload"
                                crossOrigin="anonymous"
                                style={{ maxHeight: '300px' }}
                              />
                            )}
                            {msg.mediaType === 'media' && (
                              <div className="text-sm text-gray-300">
                                <a
                                  href={msg.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 underline break-all"
                                >
                                  📎 {msg.title}
                                </a>
                              </div>
                            )}
                          </div>
                          <p className="text-xs opacity-70">{msg.timestamp}</p>
                        </div>
                      )}
                      {/* Message Features (Reactions, Status, etc.) */}
                      <MessageFeatures
                        message={msg}
                        onReaction={handleMessageReaction}
                        onForward={handleForwardMessage}
                        onPin={handlePinMessage}
                        onBlock={handleBlockUser}
                        onDelete={() => handleDeleteMessage(msg.id)}
                        currentUserId={userAddress}
                        isOwn={isOwnMessage}
                      />
                    </div>
                  </div>
                  );
                })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <TypingBubble />
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Section - Smart Reply, Summary, and Input */}
              <div className="flex-shrink-0 flex flex-col bg-slate-800/50 backdrop-blur-xl border-t border-slate-700/50">
                {/* Smart Reply Suggestions */}
                {selectedContact.messages.length > 0 && (
                  <div className="px-4 pt-3">
                    <SmartReply
                      lastMessage={selectedContact.messages[selectedContact.messages.length - 1]}
                      onReplySelect={handleSmartReply}
                    />
                  </div>
                )}

                {/* Chat Summary */}
                <div className="px-4">
                  <ChatSummary
                    messages={selectedContact.messages}
                    contactName={selectedContact.name}
                  />
                </div>

                {/* Input Area */}
                <div className="p-4 space-y-3">
                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="bg-slate-700/50 rounded-lg p-3 grid grid-cols-8 gap-2">
                    {emojiList.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => toggleEmoji(emoji)}
                        className={`text-2xl hover:scale-125 transition-transform ${
                          selectedEmojis.includes(emoji)
                            ? 'scale-125 bg-blue-500/30 rounded-lg p-1'
                            : ''
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Recording Indicator */}
                {isRecording && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-400 text-sm font-semibold">
                        Recording... {formatTime(recordingTime)}
                      </span>
                    </div>
                    <button
                      onClick={handleStopRecording}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-all duration-300"
                    >
                      Stop & Send
                    </button>
                  </div>
                )}

                {/* Smart Suggestions */}
                <SmartSuggestions 
                  lastMessage={lastReceivedMessage}
                  onSendMessage={(suggestion) => {
                    setMessage(suggestion);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                />

                {/* Input Controls */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                  />

                  {selectedEmojis.length > 0 && (
                    <div className="flex items-center gap-1 px-2 bg-slate-700/30 rounded-lg py-1">
                      {selectedEmojis.map((emoji, idx) => (
                        <div key={idx} className="text-xl relative group">
                          {emoji}
                          <button
                            onClick={() => toggleEmoji(emoji)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-300 text-gray-400 hover:text-yellow-400"
                    title="Add emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleShareLocation}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-300 text-gray-400 hover:text-blue-400"
                    title="Share location"
                  >
                    <MapPin className="w-5 h-5" />
                  </button>

                  <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      isRecording
                        ? 'bg-red-500/30 text-red-400 hover:bg-red-500/40'
                        : 'text-gray-400 hover:bg-slate-700 hover:text-purple-400'
                    }`}
                    title={isRecording ? 'Stop recording' : 'Record voice message'}
                  >
                    {isRecording ? (
                      <StopCircle className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-300 text-gray-400 hover:text-pink-400"
                    title="Send image"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  <button
                    onClick={() => videoInputRef.current?.click()}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-300 text-gray-400 hover:text-cyan-400"
                    title="Send video"
                  >
                    <Video className="w-5 h-5" />
                  </button>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />

                  <button
                    onClick={handleSendMessage}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-all duration-300 text-gray-400 hover:text-green-400"
                    title="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome to Chatty!</h2>
                <p className="text-gray-400">Select a conversation from the sidebar to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game Room Modal */}
      {showGameRoom && selectedContact && (
        <GameRoom
          onClose={() => setShowGameRoom(false)}
          opponentName={selectedContact.name}
        />
      )}

      {/* Music Player Modal */}
      {showMusicPlayer && (
        <MusicPlayer onClose={() => setShowMusicPlayer(false)} />
      )}

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistant onClose={() => setShowAIAssistant(false)} />
      )}

      {/* Instagram Integration Modal */}
      {showInstagramIntegration && (
        <InstagramIntegration
          onClose={() => setShowInstagramIntegration(false)}
          onAddContact={handleAddInstagramContact}
        />
      )}

      {/* Group Chat Modal */}
      {showGroupChat && (
        <GroupChat
          onClose={() => setShowGroupChat(false)}
          contacts={contacts}
        />
      )}

      {/* Profile Photo Modal */}
      {showProfilePhoto && (
        <ProfilePhoto
          onClose={() => {
            setShowProfilePhoto(false);
            setProfilePhoto(localStorage.getItem(`profilePhoto_${userAddress}`) || '👤');
          }}
          userAddress={userAddress}
        />
      )}

      {/* Chat Lock Modal */}
      {showChatLock && (
        <ChatLock
          onClose={() => setShowChatLock(false)}
          contacts={contacts}
        />
      )}

      {/* User Registration Modal */}
      {showUserRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-500 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">User Registration System</h2>
              <button
                onClick={() => setShowUserRegistration(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <UserRegistrationManager />
            </div>
          </div>
        </div>
      )}

      {/* Messaging Modal */}
      {showMessaging && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Messages</h2>
              <button
                onClick={() => setShowMessaging(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <SimpleMessaging />
            </div>
          </div>
        </div>
      )}

      {/* Theme & Customization Page */}
      {showThemeCustomization && (
        <ThemeCustomizationPage
          onBack={() => setShowThemeCustomization(false)}
        />
      )}

      {/* Google Meet Integration */}
      {showGoogleMeet && selectedContact && (
        <GoogleMeetIntegration
          selectedContact={selectedContact}
          onClose={() => setShowGoogleMeet(false)}
        />
      )}
    </div>
  );
}

export default ChatHome;
