import React, { useState, useEffect } from 'react';
import { Trash2, Image, FileText, AlertCircle, CheckCircle, X, Download } from 'lucide-react';

function MediaCleanup() {
  const [showModal, setShowModal] = useState(false);
  const [mediaItems, setMediaItems] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [selectedForDelete, setSelectedForDelete] = useState(new Set());
  const [stats, setStats] = useState({
    totalSize: 0,
    totalItems: 0,
    duplicateCount: 0,
    potentialSavings: 0
  });
  const [isScanning, setIsScanning] = useState(false);

  // Collect media from all message conversations
  const collectMedia = () => {
    const media = [];
    const hashMap = {};
    let mediaId = 0;

    // Scan all localStorage keys for messages
    const keys = Object.keys(localStorage);
    const messageKeys = keys.filter(k => k.startsWith('messages_'));

    messageKeys.forEach(key => {
      try {
        const messages = JSON.parse(localStorage.getItem(key) || '[]');
        
        messages.forEach((msg, idx) => {
          // Collect all media types
          if (msg.type === 'image' || msg.type === 'video' || msg.type === 'voice') {
            const mediaUrl = msg.url || msg.content || '';
            const hash = generateHash(mediaUrl);
            const size = estimateSize(mediaUrl);
            
            const mediaItem = {
              id: `${key}_${idx}`,
              mediaId: mediaId++,
              type: msg.type,
              url: mediaUrl,
              fileName: msg.fileName || `${msg.type}_${idx}`,
              sender: msg.sender || msg.senderUsername || 'Unknown',
              timestamp: msg.timestamp || 'Unknown',
              size: size,
              hash: hash,
              conversation: key,
              messageIndex: idx
            };

            media.push(mediaItem);

            // Track by hash for duplicate detection
            if (!hashMap[hash]) {
              hashMap[hash] = [];
            }
            hashMap[hash].push(mediaItem);
          }
        });
      } catch (err) {
        console.error('Error parsing messages:', err);
      }
    });

    // Find duplicates - same file sent multiple times
    const dups = [];
    Object.entries(hashMap).forEach(([hash, items]) => {
      if (items.length > 1) {
        dups.push({
          hash,
          count: items.length,
          items,
          size: items[0].size,
          type: items[0].type,
          fileName: items[0].fileName
        });
      }
    });

    setMediaItems(media);
    setDuplicates(dups);

    // Calculate stats
    const totalSize = media.reduce((sum, item) => sum + item.size, 0);
    const potentialSavings = dups.reduce((sum, dup) => sum + (dup.size * (dup.count - 1)), 0);

    setStats({
      totalSize,
      totalItems: media.length,
      duplicateCount: dups.reduce((sum, dup) => sum + dup.count, 0),
      potentialSavings
    });
  };

  // Generate hash for duplicate detection
  const generateHash = (content) => {
    let hash = 0;
    if (content.length === 0) return hash.toString();
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  // Estimate file size
  const estimateSize = (content) => {
    return Math.ceil((content.length * 2) / 1024); // KB
  };

  // Format size for display
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle scan
  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      collectMedia();
      setIsScanning(false);
    }, 1500);
  };

  // Toggle selection
  const toggleSelection = (id) => {
    const newSelected = new Set(selectedForDelete);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedForDelete(newSelected);
  };

  // Select all duplicates
  const selectAllDuplicates = () => {
    const dupIds = new Set();
    duplicates.forEach(dup => {
      dup.ids.slice(1).forEach(id => dupIds.add(id));
    });
    setSelectedForDelete(dupIds);
  };

  // Delete selected
  const handleDelete = () => {
    if (selectedForDelete.size === 0) return;
    
    const allMessages = JSON.parse(localStorage.getItem('allMessages') || '[]');
    const filtered = allMessages.filter(msg => !selectedForDelete.has(msg.id));
    localStorage.setItem('allMessages', JSON.stringify(filtered));
    
    setSelectedForDelete(new Set());
    handleScan();
  };

  // Export cleanup report
  const exportReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      stats,
      duplicates: duplicates.map(d => ({
        count: d.count,
        size: formatSize(d.size),
        totalSize: formatSize(d.size * d.count)
      }))
    };

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2)));
    element.setAttribute('download', `media-cleanup-report-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <button
        onClick={() => {
          setShowModal(true);
          handleScan();
        }}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
        title="Media Cleanup"
      >
        <Trash2 size={20} className="text-gray-600 dark:text-gray-400" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Trash2 size={24} />
                  Smart Media Cleanup
                </h2>
                <p className="text-purple-100 text-sm mt-1">Detect and remove duplicate media files</p>
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
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Media</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalItems}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Total Size</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatSize(stats.totalSize * 1024)}</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Duplicates</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.duplicateCount}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Can Save</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatSize(stats.potentialSavings * 1024)}</p>
                </div>
              </div>

              {/* Scan Button */}
              {!isScanning && (
                <button
                  onClick={handleScan}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  🔍 Scan for Duplicates
                </button>
              )}

              {isScanning && (
                <div className="w-full bg-gray-100 dark:bg-gray-800 py-3 rounded-lg text-center">
                  <p className="text-gray-600 dark:text-gray-400 animate-pulse">Scanning media files...</p>
                </div>
              )}

              {/* Duplicates List */}
              {duplicates.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                      <AlertCircle size={20} className="text-red-500" />
                      Found {duplicates.length} Duplicate Groups
                    </h3>
                    <button
                      onClick={selectAllDuplicates}
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                    >
                      Select All Duplicates
                    </button>
                  </div>

                  {duplicates.map((dup, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white">
                            {dup.count} copies found
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatSize(dup.size)} each • Total: {formatSize(dup.size * dup.count)}
                          </p>
                        </div>
                        <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-1 rounded">
                          Save {formatSize(dup.size * (dup.count - 1))}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {dup.ids.map((id, i) => (
                          <label
                            key={id}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={selectedForDelete.has(id)}
                              onChange={() => toggleSelection(id)}
                              disabled={i === 0}
                              className="w-4 h-4 cursor-pointer"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {i === 0 ? '✓ Keep (Original)' : `Copy ${i}`}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {duplicates.length === 0 && !isScanning && (
                <div className="text-center py-8">
                  <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No duplicates found! Your media is clean.</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={exportReport}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  Export Report
                </button>
                <button
                  onClick={handleDelete}
                  disabled={selectedForDelete.size === 0}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete {selectedForDelete.size} Items
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MediaCleanup;
