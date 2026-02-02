import React, { useState, useEffect } from 'react';
import { Plus, X, Users, MessageCircle, Settings, Trash2, Edit2, Check, Search } from 'lucide-react';

function CommunityManager({ userAddress }) {
  const [showModal, setShowModal] = useState(false);
  const [communities, setCommunities] = useState(() => {
    const saved = localStorage.getItem('communities');
    return saved ? JSON.parse(saved) : [];
  });
  const [communityName, setCommunityName] = useState('');
  const [communityDescription, setCommunityDescription] = useState('');
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [memberToAdd, setMemberToAdd] = useState('');
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCommunityChat, setShowCommunityChat] = useState(false);
  const [communityMessage, setCommunityMessage] = useState('');
  const [communityMessages, setCommunityMessages] = useState([]);

  // Load community messages
  useEffect(() => {
    if (selectedCommunity) {
      const messagesKey = `communityMessages_${selectedCommunity.id}`;
      const saved = localStorage.getItem(messagesKey);
      setCommunityMessages(saved ? JSON.parse(saved) : []);
    }
  }, [selectedCommunity]);

  // Save communities to localStorage
  useEffect(() => {
    localStorage.setItem('communities', JSON.stringify(communities));
  }, [communities]);

  const createCommunity = () => {
    if (!communityName.trim()) {
      alert('Please enter a community name');
      return;
    }

    const newCommunity = {
      id: Date.now(),
      name: communityName,
      description: communityDescription,
      creator: userAddress,
      members: [userAddress],
      createdAt: new Date().toLocaleString(),
      icon: '👥',
      memberCount: 1,
    };

    setCommunities([...communities, newCommunity]);
    setCommunityName('');
    setCommunityDescription('');
    alert('✅ Community created successfully!');
  };

  const addMemberToCommunity = () => {
    if (!memberToAdd.trim()) {
      alert('Please enter a member name/username');
      return;
    }

    if (!selectedCommunity) {
      alert('Please select a community first');
      return;
    }

    const updatedCommunities = communities.map((comm) => {
      if (comm.id === selectedCommunity.id) {
        if (comm.members.includes(memberToAdd)) {
          alert('This member is already in the community');
          return comm;
        }
        const updatedComm = {
          ...comm,
          members: [...comm.members, memberToAdd],
          memberCount: comm.members.length + 1,
        };
        setSelectedCommunity(updatedComm);
        return updatedComm;
      }
      return comm;
    });

    setCommunities(updatedCommunities);
    setMemberToAdd('');
    alert(`✅ ${memberToAdd} added to community!`);
  };

  const removeMemberFromCommunity = (member) => {
    if (member === selectedCommunity.creator) {
      alert('Cannot remove community creator');
      return;
    }

    const updatedCommunities = communities.map((comm) => {
      if (comm.id === selectedCommunity.id) {
        const updatedComm = {
          ...comm,
          members: comm.members.filter((m) => m !== member),
          memberCount: comm.members.length - 1,
        };
        setSelectedCommunity(updatedComm);
        return updatedComm;
      }
      return comm;
    });

    setCommunities(updatedCommunities);
    alert(`✅ ${member} removed from community`);
  };

  const deleteCommunity = (communityId) => {
    if (window.confirm('Are you sure you want to delete this community?')) {
      setCommunities(communities.filter((c) => c.id !== communityId));
      setSelectedCommunity(null);
      alert('✅ Community deleted');
    }
  };

  const sendCommunityMessage = () => {
    if (!communityMessage.trim() || !selectedCommunity) return;

    const newMessage = {
      id: communityMessages.length + 1,
      sender: userAddress,
      text: communityMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: '👤',
    };

    const updatedMessages = [...communityMessages, newMessage];
    setCommunityMessages(updatedMessages);

    // Save to localStorage
    const messagesKey = `communityMessages_${selectedCommunity.id}`;
    localStorage.setItem(messagesKey, JSON.stringify(updatedMessages));

    setCommunityMessage('');
  };

  const filteredCommunities = communities.filter((comm) =>
    comm.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Community Button */}
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
        title="Communities"
      >
        <Users size={20} className="text-gray-600 dark:text-gray-400" />
      </button>

      {/* Main Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Users size={24} />
                  Communities
                </h2>
                <p className="text-blue-100 text-sm mt-1">Create and manage communities</p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedCommunity(null);
                  setShowCommunityChat(false);
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Left Panel - Communities List */}
              <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-gray-50 dark:bg-gray-800">
                {/* Search */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search communities..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Create Community Button */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setEditingCommunity('new')}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    New Community
                  </button>
                </div>

                {/* Communities List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredCommunities.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      <p>No communities yet</p>
                      <p className="text-sm mt-2">Create one to get started!</p>
                    </div>
                  ) : (
                    filteredCommunities.map((community) => (
                      <button
                        key={community.id}
                        onClick={() => {
                          setSelectedCommunity(community);
                          setShowCommunityChat(false);
                        }}
                        className={`w-full p-4 border-b border-gray-200 dark:border-gray-700 text-left transition-all ${
                          selectedCommunity?.id === community.id
                            ? 'bg-blue-100 dark:bg-blue-900/30 border-l-4 border-l-blue-500'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{community.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {community.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {community.memberCount} members
                            </p>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Right Panel - Community Details or Chat */}
              <div className="flex-1 flex flex-col">
                {editingCommunity === 'new' ? (
                  // Create Community Form
                  <div className="p-6 space-y-4 overflow-y-auto">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create New Community</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Community Name *
                      </label>
                      <input
                        type="text"
                        value={communityName}
                        onChange={(e) => setCommunityName(e.target.value)}
                        placeholder="e.g., Tech Enthusiasts"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={communityDescription}
                        onChange={(e) => setCommunityDescription(e.target.value)}
                        placeholder="What is this community about?"
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          createCommunity();
                          setEditingCommunity(null);
                        }}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <Check size={18} />
                        Create Community
                      </button>
                      <button
                        onClick={() => setEditingCommunity(null)}
                        className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white py-2 rounded-lg font-semibold hover:bg-gray-400 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : selectedCommunity && !showCommunityChat ? (
                  // Community Details
                  <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Community Header */}
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl">{selectedCommunity.icon}</span>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {selectedCommunity.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">
                            Created by {selectedCommunity.creator}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300">
                        {selectedCommunity.description || 'No description'}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Members</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {selectedCommunity.memberCount}
                        </p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                        <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {selectedCommunity.createdAt}
                        </p>
                      </div>
                    </div>

                    {/* Members Section */}
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Members</h4>
                        {selectedCommunity.creator === userAddress && (
                          <button
                            onClick={() => setShowAddMembers(!showAddMembers)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center gap-1"
                          >
                            <Plus size={16} />
                            Add Member
                          </button>
                        )}
                      </div>

                      {/* Add Member Form */}
                      {showAddMembers && selectedCommunity.creator === userAddress && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4 space-y-3">
                          <input
                            type="text"
                            value={memberToAdd}
                            onChange={(e) => setMemberToAdd(e.target.value)}
                            placeholder="Enter username/email..."
                            className="w-full px-4 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={addMemberToCommunity}
                              className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                            >
                              Add
                            </button>
                            <button
                              onClick={() => setShowAddMembers(false)}
                              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Members List */}
                      <div className="space-y-2">
                        {selectedCommunity.members.map((member) => (
                          <div
                            key={member}
                            className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">👤</span>
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{member}</p>
                                {member === selectedCommunity.creator && (
                                  <p className="text-xs text-gray-600 dark:text-gray-400">Creator</p>
                                )}
                              </div>
                            </div>
                            {selectedCommunity.creator === userAddress && member !== selectedCommunity.creator && (
                              <button
                                onClick={() => removeMemberFromCommunity(member)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                              >
                                <X size={18} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowCommunityChat(true)}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={18} />
                        Open Chat
                      </button>
                      {selectedCommunity.creator === userAddress && (
                        <button
                          onClick={() => deleteCommunity(selectedCommunity.id)}
                          className="bg-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                          <Trash2 size={18} />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ) : selectedCommunity && showCommunityChat ? (
                  // Community Chat
                  <div className="flex flex-col h-full">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{selectedCommunity.name}</h3>
                        <p className="text-sm text-blue-100">{selectedCommunity.memberCount} members</p>
                      </div>
                      <button
                        onClick={() => setShowCommunityChat(false)}
                        className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
                      {communityMessages.length === 0 ? (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                          <p>No messages yet</p>
                          <p className="text-sm">Start the conversation!</p>
                        </div>
                      ) : (
                        communityMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === userAddress ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs px-4 py-2 rounded-lg ${
                                msg.sender === userAddress
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white'
                              }`}
                            >
                              {msg.sender !== userAddress && (
                                <p className="text-xs font-semibold mb-1 opacity-75">{msg.sender}</p>
                              )}
                              <p className="break-words">{msg.text}</p>
                              <p className="text-xs mt-1 opacity-70">{msg.timestamp}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={communityMessage}
                          onChange={(e) => setCommunityMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendCommunityMessage()}
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={sendCommunityMessage}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Empty State
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      <Users size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-semibold">Select a community</p>
                      <p className="text-sm">or create a new one to get started</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CommunityManager;
