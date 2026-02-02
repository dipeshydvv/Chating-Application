import React, { useState, useEffect } from 'react';
import { Lightbulb, Send, X } from 'lucide-react';

function SmartSuggestions({ lastMessage, onSendMessage }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (lastMessage) {
      generateSuggestions(lastMessage);
      setShowSuggestions(true);
    }
  }, [lastMessage]);

  const generateSuggestions = (message) => {
    const text = message.toLowerCase();
    let newSuggestions = [];

    // Greeting suggestions
    if (text.includes('hello') || text.includes('hi') || text.includes('hey')) {
      newSuggestions = [
        'Hey! How are you?',
        'Hi! What\'s up?',
        'Hello! Good to hear from you',
        'Hey there! 👋'
      ];
    }
    // Question suggestions
    else if (text.includes('?')) {
      newSuggestions = [
        'That sounds great!',
        'I agree with you',
        'Let me think about it',
        'Can we talk later?',
        'Absolutely! 👍'
      ];
    }
    // Plan/Meeting suggestions
    else if (text.includes('meet') || text.includes('coffee') || text.includes('lunch') || text.includes('dinner')) {
      newSuggestions = [
        'Sounds good! When?',
        'I\'m in! 🎉',
        'What time works for you?',
        'Let me check my schedule',
        'Perfect! See you then 😊'
      ];
    }
    // Gratitude suggestions
    else if (text.includes('thank') || text.includes('thanks') || text.includes('appreciate')) {
      newSuggestions = [
        'You\'re welcome! 😊',
        'Anytime! Happy to help',
        'No problem at all',
        'My pleasure!',
        'Always here for you ❤️'
      ];
    }
    // Apology suggestions
    else if (text.includes('sorry') || text.includes('apologize')) {
      newSuggestions = [
        'No worries! It\'s okay',
        'Don\'t worry about it',
        'All good! 👍',
        'No problem at all',
        'Let\'s move forward 💪'
      ];
    }
    // Busy/Unavailable suggestions
    else if (text.includes('busy') || text.includes('later') || text.includes('soon')) {
      newSuggestions = [
        'No problem! Take your time',
        'Talk soon! 👋',
        'Whenever you\'re free',
        'I\'ll wait for you',
        'Catch you later! 😊'
      ];
    }
    // Default suggestions
    else {
      newSuggestions = [
        'That\'s awesome! 🎉',
        'I totally agree',
        'Tell me more',
        'Sounds good to me',
        'Let me know! 😊'
      ];
    }

    setSuggestions(newSuggestions.slice(0, 3)); // Show only 3 suggestions
  };

  const handleSuggestionClick = (suggestion) => {
    onSendMessage(suggestion);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  if (!showSuggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="px-6 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 border-t border-blue-200 dark:border-blue-700">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={18} className="text-blue-600 dark:text-blue-400" />
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
          Smart Suggestions
        </p>
        <button
          onClick={() => setShowSuggestions(false)}
          className="ml-auto text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            onClick={() => handleSuggestionClick(suggestion)}
            className="text-left px-4 py-2 bg-white dark:bg-gray-800 border border-blue-300 dark:border-blue-600 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-all duration-200 text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2 group"
          >
            <span className="text-lg">💬</span>
            <span className="flex-1">{suggestion}</span>
            <Send size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 dark:text-blue-400" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default SmartSuggestions;
