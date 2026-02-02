import React from 'react';

function TypingBubble() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-slate-700/50 rounded-lg w-fit">
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          40% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px);
          }
          75% {
            transform: translateX(2px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
          }
        }

        @keyframes wave {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .dot-bounce {
          animation: bounce 1.4s infinite;
        }

        .dot-bounce:nth-child(2) {
          animation-delay: 0.2s;
        }

        .dot-bounce:nth-child(3) {
          animation-delay: 0.4s;
        }

        .bubble-shake {
          animation: shake 0.3s infinite;
        }

        .dot-pulse {
          animation: pulse-glow 1.5s infinite;
        }

        .dot-wave {
          animation: wave 0.6s ease-in-out infinite;
        }

        .dot-wave:nth-child(2) {
          animation-delay: 0.1s;
        }

        .dot-wave:nth-child(3) {
          animation-delay: 0.2s;
        }
      `}</style>

      {/* Bounce Animation */}
      <div className="flex items-center gap-1">
        <div className="dot-bounce w-2 h-2 bg-blue-400 rounded-full" />
        <div className="dot-bounce w-2 h-2 bg-blue-400 rounded-full" />
        <div className="dot-bounce w-2 h-2 bg-blue-400 rounded-full" />
      </div>

      {/* Wave Animation */}
      <div className="flex items-center gap-1 ml-2">
        <div className="dot-wave w-2 h-2 bg-cyan-400 rounded-full" />
        <div className="dot-wave w-2 h-2 bg-cyan-400 rounded-full" />
        <div className="dot-wave w-2 h-2 bg-cyan-400 rounded-full" />
      </div>

      {/* Pulse Animation */}
      <div className="ml-2">
        <div className="dot-pulse w-2 h-2 bg-green-400 rounded-full" />
      </div>
    </div>
  );
}

export default TypingBubble;
