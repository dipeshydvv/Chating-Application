import React, { useState } from 'react';
import { MessageCircle, Send, X, HelpCircle, Loader, Copy, Check } from 'lucide-react';

function ChatbotAssistant() {
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! 👋 I\'m your AI Assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const faqs = [
    {
      id: 1,
      question: 'How do I change my profile picture?',
      answer: 'Click on your profile icon in the top right, then select "Edit Profile Photo" to upload a new picture.'
    },
    {
      id: 2,
      question: 'How do I block a user?',
      answer: 'Open a chat with the user, click the three dots menu, and select "Block User". They won\'t be able to message you.'
    },
    {
      id: 3,
      question: 'Can I delete messages?',
      answer: 'Yes! Long press on a message (or right-click on desktop) and select "Delete". The message will be removed from both sides.'
    },
    {
      id: 4,
      question: 'How do I enable dark mode?',
      answer: 'Click the palette icon (🎨) in the header, select "Dark Mode" theme, and click Done.'
    },
    {
      id: 5,
      question: 'What is offline mode?',
      answer: 'Offline mode lets you compose messages when you\'re not connected. They\'ll automatically send when you go online.'
    },
    {
      id: 6,
      question: 'How do I use voice to text?',
      answer: 'Click the microphone icon (🎤), select your language, click "Start Recording", speak your message, and click "Stop".'
    },
    {
      id: 7,
      question: 'Can I customize the chat wallpaper?',
      answer: 'Yes! Click the image icon (🖼️) to choose from 12 presets or upload your own custom wallpaper.'
    },
    {
      id: 8,
      question: 'How do I clean up duplicate media?',
      answer: 'Click the trash icon (🗑️), click "Scan for Duplicates", select the copies you want to delete, and click "Delete".'
    }
  ];

  const quickReplies = [
    'How do I use this app?',
    'What features are available?',
    'How do I report a problem?',
    'How do I contact support?',
    'What\'s new in this version?'
  ];

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse = generateBotResponse(text);
      const botMessage = {
        id: messages.length + 2,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const generateBotResponse = (userText) => {
    const text = userText.toLowerCase();

    if (text.includes('help') || text.includes('how')) {
      return '📚 I can help you with:\n• Using app features\n• Troubleshooting issues\n• Understanding settings\n• Answering FAQs\n\nWhat would you like to know?';
    } else if (text.includes('feature') || text.includes('what can')) {
      return '✨ Quick Connect includes:\n• Real-time messaging\n• Voice messages\n• Location sharing\n• Games (Tic Tac Toe, Snake, Memory Match, Quiz, Dice Race)\n• Music player\n• AI Assistant\n• Instagram integration\n• Group chat\n• Chat lock\n• Media cleanup\n• Voice to text\n• Theme customization\n• Chat wallpaper\n• Offline mode\n• Analytics dashboard\n• Privacy controls\n\nWould you like details on any feature?';
    } else if (text.includes('problem') || text.includes('issue') || text.includes('bug')) {
      return '🔧 Common issues:\n1. Messages not sending → Check your internet connection\n2. Microphone not working → Check browser permissions\n3. Theme not applying → Refresh the page\n4. Wallpaper not showing → Ensure opacity is not 0%\n\nIf your issue persists, please contact support@quickconnect.com';
    } else if (text.includes('contact') || text.includes('support')) {
      return '📧 Contact Support:\n• Email: support@quickconnect.com\n• Chat: Available 24/7\n• Phone: +1-800-QUICK-CHAT\n\nWe\'re here to help!';
    } else if (text.includes('new') || text.includes('version')) {
      return '🎉 Latest Updates:\n✨ Smart Media Cleanup\n🎤 Voice to Text (20+ languages)\n🎨 Theme Manager\n🖼️ Chat Wallpaper\n📊 Analytics Dashboard\n🔒 Privacy Controls\n📡 Offline Mode\n🤖 AI Assistant (You\'re chatting with me!)\n\nEnjoy the new features!';
    } else {
      return '👋 Thanks for your question! I\'m here to help with:\n• Feature explanations\n• How-to guides\n• Troubleshooting\n• General questions\n\nFeel free to ask anything!';
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: 'Hello! 👋 I\'m your AI Assistant. How can I help you today?',
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="AI Assistant"
      >
        <MessageCircle size={20} className="text-gray-600 dark:text-gray-400" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-500 to-purple-500 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <MessageCircle size={24} />
                  AI Assistant
                </h2>
                <p className="text-indigo-100 text-sm mt-1">Your personal helpdesk & support bot</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-800">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                          : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                      {msg.sender === 'bot' && (
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="mt-2 text-xs flex items-center gap-1 hover:opacity-70 transition-opacity"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check size={14} />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy size={14} />
                              Copy
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600">
                      <Loader size={20} className="animate-spin" />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Replies or FAQ */}
              {messages.length <= 1 && !showFAQ && (
                <div className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick questions:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickReplies.map((reply, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(reply)}
                        className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 px-3 py-2 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors text-left"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage(inputValue);
                      }
                    }}
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => handleSendMessage(inputValue)}
                    disabled={isLoading}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    <Send size={18} />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFAQ(!showFAQ)}
                    className="flex-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <HelpCircle size={16} />
                    {showFAQ ? 'Hide' : 'Show'} FAQ
                  </button>
                  <button
                    onClick={clearChat}
                    className="flex-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  >
                    Clear Chat
                  </button>
                </div>
              </div>

              {/* FAQ Panel */}
              {showFAQ && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 max-h-64 overflow-y-auto">
                  <div className="p-4 space-y-3">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm">Frequently Asked Questions</h3>
                    {faqs.map(faq => (
                      <div key={faq.id} className="bg-white dark:bg-gray-700 p-3 rounded border border-gray-200 dark:border-gray-600">
                        <p className="text-sm font-semibold text-gray-800 dark:text-white mb-1">
                          {faq.id}. {faq.question}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatbotAssistant;
