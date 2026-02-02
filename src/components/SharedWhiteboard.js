import React, { useRef, useState, useEffect } from 'react';
import { Pen, Eraser, RotateCcw, Download, X, Palette, Type } from 'lucide-react';

function SharedWhiteboard({ selectedContact, onClose }) {
  const canvasRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen'); // pen, eraser, text
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(3);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textX, setTextX] = useState(0);
  const [textY, setTextY] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load saved whiteboard
      const saved = localStorage.getItem(`whiteboard_${selectedContact?.id}`);
      if (saved) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = saved;
      }
    }
  }, [selectedContact?.id]);

  const saveWhiteboard = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      localStorage.setItem(`whiteboard_${selectedContact?.id}`, canvas.toDataURL());
    }
  };

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'text') {
      setTextX(x);
      setTextY(y);
      setShowTextInput(true);
      return;
    }

    setIsDrawing(true);
    const ctx = canvas.getContext('2d');

    if (tool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else if (tool === 'eraser') {
      ctx.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing || tool === 'text') return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ctx = canvas.getContext('2d');

    if (tool === 'pen') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveWhiteboard();
  };

  const addText = () => {
    if (!textInput.trim()) {
      setShowTextInput(false);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.font = `${brushSize * 5}px Arial`;
    ctx.fillText(textInput, textX, textY);

    setTextInput('');
    setShowTextInput(false);
    saveWhiteboard();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveWhiteboard();
  };

  const downloadWhiteboard = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL();
    link.download = `whiteboard_${selectedContact?.name || 'shared'}_${new Date().toISOString().split('T')[0]}.png`;
    link.click();
  };

  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500'];

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Shared Whiteboard"
      >
        <Pen size={20} className="text-gray-600 dark:text-gray-400" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Pen size={24} />
                  Shared Whiteboard
                </h2>
                <p className="text-purple-100 text-sm mt-1">Draw, brainstorm, and explain ideas visually</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Toolbar */}
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg space-y-4">
                {/* Tool Selection */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setTool('pen')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      tool === 'pen'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Pen size={18} />
                    Pen
                  </button>
                  <button
                    onClick={() => setTool('eraser')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      tool === 'eraser'
                        ? 'bg-red-500 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Eraser size={18} />
                    Eraser
                  </button>
                  <button
                    onClick={() => setTool('text')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                      tool === 'text'
                        ? 'bg-green-500 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Type size={18} />
                    Text
                  </button>
                </div>

                {/* Color Picker */}
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                    <Palette size={18} />
                    Color:
                  </span>
                  <div className="flex gap-2">
                    {colors.map(c => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          color === c ? 'border-gray-800 dark:border-white scale-110' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-8 h-8 cursor-pointer rounded-lg"
                      title="Custom color"
                    />
                  </div>
                </div>

                {/* Brush Size */}
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-800 dark:text-white">Brush Size:</span>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="flex-1 max-w-xs"
                  />
                  <span className="text-gray-800 dark:text-white font-semibold">{brushSize}px</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={clearCanvas}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <RotateCcw size={18} />
                    Clear All
                  </button>
                  <button
                    onClick={downloadWhiteboard}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>

              {/* Canvas */}
              <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={500}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full cursor-crosshair bg-white"
                />
              </div>

              {/* Text Input Modal */}
              {showTextInput && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
                  <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-xl">
                    <p className="text-gray-800 dark:text-white font-semibold mb-3">Enter Text:</p>
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') addText();
                      }}
                      autoFocus
                      placeholder="Type text..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 mb-4"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addText}
                        className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        Add Text
                      </button>
                      <button
                        onClick={() => setShowTextInput(false)}
                        className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Info */}
              <div className="bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 p-4 rounded-lg text-sm text-purple-800 dark:text-purple-200">
                <p className="font-semibold mb-2">💡 Tips:</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Use Pen tool to draw and brainstorm</li>
                  <li>Use Eraser to fix mistakes</li>
                  <li>Add Text for annotations and explanations</li>
                  <li>Download your whiteboard as an image</li>
                  <li>Changes are automatically saved</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SharedWhiteboard;
