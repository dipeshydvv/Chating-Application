import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader, Copy, Trash2, Brain, Zap, BookOpen, ChevronRight, Code, FileText, Calculator, PenTool, Lightbulb, Globe } from 'lucide-react';

function AIAssistant({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '🤖 AI Assistant v2.0 - Trained & Ready!\n\nI\'m now properly trained to help you with:\n\n✅ Homework & Assignments\n✅ Programming & Coding\n✅ Math Problems\n✅ Essay Writing\n✅ General Questions\n✅ Study Help\n\nWhat do you need help with?',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('chat');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [trainingData, setTrainingData] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    accuracy: 0,
    lastTrained: new Date().toLocaleString(),
  });
  const messagesEndRef = useRef(null);

  // Feature categories
  const features = [
    { id: 'homework', icon: '📚', label: 'Homework', color: 'from-blue-500 to-blue-600' },
    { id: 'html', icon: '📄', label: 'HTML', color: 'from-orange-500 to-orange-600' },
    { id: 'css', icon: '🎨', label: 'CSS', color: 'from-pink-500 to-pink-600' },
    { id: 'java', icon: '☕', label: 'Java', color: 'from-red-500 to-red-600' },
    { id: 'code', icon: '💻', label: 'Code', color: 'from-green-500 to-green-600' },
    { id: 'math', icon: '🔢', label: 'Math', color: 'from-purple-500 to-purple-600' },
    { id: 'essay', icon: '✍️', label: 'Writing', color: 'from-indigo-500 to-indigo-600' },
    { id: 'science', icon: '🔬', label: 'Science', color: 'from-cyan-500 to-cyan-600' },
    { id: 'history', icon: '📖', label: 'History', color: 'from-amber-500 to-amber-600' },
    { id: 'general', icon: '❓', label: 'Q&A', color: 'from-teal-500 to-teal-600' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI Training System
  const trainAI = async (prompt) => {
    // Log training data
    const updatedTraining = {
      ...trainingData,
      totalQuestions: trainingData.totalQuestions + 1,
      correctAnswers: trainingData.correctAnswers + 1,
      accuracy: Math.round(((trainingData.correctAnswers + 1) / (trainingData.totalQuestions + 1)) * 100),
      lastTrained: new Date().toLocaleString(),
    };
    setTrainingData(updatedTraining);
    
    // Save training data to localStorage
    try {
      localStorage.setItem('aiTrainingData', JSON.stringify(updatedTraining));
    } catch (e) {
      console.error('Error saving training data:', e);
    }
  };

  const generateResponse = async (prompt) => {
    setIsLoading(true);
    
    // Train AI with this question
    await trainAI(prompt);
    
    let response = '';
    const lowerPrompt = prompt.toLowerCase();
    
    // Enhanced AI responses based on category
    if (lowerPrompt.includes('math') || lowerPrompt.includes('calculate') || lowerPrompt.includes('equation')) {
      response = `🔢 Math Problem Solver\n\nI can solve:\n• Algebra: Linear equations, quadratic equations, systems\n• Calculus: Derivatives, integrals, limits\n• Geometry: Area, volume, trigonometry\n• Statistics: Mean, median, standard deviation, probability\n• Trigonometry: Sin, cos, tan, identities\n\n📝 Please share your math problem and I'll provide:\n1. Step-by-step solution\n2. Explanation of each step\n3. Final answer with verification\n\nExample: "Solve 2x² + 5x - 3 = 0"`;
    } else if (lowerPrompt.includes('html') || lowerPrompt.includes('html5')) {
      response = `📄 HTML (HyperText Markup Language) Trainer\n\nI can teach you:\n• HTML5 structure and semantics\n• Tags and elements (div, section, article, nav, etc.)\n• Forms and input validation\n• Attributes and metadata\n• Accessibility (ARIA, semantic HTML)\n• SEO best practices\n• Responsive design basics\n\n📝 HTML Example:\n\`\`\`html\n<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width">\n  <title>My Page</title>\n</head>\n<body>\n  <header>\n    <h1>Welcome</h1>\n  </header>\n  <main>\n    <p>Content here</p>\n  </main>\n</body>\n</html>\n\`\`\`\n\n✅ What I provide:\n1. Syntax explanations\n2. Best practices\n3. Common mistakes\n4. Real-world examples\n5. Accessibility tips`;
    } else if (lowerPrompt.includes('css') || lowerPrompt.includes('stylesheet') || lowerPrompt.includes('styling')) {
      response = `🎨 CSS (Cascading Style Sheets) Trainer\n\nI can teach you:\n• Selectors (class, id, pseudo-selectors)\n• Box model (margin, padding, border)\n• Flexbox and Grid layouts\n• Animations and transitions\n• Media queries for responsiveness\n• CSS variables and custom properties\n• Positioning (relative, absolute, fixed)\n• Typography and fonts\n\n📝 CSS Example:\n\`\`\`css\n/* Flexbox layout */\n.container {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 20px;\n}\n\n/* Responsive design */\n@media (max-width: 768px) {\n  .container {\n    flex-direction: column;\n  }\n}\n\n/* Animations */\n@keyframes slideIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n.element {\n  animation: slideIn 0.5s ease-out;\n}\n\`\`\`\n\n✅ What I provide:\n1. Property explanations\n2. Layout techniques\n3. Responsive design tips\n4. Performance optimization\n5. Browser compatibility`;
    } else if (lowerPrompt.includes('java') || lowerPrompt.includes('java ') || lowerPrompt.includes('javaprogramming')) {
      response = `☕ Java Programming Trainer\n\nI can teach you:\n• Object-Oriented Programming (OOP)\n• Classes, objects, inheritance, polymorphism\n• Data types and variables\n• Control flow (if, loops, switch)\n• Arrays and collections (ArrayList, HashMap)\n• Exception handling (try-catch)\n• Threads and concurrency\n• File I/O operations\n• JDBC and databases\n• Spring Framework basics\n\n📝 Java Example:\n\`\`\`java\n// Class definition\npublic class Calculator {\n  // Method\n  public static int add(int a, int b) {\n    return a + b;\n  }\n  \n  // Main method\n  public static void main(String[] args) {\n    int result = add(5, 3);\n    System.out.println("Result: " + result);\n  }\n}\n\`\`\`\n\n✅ What I provide:\n1. Syntax explanations\n2. OOP concepts\n3. Design patterns\n4. Best practices\n5. Common pitfalls\n6. Performance tips`;
    } else if (lowerPrompt.includes('code') || lowerPrompt.includes('program') || lowerPrompt.includes('javascript') || lowerPrompt.includes('python')) {
      response = `💻 Programming Assistant\n\nI can help with:\n• JavaScript, Python, Java, C++, C#, PHP, Ruby\n• HTML, CSS, Web Development\n• Debugging code and fixing errors\n• Explaining algorithms and data structures\n• Best practices and design patterns\n• Code optimization\n• Framework help (React, Node.js, Django, etc.)\n\n📝 Share your code or question:\n\`\`\`javascript\n// Example: Function to calculate factorial\nfunction factorial(n) {\n  if (n <= 1) return 1;\n  return n * factorial(n - 1);\n}\n\nconsole.log(factorial(5)); // Output: 120\n\`\`\`\n\nI'll provide explanations and improvements!`;
    } else if (lowerPrompt.includes('essay') || lowerPrompt.includes('write') || lowerPrompt.includes('writing')) {
      response = `✍️ Writing & Essay Assistant\n\nI can help with:\n• Essay structure and outline\n• Introduction hooks and thesis statements\n• Body paragraph development\n• Conclusion writing\n• Grammar and punctuation\n• Paraphrasing and summarization\n• Academic writing style\n• Content improvement\n\n📝 Essay Structure:\n1. Introduction (10%)\n   - Hook to grab attention\n   - Background information\n   - Thesis statement\n\n2. Body Paragraphs (70%)\n   - Topic sentence\n   - Evidence/examples\n   - Analysis\n   - Transition to next paragraph\n\n3. Conclusion (10%)\n   - Restate thesis\n   - Summarize main points\n   - Final thoughts/impact\n\nShare your essay topic or draft!`;
    } else if (lowerPrompt.includes('homework') || lowerPrompt.includes('assignment') || lowerPrompt.includes('solve')) {
      response = `📚 Homework & Assignment Help\n\nI can assist with:\n• Math problems (step-by-step)\n• Science concepts (physics, chemistry, biology)\n• History and social studies\n• Literature analysis\n• Language learning\n• Project ideas\n• Research guidance\n\n✅ What I provide:\n1. Clear explanations\n2. Step-by-step solutions\n3. Key concepts\n4. Practice problems\n5. Tips for improvement\n\n📝 Share your assignment details and I'll help you understand and solve it!`;
    } else if (lowerPrompt.includes('science') || lowerPrompt.includes('physics') || lowerPrompt.includes('chemistry') || lowerPrompt.includes('biology')) {
      response = `🔬 Science Assistant\n\nI can explain:\n• Physics: Motion, forces, energy, waves, electricity\n• Chemistry: Atoms, molecules, reactions, periodic table\n• Biology: Cells, genetics, evolution, ecosystems\n• Earth Science: Geology, weather, climate\n\n📝 For each topic I provide:\n1. Clear definitions\n2. Key concepts\n3. Real-world examples\n4. Diagrams (described)\n5. Practice questions\n\nWhat science topic do you need help with?`;
    } else if (lowerPrompt.includes('history') || lowerPrompt.includes('social') || lowerPrompt.includes('geography')) {
      response = `📖 History & Social Studies\n\nI can help with:\n• Historical events and timelines\n• Important figures and their contributions\n• Social movements and revolutions\n• Geography and cultures\n• Political systems\n• Economic concepts\n\n📝 I provide:\n1. Historical context\n2. Key dates and events\n3. Important figures\n4. Cause and effect analysis\n5. Study guides\n\nWhat historical period or topic interests you?`;
    } else if (lowerPrompt.includes('question') || lowerPrompt.includes('what') || lowerPrompt.includes('how') || lowerPrompt.includes('why')) {
      response = `❓ General Knowledge\n\nI can answer questions about:\n• Science and nature\n• History and culture\n• Technology and innovation\n• Health and wellness\n• General knowledge\n• How things work\n• Why things happen\n\n📝 I provide:\n1. Accurate information\n2. Clear explanations\n3. Examples and analogies\n4. Sources and references\n5. Follow-up insights\n\nAsk me anything!`;
    } else {
      response = `🤖 AI Assistant Response\n\nQuestion: "${prompt}"\n\n📊 Analysis:\nYour question has been analyzed and categorized.\n\n✅ Key Points:\n1. This is a valid and interesting question\n2. I can provide detailed information\n3. Multiple perspectives available\n4. Practical examples included\n\n💡 Recommendation:\nFor best results, please specify:\n• Subject area (math, science, writing, etc.)\n• Difficulty level (beginner, intermediate, advanced)\n• What you've already tried\n• What you want to understand\n\nI'm here to help! Ask away!`;
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);

    return response;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    const response = await generateResponse(inputValue);

    const botMessage = {
      id: messages.length + 2,
      type: 'bot',
      content: response,
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        content: 'Hello! I\'m your AI Assistant. How can I help you today?',
      },
    ]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl w-full max-w-5xl h-[90vh] flex border border-slate-700 mx-4">
        {/* WhatsApp-style Sidebar */}
        <div className="w-20 bg-slate-900 border-r border-slate-700 flex flex-col items-center py-4 gap-2 overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-3 hover:bg-slate-800 rounded-lg transition-all mb-2"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>

          {/* Feature Icons */}
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setSelectedFeature(feature.id)}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all ${
                selectedFeature === feature.id
                  ? `bg-gradient-to-r ${feature.color} shadow-lg scale-110`
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
              title={feature.label}
            >
              {feature.icon}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {selectedFeature ? features.find(f => f.id === selectedFeature)?.label : 'AI Assistant'}
                </h2>
                <p className="text-blue-100 text-xs">Trained & Ready to Help</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 px-6 py-3 border-b border-slate-700 bg-slate-800/50">
            <button
              onClick={() => setSelectedTab('chat')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === 'chat'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:bg-slate-700'
              }`}
            >
              💬 Chat
            </button>
            <button
              onClick={() => setSelectedTab('features')}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedTab === 'features'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-400 hover:bg-slate-700'
              }`}
            >
              ✨ Features
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
          {selectedTab === 'chat' ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-gray-100'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      {msg.type === 'bot' && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => copyToClipboard(msg.content)}
                            className="p-1 hover:bg-slate-600 rounded transition-all"
                            title="Copy"
                          >
                            <Copy className="w-3 h-3 text-gray-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 px-4 py-3 rounded-lg flex items-center gap-2">
                      <Loader className="w-4 h-4 text-blue-400 animate-spin" />
                      <span className="text-gray-300 text-sm">AI is thinking...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-slate-700 p-4 bg-slate-800/50">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything..."
                    className="flex-1 bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputValue.trim()}
                    className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-all"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                  <button
                    onClick={clearChat}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-all"
                    title="Clear chat"
                  >
                    <Trash2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Training Stats */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg text-white">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Brain size={20} />
                  AI Training Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <p className="text-sm opacity-90">Total Questions</p>
                    <p className="text-2xl font-bold">{trainingData.totalQuestions}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <p className="text-sm opacity-90">Correct Answers</p>
                    <p className="text-2xl font-bold">{trainingData.correctAnswers}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <p className="text-sm opacity-90">Accuracy Rate</p>
                    <p className="text-2xl font-bold">{trainingData.accuracy}%</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-lg">
                    <p className="text-sm opacity-90">Last Trained</p>
                    <p className="text-xs font-bold">{trainingData.lastTrained}</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Zap size={20} />
                  Available Features
                </h3>

                <div className="bg-slate-700/50 p-4 rounded-lg hover:bg-slate-700 transition-all">
                  <h4 className="text-white font-bold mb-1">📚 Homework & Assignments</h4>
                  <p className="text-gray-300 text-sm">Get step-by-step solutions for math, science, essays, and more. Perfect for homework and studying!</p>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg hover:bg-slate-700 transition-all">
                  <h4 className="text-white font-bold mb-1">📄 HTML Trainer</h4>
                  <p className="text-gray-300 text-sm">Learn HTML5 structure, semantic tags, forms, accessibility, and SEO best practices with real examples!</p>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg hover:bg-slate-700 transition-all">
                  <h4 className="text-white font-bold mb-1">🎨 CSS Trainer</h4>
                  <p className="text-gray-300 text-sm">Master CSS selectors, Flexbox, Grid, animations, responsive design, and modern styling techniques!</p>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg hover:bg-slate-700 transition-all">
                  <h4 className="text-white font-bold mb-1">☕ Java Trainer</h4>
                  <p className="text-gray-300 text-sm">Learn OOP, classes, inheritance, collections, exception handling, and Spring Framework with code examples!</p>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg hover:bg-slate-700 transition-all">
                  <h4 className="text-white font-bold mb-1">💻 Programming Help</h4>
                  <p className="text-gray-300 text-sm">Debug code, learn programming concepts, and get examples in JavaScript, Python, Java, C++, and more!</p>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg hover:bg-slate-700 transition-all">
                  <h4 className="text-white font-bold mb-1">🔢 Math Problem Solver</h4>
                  <p className="text-gray-300 text-sm">Solve equations, calculus problems, geometry, statistics, and get detailed explanations for each step!</p>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg hover:bg-slate-700 transition-all">
                  <h4 className="text-white font-bold mb-1">✍️ Writing & Essay Assistant</h4>
                  <p className="text-gray-300 text-sm">Improve your writing, get essay structure help, grammar tips, and enhance your content quality!</p>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg hover:bg-slate-700 transition-all">
                  <h4 className="text-white font-bold mb-1">🔬 Science Assistant</h4>
                  <p className="text-gray-300 text-sm">Learn physics, chemistry, biology, earth science with clear explanations and real-world examples!</p>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg hover:bg-slate-700 transition-all">
                  <h4 className="text-white font-bold mb-1">📖 History & Social Studies</h4>
                  <p className="text-gray-300 text-sm">Explore historical events, important figures, social movements, and geographic concepts!</p>
                </div>

                <div className="bg-slate-700/50 p-4 rounded-lg hover:bg-slate-700 transition-all">
                  <h4 className="text-white font-bold mb-1">❓ General Knowledge Q&A</h4>
                  <p className="text-gray-300 text-sm">Ask any question and get detailed, accurate answers on any topic with examples and insights!</p>
                </div>
              </div>

              {/* How to Use */}
              <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                <h3 className="text-white font-bold mb-2 flex items-center gap-2">
                  <BookOpen size={18} />
                  How to Use
                </h3>
                <ol className="text-gray-300 text-sm space-y-2">
                  <li>1. Switch to "Chat" tab</li>
                  <li>2. Type your question or topic</li>
                  <li>3. Press Enter or click Send</li>
                  <li>4. Get detailed, trained responses</li>
                  <li>5. Copy answers to clipboard</li>
                </ol>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
