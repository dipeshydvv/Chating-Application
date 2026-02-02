import React from 'react';

function AnimatedStatusIndicator({ status = 'sending' }) {
  return (
    <>
      <style>{`
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }

        @keyframes ripple {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7),
                        0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0),
                        0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          100% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0),
                        0 0 0 12px rgba(59, 130, 246, 0);
          }
        }

        @keyframes flash {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes spin-check {
          0% {
            transform: rotate(0deg) scale(0.8);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: rotate(360deg) scale(1);
            opacity: 1;
          }
        }

        @keyframes double-check {
          0% {
            transform: translateX(-4px);
          }
          50% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(4px);
          }
        }

        @keyframes checkmark-draw {
          0% {
            stroke-dashoffset: 20;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }

        .status-pulse {
          animation: pulse-ring 1.5s infinite;
        }

        .status-ripple {
          animation: ripple 1.5s infinite;
        }

        .status-flash {
          animation: flash 1s infinite;
        }

        .status-spin {
          animation: spin-check 1.2s ease-in-out infinite;
        }

        .status-double {
          animation: double-check 0.8s ease-in-out infinite;
        }

        .checkmark {
          stroke-dasharray: 20;
          animation: checkmark-draw 0.6s ease-in-out forwards;
        }
      `}</style>

      {status === 'sending' && (
        <div className="flex items-center gap-1">
          <div className="status-pulse w-3 h-3 bg-blue-400 rounded-full" title="Sending..." />
          <span className="text-xs text-blue-400">Sending</span>
        </div>
      )}

      {status === 'sent' && (
        <div className="flex items-center gap-1">
          <svg
            className="status-spin w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            title="Sent"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs text-gray-400">Sent</span>
        </div>
      )}

      {status === 'delivered' && (
        <div className="flex items-center gap-1">
          <div className="relative w-4 h-4">
            <svg
              className="status-double absolute w-4 h-4 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              title="Delivered"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <svg
              className="status-double absolute w-4 h-4 text-cyan-400 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-xs text-cyan-400">Delivered</span>
        </div>
      )}

      {status === 'read' && (
        <div className="flex items-center gap-1">
          <div className="status-ripple w-4 h-4 bg-green-400 rounded-full" title="Read" />
          <span className="text-xs text-green-400">Read</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-1">
          <div className="status-flash w-3 h-3 bg-red-400 rounded-full" title="Failed" />
          <span className="text-xs text-red-400">Failed</span>
        </div>
      )}
    </>
  );
}

export default AnimatedStatusIndicator;
