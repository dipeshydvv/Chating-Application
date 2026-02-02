// Username Autocomplete Component
// Show username suggestions when typing @ or starting with a letter

import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

function UsernameAutocomplete({ 
  inputValue, 
  onSelect, 
  users = [],
  triggerChar = '@'
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Filter users based on input
  useEffect(() => {
    if (!inputValue) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Check if input contains trigger character
    const lastAtIndex = inputValue.lastIndexOf(triggerChar);
    if (lastAtIndex === -1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Get text after trigger character
    const textAfterTrigger = inputValue.substring(lastAtIndex + 1);
    
    // Filter users
    const filtered = users.filter(user => {
      const username = (user.username || user.name || '').toLowerCase();
      return username.includes(textAfterTrigger.toLowerCase()) && textAfterTrigger.length > 0;
    });

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedIndex(0);
  }, [inputValue, users, triggerChar]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[selectedIndex]) {
          onSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (user) => {
    onSelect(user);
    setShowSuggestions(false);
  };

  if (!showSuggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
      {suggestions.map((user, index) => (
        <button
          key={user.id || user.username}
          onClick={() => handleSuggestionClick(user)}
          onKeyDown={handleKeyDown}
          className={`w-full px-4 py-2 text-left flex items-center gap-3 transition-colors ${
            index === selectedIndex
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-600 text-gray-200'
          }`}
        >
          <User className="w-4 h-4 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">
              {user.username || user.name}
            </p>
            {user.email && (
              <p className="text-xs opacity-75 truncate">
                {user.email}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}

export default UsernameAutocomplete;
