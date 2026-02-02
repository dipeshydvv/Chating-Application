import React, { useState, useEffect } from 'react';
import { Moon, Sun, Palette, X, Check } from 'lucide-react';

function ThemeManager() {
  const [showModal, setShowModal] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  const [customColor, setCustomColor] = useState(() => {
    return localStorage.getItem('customColor') || '#3B82F6';
  });
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('accentColor') || '#EC4899';
  });

  const themes = [
    {
      id: 'light',
      name: 'Light Mode',
      icon: '☀️',
      bg: 'bg-white',
      text: 'text-gray-900',
      description: 'Clean and bright interface'
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      icon: '🌙',
      bg: 'bg-gray-900',
      text: 'text-white',
      description: 'Easy on the eyes'
    },
    {
      id: 'midnight',
      name: 'Midnight',
      icon: '⭐',
      bg: 'bg-gray-950',
      text: 'text-gray-100',
      description: 'Deep dark theme'
    },
    {
      id: 'ocean',
      name: 'Ocean',
      icon: '🌊',
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      description: 'Cool blue tones'
    },
    {
      id: 'forest',
      name: 'Forest',
      icon: '🌲',
      bg: 'bg-green-50',
      text: 'text-green-900',
      description: 'Natural green theme'
    },
    {
      id: 'sunset',
      name: 'Sunset',
      icon: '🌅',
      bg: 'bg-orange-50',
      text: 'text-orange-900',
      description: 'Warm orange tones'
    }
  ];

  const presetColors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Green', value: '#10B981' },
    { name: 'Cyan', value: '#06B6D4' },
    { name: 'Indigo', value: '#6366F1' },
  ];

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light-theme', 'dark-theme', 'midnight-theme', 'ocean-theme', 'forest-theme', 'sunset-theme');
    
    // Apply new theme
    if (currentTheme === 'dark') {
      root.classList.add('dark');
    } else if (currentTheme === 'midnight') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#030712';
    } else if (currentTheme === 'ocean') {
      document.body.style.backgroundColor = '#F0F9FF';
    } else if (currentTheme === 'forest') {
      document.body.style.backgroundColor = '#F0FDF4';
    } else if (currentTheme === 'sunset') {
      document.body.style.backgroundColor = '#FFF7ED';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#FFFFFF';
    }

    localStorage.setItem('theme', currentTheme);
  }, [currentTheme]);

  // Apply custom colors
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', customColor);
    root.style.setProperty('--accent-color', accentColor);
    
    localStorage.setItem('customColor', customColor);
    localStorage.setItem('accentColor', accentColor);
  }, [customColor, accentColor]);

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
  };

  const handleColorChange = (color) => {
    setCustomColor(color);
  };

  const handleAccentChange = (color) => {
    setAccentColor(color);
  };

  const resetToDefault = () => {
    setCurrentTheme('light');
    setCustomColor('#3B82F6');
    setAccentColor('#EC4899');
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Theme Settings"
      >
        <Palette size={20} className="text-gray-600 dark:text-gray-400" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full my-8">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Palette size={24} />
                  Theme & Customization
                </h2>
                <p className="text-purple-100 text-sm mt-1">Personalize your chat experience</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Theme Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Moon size={20} />
                  Choose Theme
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {themes.map(theme => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        currentTheme === theme.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <div className="text-3xl mb-2">{theme.icon}</div>
                      <p className="font-semibold text-gray-800 dark:text-white text-sm">{theme.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{theme.description}</p>
                      {currentTheme === theme.id && (
                        <div className="mt-2 flex justify-center">
                          <Check size={18} className="text-blue-500" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Color Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Palette size={20} />
                  Primary Color
                </h3>
                <div className="flex gap-3 mb-4 flex-wrap">
                  {presetColors.map(color => (
                    <button
                      key={color.value}
                      onClick={() => handleColorChange(color.value)}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        customColor === color.value
                          ? 'border-gray-800 dark:border-white scale-110'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {customColor === color.value && (
                        <Check size={20} className="text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-16 h-10 rounded-lg cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Custom Color</span>
                  <span className="text-sm font-mono text-gray-800 dark:text-gray-200">{customColor}</span>
                </div>
              </div>

              {/* Accent Color Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Palette size={20} />
                  Accent Color
                </h3>
                <div className="flex gap-3 mb-4 flex-wrap">
                  {presetColors.map(color => (
                    <button
                      key={color.value}
                      onClick={() => handleAccentChange(color.value)}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        accentColor === color.value
                          ? 'border-gray-800 dark:border-white scale-110'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {accentColor === color.value && (
                        <Check size={20} className="text-white mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => handleAccentChange(e.target.value)}
                    className="w-16 h-10 rounded-lg cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Custom Color</span>
                  <span className="text-sm font-mono text-gray-800 dark:text-gray-200">{accentColor}</span>
                </div>
              </div>

              {/* Preview */}
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Preview</p>
                <div className="flex gap-3">
                  <button
                    className="px-4 py-2 rounded-lg text-white transition-all"
                    style={{ backgroundColor: customColor }}
                  >
                    Primary Button
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg text-white transition-all"
                    style={{ backgroundColor: accentColor }}
                  >
                    Accent Button
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={resetToDefault}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Reset to Default
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg hover:shadow-lg transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ThemeManager;
