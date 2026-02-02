import React, { useState, useEffect } from 'react';
import { Zap, X } from 'lucide-react';

function SmartReply({ lastMessage, onReplySelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Smart reply suggestions based on message content
  const generateSuggestions = (message) => {
    if (!message) return [];

    const text = message.toLowerCase();
    const suggestions = [];

    // Greeting detection
    if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
      suggestions.push('Hey! 👋');
      suggestions.push('Hi there! 😊');
      suggestions.push('Hello! How are you?');
    }

    // Question detection
    if (text.includes('?')) {
      suggestions.push('That sounds great! 👍');
      suggestions.push('Tell me more');
      suggestions.push('I agree! 💯');
      suggestions.push('Sounds good to me');
    }

    // Positive sentiment
    if (text.includes('good') || text.includes('great') || text.includes('awesome') || text.includes('love')) {
      suggestions.push('That\'s awesome! 🎉');
      suggestions.push('I\'m so happy for you! 😊');
      suggestions.push('That\'s wonderful! ✨');
    }

    // Negative sentiment
    if (text.includes('sad') || text.includes('bad') || text.includes('sorry') || text.includes('miss')) {
      suggestions.push('I\'m here for you 💙');
      suggestions.push('Don\'t worry, it will be okay');
      suggestions.push('I understand, hang in there');
    }

    // Time-based
    if (text.includes('morning')) {
      suggestions.push('Good morning! ☀️');
      suggestions.push('Hope you have a great day!');
    }

    if (text.includes('night') || text.includes('sleep')) {
      suggestions.push('Good night! 🌙');
      suggestions.push('Sleep well! 😴');
    }

    // Default suggestions if no specific match
    if (suggestions.length === 0) {
      suggestions.push('Thanks! 👍');
      suggestions.push('Sounds good!');
      suggestions.push('Got it! 💯');
    }

    return suggestions.slice(0, 3); // Return top 3 suggestions
  };

  useEffect(() => {
    if (lastMessage && lastMessage.text) {
      const newSuggestions = generateSuggestions(lastMessage.text);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
    }
  }, [lastMessage]);

  const handleSuggestionClick = (suggestion) => {
    onReplySelect(suggestion);
    setShowSuggestions(false);
  };

  if (!showSuggestions || suggestions.length === 0) return null;

  return (
    <div className="bg-slate-800/50 border-t border-slate-700 p-3 space-y-2">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
        <Zap className="w-3 h-3 text-yellow-400" />
        <span>Smart Replies</span>
        <button
          onClick={() => setShowSuggestions(false)}
          className="ml-auto hover:text-gray-300"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-3 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 text-sm rounded-full transition-all border border-blue-500/30"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SmartReply;
