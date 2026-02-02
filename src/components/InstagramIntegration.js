import React, { useState } from 'react';
import { X, Plus, Instagram, Phone, MessageCircle } from 'lucide-react';

function InstagramIntegration({ onClose, onAddContact }) {
  const [instagramLink, setInstagramLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Popular Instagram profiles (demo data)
  const suggestedProfiles = [
    {
      id: 1,
      username: 'satyamrai_0201',
      name: 'Satyam Rai',
      avatar: '👨‍💼',
      followers: '2.5K',
      bio: 'Tech Enthusiast | Developer',
      instagramUrl: 'https://www.instagram.com/satyamrai_0201',
    },
    {
      id: 2,
      username: 'priya_sharma_',
      name: 'Priya Sharma',
      avatar: '👩‍💻',
      followers: '5.2K',
      bio: 'Designer | Creative Mind',
      instagramUrl: 'https://www.instagram.com/priya_sharma_',
    },
    {
      id: 3,
      username: 'rahul_verma_',
      name: 'Rahul Verma',
      avatar: '👨‍🎨',
      followers: '3.8K',
      bio: 'Photographer | Traveler',
      instagramUrl: 'https://www.instagram.com/rahul_verma_',
    },
    {
      id: 4,
      username: 'anjali_patel_',
      name: 'Anjali Patel',
      avatar: '👩‍🎤',
      followers: '4.1K',
      bio: 'Singer | Music Lover',
      instagramUrl: 'https://www.instagram.com/anjali_patel_',
    },
    {
      id: 5,
      username: 'arjun_singh_',
      name: 'Arjun Singh',
      avatar: '👨‍🏫',
      followers: '3.2K',
      bio: 'Educator | Content Creator',
      instagramUrl: 'https://www.instagram.com/arjun_singh_',
    },
    {
      id: 6,
      username: 'neha_gupta_',
      name: 'Neha Gupta',
      avatar: '👩‍⚕️',
      followers: '2.8K',
      bio: 'Fitness Coach | Wellness',
      instagramUrl: 'https://www.instagram.com/neha_gupta_',
    },
    {
      id: 7,
      username: 'vikram_reddy_',
      name: 'Vikram Reddy',
      avatar: '👨‍💼',
      followers: '6.5K',
      bio: 'Entrepreneur | Startup',
      instagramUrl: 'https://www.instagram.com/vikram_reddy_',
    },
  ];

  const extractUsername = (url) => {
    try {
      const match = url.match(/instagram\.com\/([^/?]+)/);
      return match ? match[1] : null;
    } catch (err) {
      return null;
    }
  };

  const handleAddLink = () => {
    setError('');
    if (!instagramLink.trim()) {
      setError('Please enter an Instagram profile link');
      return;
    }

    const username = extractUsername(instagramLink);
    if (!username) {
      setError('Invalid Instagram link format');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newContact = {
        id: Date.now(),
        name: username,
        username: username,
        avatar: '👤',
        status: 'Online',
        lastMessage: 'Connected via Instagram',
        timestamp: 'now',
        unread: 0,
        instagramUrl: instagramLink,
        isInstagramContact: true,
        messages: [
          {
            id: 1,
            sender: username,
            text: `Hey! I'm ${username} on Instagram. Let's chat here! 👋`,
            timestamp: 'now',
            type: 'text',
          },
        ],
      };

      onAddContact(newContact);
      setInstagramLink('');
      setIsLoading(false);
      onClose();
    }, 500);
  };

  const handleAddSuggestedProfile = (profile) => {
    const newContact = {
      id: profile.id,
      name: profile.name,
      username: profile.username,
      avatar: profile.avatar,
      status: 'Online',
      lastMessage: 'Connected via Instagram',
      timestamp: 'now',
      unread: 0,
      instagramUrl: profile.instagramUrl,
      isInstagramContact: true,
      followers: profile.followers,
      bio: profile.bio,
      messages: [
        {
          id: 1,
          sender: profile.name,
          text: `Hey! I'm ${profile.name} on Instagram. Let's chat here! 👋`,
          timestamp: 'now',
          type: 'text',
        },
      ],
    };

    onAddContact(newContact);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 max-w-2xl w-full mx-4 border border-slate-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Instagram className="w-6 h-6 text-pink-500" />
            <h2 className="text-2xl font-bold text-white">Connect Instagram</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Add Custom Link */}
        <div className="mb-8 bg-slate-700/50 p-6 rounded-lg border border-slate-600">
          <h3 className="text-white font-semibold mb-4">Add Instagram Profile</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={instagramLink}
              onChange={(e) => {
                setInstagramLink(e.target.value);
                setError('');
              }}
              placeholder="Paste Instagram profile link..."
              className="w-full px-4 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleAddLink}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {isLoading ? 'Adding...' : 'Add Profile'}
            </button>
          </div>
        </div>

        {/* Suggested Profiles */}
        <div>
          <h3 className="text-white font-semibold mb-4">Suggested Profiles (Top 7)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestedProfiles.map((profile) => (
              <div
                key={profile.id}
                className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 hover:border-pink-500 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{profile.avatar}</span>
                    <div>
                      <p className="text-white font-semibold">{profile.name}</p>
                      <p className="text-gray-400 text-sm">@{profile.username}</p>
                      <p className="text-gray-500 text-xs">{profile.followers} followers</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mb-3">{profile.bio}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddSuggestedProfile(profile)}
                    className="flex-1 px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </button>
                  <button
                    onClick={() => window.open(profile.instagramUrl, '_blank')}
                    className="flex-1 px-3 py-2 bg-slate-600 hover:bg-slate-500 text-white text-sm font-semibold rounded-lg transition-all flex items-center justify-center gap-1"
                  >
                    <Instagram className="w-4 h-4" />
                    Visit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
          <p className="text-blue-200 text-sm">
            💡 <strong>Tip:</strong> Add Instagram profiles to chat with them here. Click the phone icon to call them directly on Instagram.
          </p>
        </div>
      </div>
    </div>
  );
}

export default InstagramIntegration;
