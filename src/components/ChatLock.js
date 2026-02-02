import React, { useState, useEffect } from 'react';
import { X, Lock, Unlock, Trash2, MessageCircle } from 'lucide-react';

function ChatLock({ onClose, contacts }) {
  const [lockedChats, setLockedChats] = useState(() => {
    const saved = localStorage.getItem('lockedChats');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedLockedChat, setSelectedLockedChat] = useState(null);
  const [lockedMessage, setLockedMessage] = useState('');
  const [showUnlockConfirm, setShowUnlockConfirm] = useState(null);

  // Lock a chat
  const lockChat = (contact) => {
    const alreadyLocked = lockedChats.find(c => c.id === contact.id);
    if (alreadyLocked) {
      alert('This chat is already locked!');
      return;
    }

    const lockedChat = {
      id: contact.id,
      name: contact.name,
      avatar: contact.avatar,
      messages: [],
      lockedAt: new Date().toISOString(),
    };

    const updated = [...lockedChats, lockedChat];
    setLockedChats(updated);
    localStorage.setItem('lockedChats', JSON.stringify(updated));
    alert(`✅ Chat with ${contact.name} is now locked!`);
  };

  // Unlock a chat
  const unlockChat = (chatId) => {
    const updated = lockedChats.filter(c => c.id !== chatId);
    setLockedChats(updated);
    localStorage.setItem('lockedChats', JSON.stringify(updated));
    setSelectedLockedChat(null);
    setShowUnlockConfirm(null);
    alert('✅ Chat unlocked!');
  };

  // Send message in locked chat
  const sendLockedMessage = () => {
    if (!lockedMessage.trim() || !selectedLockedChat) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'You',
      text: lockedMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };

    const updated = lockedChats.map(chat =>
      chat.id === selectedLockedChat.id
        ? { ...chat, messages: [...chat.messages, newMessage] }
        : chat
    );

    setLockedChats(updated);
    localStorage.setItem('lockedChats', JSON.stringify(updated));
    setSelectedLockedChat({ ...selectedLockedChat, messages: [...selectedLockedChat.messages, newMessage] });
    setLockedMessage('');
  };

  // Delete locked chat
  const deleteLockedChat = (chatId) => {
    const updated = lockedChats.filter(c => c.id !== chatId);
    setLockedChats(updated);
    localStorage.setItem('lockedChats', JSON.stringify(updated));
    setSelectedLockedChat(null);
    alert('✅ Locked chat deleted!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col border border-slate-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-gradient-to-r from-red-600/20 to-pink-600/20">
          <div className="flex items-center gap-3">
            <Lock className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-bold text-white">🔒 Locked Chats</h2>
            <span className="bg-red-500/30 text-red-300 px-3 py-1 rounded-full text-sm font-semibold">
              {lockedChats.length} Locked
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex flex-1 gap-4 p-4 overflow-hidden">
          {/* Locked Chats List */}
          <div className="w-72 bg-slate-800/50 rounded-lg p-4 flex flex-col overflow-y-auto border border-red-500/30">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-400" />
              Private Chats
            </h3>

            {lockedChats.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-center">
                <p>No locked chats yet.<br />Lock a chat to add it here!</p>
              </div>
            ) : (
              <div className="space-y-2 flex-1">
                {lockedChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedLockedChat(chat)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      selectedLockedChat?.id === chat.id
                        ? 'bg-red-600/40 border border-red-500 text-white'
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{chat.avatar}</span>
                      <p className="font-semibold text-sm flex-1">{chat.name}</p>
                      <Lock className="w-3 h-3 text-red-400" />
                    </div>
                    <p className="text-xs opacity-70">
                      {chat.messages.length} messages
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-slate-800/50 rounded-lg border border-red-500/30 overflow-hidden">
            {selectedLockedChat ? (
              <>
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-red-600/30 to-pink-600/30 p-4 border-b border-red-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedLockedChat.avatar}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{selectedLockedChat.name}</h3>
                      <p className="text-xs text-gray-400">🔒 Private Locked Chat</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowUnlockConfirm(selectedLockedChat.id)}
                      className="p-2 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-all"
                      title="Unlock chat"
                    >
                      <Unlock className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteLockedChat(selectedLockedChat.id)}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                      title="Delete locked chat"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {selectedLockedChat.messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <p className="text-center">
                        <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        Start a private conversation here
                      </p>
                    </div>
                  ) : (
                    selectedLockedChat.messages.map((msg) => (
                      <div key={msg.id} className="bg-red-600/30 p-3 rounded-lg border border-red-500/30">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white font-semibold text-sm">{msg.sender}</p>
                          <p className="text-xs text-gray-300">{msg.timestamp}</p>
                        </div>
                        <p className="text-gray-100 text-sm">{msg.text}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="bg-slate-800 p-4 border-t border-red-500/30 flex gap-2">
                  <input
                    type="text"
                    value={lockedMessage}
                    onChange={(e) => setLockedMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendLockedMessage()}
                    placeholder="Type private message..."
                    className="flex-1 px-4 py-2 bg-slate-700 border border-red-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                  <button
                    onClick={sendLockedMessage}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all font-semibold"
                  >
                    Send
                  </button>
                </div>

                {/* Unlock Confirmation */}
                {showUnlockConfirm === selectedLockedChat.id && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                    <div className="bg-slate-900 p-6 rounded-lg border border-yellow-500/50 text-center">
                      <p className="text-white mb-4">Unlock this chat?</p>
                      <div className="flex gap-3 justify-center">
                        <button
                          onClick={() => unlockChat(selectedLockedChat.id)}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
                        >
                          Yes, Unlock
                        </button>
                        <button
                          onClick={() => setShowUnlockConfirm(null)}
                          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Select a locked chat to view</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatLock;
