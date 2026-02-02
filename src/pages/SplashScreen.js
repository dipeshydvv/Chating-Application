import React, { useState, useEffect } from 'react';
import { Send, MessageCircle } from 'lucide-react';

function SplashScreen() {
  const [chatMessages, setChatMessages] = useState([]);
  const [displayedChars, setDisplayedChars] = useState(0);

  const animatedMessages = [
    { text: 'Hey! 👋', sender: 'friend', delay: 0 },
    { text: 'How are you?', sender: 'friend', delay: 1000 },
    { text: 'I\'m doing great! 😊', sender: 'user', delay: 2500 },
    { text: 'Let\'s chat! 💬', sender: 'friend', delay: 4000 },
    { text: 'Sure! Let\'s connect 🚀', sender: 'user', delay: 5500 },
  ];

  // Animate chat messages
  useEffect(() => {
    const timers = animatedMessages.map((msg, idx) => {
      return setTimeout(() => {
        setChatMessages(prev => [...prev, { ...msg, id: idx, displayed: false }]);
        
        // Animate text display
        let charIdx = 0;
        const charTimer = setInterval(() => {
          if (charIdx < msg.text.length) {
            setChatMessages(prev => 
              prev.map(m => 
                m.id === idx ? { ...m, displayed: charIdx + 1 } : m
              )
            );
            charIdx++;
          } else {
            clearInterval(charTimer);
          }
        }, 30);
      }, msg.delay);
    });

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content - Animated Chat Interface */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 py-8">
        {/* Title Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-8xl font-black mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">
              Quick Connect
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-300 font-light">
            The Ultimate Chat Experience
          </p>
        </div>

        {/* Animated Chat Container */}
        <div className="w-full max-w-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 md:p-8 shadow-2xl">
          {/* Chat Messages */}
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl backdrop-blur-md border transition-all duration-300 ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-br from-blue-500/30 to-purple-500/30 border-blue-400/50 text-blue-100'
                      : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/30 text-gray-200'
                  }`}
                >
                  <p className="text-sm md:text-base font-medium">
                    {msg.text.substring(0, msg.displayed || 0)}
                    {msg.displayed && msg.displayed < msg.text.length && (
                      <span className="animate-pulse">|</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-full px-5 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-400/50 transition-colors"
              disabled
            />
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-3 rounded-full transition-all transform hover:scale-110">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-12 text-center">
          <div className="flex justify-center gap-3 mb-6">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <p className="text-gray-400 text-sm md:text-base font-light">
            Loading your amazing chat experience...
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes slideIn {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default SplashScreen;
