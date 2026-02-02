import React, { useState, useEffect } from 'react';
import { X, BookOpen, Zap } from 'lucide-react';

function ChatSummary({ messages, contactName }) {
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  // Generate summary from messages
  const generateSummary = (msgs) => {
    if (!msgs || msgs.length === 0) return '';

    // Get last 20 messages for summary
    const recentMessages = msgs.slice(-20);
    
    // Extract key information
    const topics = {};
    const keywords = {};

    recentMessages.forEach(msg => {
      const words = msg.text.toLowerCase().split(/\s+/);
      
      // Count important words (length > 4)
      words.forEach(word => {
        if (word.length > 4 && !['about', 'think', 'really', 'would', 'could'].includes(word)) {
          keywords[word] = (keywords[word] || 0) + 1;
        }
      });

      // Detect topics
      if (msg.text.includes('?')) topics['questions'] = (topics['questions'] || 0) + 1;
      if (msg.text.includes('!')) topics['excitement'] = (topics['excitement'] || 0) + 1;
      if (msg.text.includes('😂') || msg.text.includes('😄')) topics['humor'] = (topics['humor'] || 0) + 1;
    });

    // Build summary text
    let summaryText = `📊 **Chat Summary with ${contactName}**\n\n`;
    summaryText += `📝 Messages analyzed: ${recentMessages.length}\n`;
    summaryText += `⏰ Time span: Last ${recentMessages.length} messages\n\n`;

    summaryText += `**Key Topics:**\n`;
    const topTopics = Object.entries(topics)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    
    if (topTopics.length > 0) {
      topTopics.forEach(([topic, count]) => {
        summaryText += `• ${topic.charAt(0).toUpperCase() + topic.slice(1)}: ${count} messages\n`;
      });
    } else {
      summaryText += '• General conversation\n';
    }

    summaryText += `\n**Sentiment:** `;
    if (topics['excitement'] > topics['questions']) {
      summaryText += '😊 Positive & Excited';
    } else if (topics['questions'] > 2) {
      summaryText += '🤔 Inquisitive';
    } else {
      summaryText += '😌 Neutral & Casual';
    }

    summaryText += `\n\n**Quick Stats:**\n`;
    summaryText += `• Average message length: ${Math.round(recentMessages.reduce((sum, m) => sum + m.text.length, 0) / recentMessages.length)} chars\n`;
    summaryText += `• Most discussed: ${Object.entries(keywords).sort((a, b) => b[1] - a[1])[0]?.[0] || 'various topics'}\n`;

    return summaryText;
  };

  useEffect(() => {
    if (messages && messages.length > 10) {
      const newSummary = generateSummary(messages);
      setSummary(newSummary);
    }
  }, [messages, contactName]);

  if (!summary || messages.length < 10) return null;

  return (
    <div className="bg-slate-800/50 border-t border-slate-700 p-4">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-semibold text-white">Chat Summary</h3>
        <button
          onClick={() => setShowSummary(!showSummary)}
          className="ml-auto text-xs text-blue-400 hover:text-blue-300 transition-all"
        >
          {showSummary ? 'Hide' : 'Show'}
        </button>
      </div>

      {showSummary && (
        <div className="bg-slate-900/50 rounded-lg p-3 text-sm text-gray-300 space-y-2 border border-slate-700">
          {summary.split('\n').map((line, idx) => (
            <div key={idx} className={line.startsWith('**') ? 'font-semibold text-white' : ''}>
              {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatSummary;
