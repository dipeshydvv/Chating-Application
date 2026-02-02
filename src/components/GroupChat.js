import React, { useState } from 'react';
import { X, Plus, Users, Send, Trash2 } from 'lucide-react';

function GroupChat({ onClose, contacts }) {
  const [groups, setGroups] = useState(() => {
    const saved = localStorage.getItem('groups');
    return saved ? JSON.parse(saved) : [];
  });
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMessage, setGroupMessage] = useState('');

  const createGroup = () => {
    if (!groupName.trim() || selectedMembers.length === 0) {
      alert('Please enter group name and select members');
      return;
    }

    const newGroup = {
      id: Date.now().toString(),
      name: groupName,
      members: selectedMembers,
      createdAt: new Date().toISOString(),
      messages: [],
      avatar: '👥',
    };

    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));

    setGroupName('');
    setSelectedMembers([]);
    setShowCreateGroup(false);
  };

  const toggleMember = (contactId) => {
    setSelectedMembers((prev) =>
      prev.includes(contactId)
        ? prev.filter((id) => id !== contactId)
        : [...prev, contactId]
    );
  };

  const sendGroupMessage = () => {
    if (!groupMessage.trim() || !selectedGroup) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: 'You',
      text: groupMessage,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };

    const updatedGroups = groups.map((group) =>
      group.id === selectedGroup.id
        ? { ...group, messages: [...group.messages, newMessage] }
        : group
    );

    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    setSelectedGroup({ ...selectedGroup, messages: [...selectedGroup.messages, newMessage] });
    setGroupMessage('');
  };

  const deleteGroup = (groupId) => {
    const updatedGroups = groups.filter((g) => g.id !== groupId);
    setGroups(updatedGroups);
    localStorage.setItem('groups', JSON.stringify(updatedGroups));
    setSelectedGroup(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col border border-slate-700/50">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Group Chat</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-all"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex flex-1 gap-4 p-4 overflow-hidden">
          {/* Groups List */}
          <div className="w-64 bg-slate-800/50 rounded-lg p-4 flex flex-col overflow-y-auto">
            <button
              onClick={() => setShowCreateGroup(true)}
              className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              New Group
            </button>

            <div className="space-y-2 flex-1 overflow-y-auto">
              {groups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedGroup?.id === group.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700'
                  }`}
                >
                  <p className="font-semibold text-sm">{group.name}</p>
                  <p className="text-xs opacity-70">{group.members.length} members</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {showCreateGroup ? (
              <div className="bg-slate-800/50 rounded-lg p-6 flex flex-col gap-4">
                <h3 className="text-xl font-bold text-white">Create New Group</h3>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Group Name</label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="Enter group name..."
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Select Members</label>
                  <div className="bg-slate-700/50 rounded-lg p-4 max-h-48 overflow-y-auto space-y-2">
                    {contacts.map((contact) => (
                      <label key={contact.id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(contact.id)}
                          onChange={() => toggleMember(contact.id)}
                          className="w-4 h-4"
                        />
                        <span className="text-white text-sm">{contact.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={createGroup}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-all"
                  >
                    Create Group
                  </button>
                  <button
                    onClick={() => setShowCreateGroup(false)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : selectedGroup ? (
              <div className="flex flex-col h-full">
                {/* Group Header */}
                <div className="bg-slate-800/50 rounded-lg p-4 mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedGroup.name}</h3>
                    <p className="text-sm text-gray-400">{selectedGroup.members.length} members</p>
                  </div>
                  <button
                    onClick={() => deleteGroup(selectedGroup.id)}
                    className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 bg-slate-800/50 rounded-lg p-4 overflow-y-auto mb-4 space-y-3">
                  {selectedGroup.messages.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">No messages yet. Start the conversation!</p>
                  ) : (
                    selectedGroup.messages.map((msg) => (
                      <div key={msg.id} className="bg-blue-600/30 p-3 rounded-lg">
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
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={groupMessage}
                    onChange={(e) => setGroupMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendGroupMessage()}
                    placeholder="Type message..."
                    className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={sendGroupMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p>Select a group or create a new one</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupChat;
