import React, { useState, useRef } from 'react';
import { Mic, Copy, Volume2, X, Loader, Check, Globe } from 'lucide-react';

function VoiceToText() {
  const [showModal, setShowModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confidence, setConfidence] = useState(0);
  const recognitionRef = useRef(null);

  const languages = [
    { code: 'en-US', name: '🇺🇸 English (US)' },
    { code: 'en-GB', name: '🇬🇧 English (UK)' },
    { code: 'hi-IN', name: '🇮🇳 Hindi' },
    { code: 'pa-IN', name: '🇮🇳 Punjabi' },
    { code: 'gu-IN', name: '🇮🇳 Gujarati' },
    { code: 'ta-IN', name: '🇮🇳 Tamil' },
    { code: 'te-IN', name: '🇮🇳 Telugu' },
    { code: 'kn-IN', name: '🇮🇳 Kannada' },
    { code: 'ml-IN', name: '🇮🇳 Malayalam' },
    { code: 'mr-IN', name: '🇮🇳 Marathi' },
    { code: 'es-ES', name: '🇪🇸 Spanish' },
    { code: 'fr-FR', name: '🇫🇷 French' },
    { code: 'de-DE', name: '🇩🇪 German' },
    { code: 'it-IT', name: '🇮🇹 Italian' },
    { code: 'pt-BR', name: '🇧🇷 Portuguese' },
    { code: 'ja-JP', name: '🇯🇵 Japanese' },
    { code: 'zh-CN', name: '🇨🇳 Chinese (Simplified)' },
    { code: 'ko-KR', name: '🇰🇷 Korean' },
    { code: 'ru-RU', name: '🇷🇺 Russian' },
    { code: 'ar-SA', name: '🇸🇦 Arabic' },
  ];

  // Initialize Web Speech API
  const initializeRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in your browser');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setConfidence(0);
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      let maxConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const conf = event.results[i][0].confidence;

        if (conf > maxConfidence) {
          maxConfidence = conf;
        }

        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
      setConfidence(Math.round(maxConfidence * 100));
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  };

  // Start listening
  const handleStartListening = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = initializeRecognition();
    }
    if (recognitionRef.current) {
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
    }
  };

  // Stop listening
  const handleStopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    alert('Transcript copied to clipboard!');
  };

  // Clear transcript
  const handleClear = () => {
    setTranscript('');
    setConfidence(0);
  };

  // Simulate AI processing
  const handleProcessWithAI = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Simulate AI enhancement
      const enhanced = transcript
        .split('. ')
        .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1))
        .join('. ');
      setTranscript(enhanced);
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Voice to Text"
      >
        <Mic size={20} className="text-gray-600 dark:text-gray-400" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Mic size={24} />
                  Voice to Text
                </h2>
                <p className="text-blue-100 text-sm mt-1">Convert voice messages to text with AI enhancement</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Language Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Globe size={18} />
                  Select Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  disabled={isListening}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Recording Controls */}
              <div className="space-y-4">
                <div className="flex gap-3">
                  <button
                    onClick={handleStartListening}
                    disabled={isListening}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Mic size={20} />
                    {isListening ? 'Listening...' : 'Start Recording'}
                  </button>
                  <button
                    onClick={handleStopListening}
                    disabled={!isListening}
                    className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Volume2 size={20} />
                    Stop
                  </button>
                </div>

                {/* Listening Indicator */}
                {isListening && (
                  <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border-2 border-blue-500 animate-pulse">
                    <p className="text-blue-700 dark:text-blue-300 text-center font-semibold">
                      🎤 Listening... Speak now!
                    </p>
                  </div>
                )}
              </div>

              {/* Confidence Score */}
              {confidence > 0 && (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Confidence</p>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400">{confidence}%</p>
                  </div>
                  <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                      style={{ width: `${confidence}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Transcript Display */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Transcript
                </label>
                <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Your transcribed text will appear here..."
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none h-32"
                />
              </div>

              {/* AI Enhancement */}
              {transcript && (
                <button
                  onClick={handleProcessWithAI}
                  disabled={isProcessing}
                  className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold hover:bg-purple-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      AI Processing...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Enhance with AI
                    </>
                  )}
                </button>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCopy}
                  disabled={!transcript}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Copy size={18} />
                  Copy
                </button>
                <button
                  onClick={handleClear}
                  disabled={!transcript}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>

              {/* Browser Support Note */}
              <div className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 p-3 rounded-lg text-sm text-yellow-800 dark:text-yellow-200">
                💡 Works best in Chrome, Edge, and Safari. Requires microphone permission.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VoiceToText;
