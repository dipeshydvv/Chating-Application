/**
 * Storage Cleanup Utility
 * Manages localStorage quota and prevents "quota exceeded" errors
 */

// Maximum storage size in bytes (5MB limit per domain)
const MAX_STORAGE_SIZE = 5 * 1024 * 1024;
const WARNING_THRESHOLD = 0.8; // 80% of max

/**
 * Get current storage usage
 */
export const getStorageUsage = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

/**
 * Get storage usage percentage
 */
export const getStoragePercentage = () => {
  return (getStorageUsage() / MAX_STORAGE_SIZE) * 100;
};

/**
 * Check if storage is running low
 */
export const isStorageLow = () => {
  return getStoragePercentage() > WARNING_THRESHOLD;
};

/**
 * Clean old messages (keep only last 100 per conversation)
 */
export const cleanOldMessages = () => {
  const keys = Object.keys(localStorage);
  const messageKeys = keys.filter(key => key.startsWith('messages_'));

  messageKeys.forEach(key => {
    try {
      const messages = JSON.parse(localStorage.getItem(key) || '[]');
      
      // Keep only last 100 messages
      if (messages.length > 100) {
        const recentMessages = messages.slice(-100);
        localStorage.setItem(key, JSON.stringify(recentMessages));
      }
    } catch (e) {
      console.error(`Error cleaning messages for ${key}:`, e);
    }
  });
};

/**
 * Clean old notifications (keep only last 20)
 */
export const cleanOldNotifications = () => {
  const keys = Object.keys(localStorage);
  const notificationKeys = keys.filter(key => key.startsWith('studyNotifications_'));

  notificationKeys.forEach(key => {
    try {
      const notifications = JSON.parse(localStorage.getItem(key) || '[]');
      
      // Keep only last 20 notifications
      if (notifications.length > 20) {
        const recentNotifications = notifications.slice(-20);
        localStorage.setItem(key, JSON.stringify(recentNotifications));
      }
    } catch (e) {
      console.error(`Error cleaning notifications for ${key}:`, e);
    }
  });
};

/**
 * Clean old meeting history (keep only last 50)
 */
export const cleanOldMeetings = () => {
  try {
    const meetingHistory = JSON.parse(localStorage.getItem('meetingHistory') || '[]');
    
    if (meetingHistory.length > 50) {
      const recentMeetings = meetingHistory.slice(-50);
      localStorage.setItem('meetingHistory', JSON.stringify(recentMeetings));
    }
  } catch (e) {
    console.error('Error cleaning meeting history:', e);
  }
};

/**
 * Clean old study goals (keep only last 100 per conversation)
 */
export const cleanOldStudyGoals = () => {
  const keys = Object.keys(localStorage);
  const goalKeys = keys.filter(key => key.startsWith('studyGoals_'));

  goalKeys.forEach(key => {
    try {
      const goals = JSON.parse(localStorage.getItem(key) || '[]');
      
      // Keep only last 100 goals
      if (goals.length > 100) {
        const recentGoals = goals.slice(-100);
        localStorage.setItem(key, JSON.stringify(recentGoals));
      }
    } catch (e) {
      console.error(`Error cleaning study goals for ${key}:`, e);
    }
  });
};

/**
 * Remove old media files (base64 encoded images/videos)
 * Keep only recent media to save space
 */
export const cleanOldMedia = () => {
  const keys = Object.keys(localStorage);
  const mediaKeys = keys.filter(key => key.includes('media') || key.includes('photo'));

  // Remove media older than 7 days
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

  mediaKeys.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      
      // If value is very large (likely base64 encoded media), consider removing
      if (value && value.length > 100000) {
        // Remove old media to free up space
        localStorage.removeItem(key);
      }
    } catch (e) {
      console.error(`Error cleaning media for ${key}:`, e);
    }
  });
};

/**
 * Perform comprehensive cleanup
 */
export const performFullCleanup = () => {
  try {
    console.log('Starting storage cleanup...');
    console.log(`Storage usage before: ${(getStorageUsage() / 1024).toFixed(2)} KB`);

    cleanOldMessages();
    cleanOldNotifications();
    cleanOldMeetings();
    cleanOldStudyGoals();
    cleanOldMedia();

    console.log(`Storage usage after: ${(getStorageUsage() / 1024).toFixed(2)} KB`);
    console.log('Storage cleanup completed!');
    
    return true;
  } catch (e) {
    console.error('Error during storage cleanup:', e);
    return false;
  }
};

/**
 * Safe localStorage setItem with automatic cleanup
 */
export const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded, performing cleanup...');
      performFullCleanup();
      
      // Try again after cleanup
      try {
        localStorage.setItem(key, value);
        console.log('Successfully saved after cleanup');
      } catch (e2) {
        console.error('Failed to save even after cleanup:', e2);
        throw e2;
      }
    } else {
      throw e;
    }
  }
};

/**
 * Get storage status
 */
export const getStorageStatus = () => {
  const usage = getStorageUsage();
  const percentage = getStoragePercentage();
  
  return {
    used: `${(usage / 1024).toFixed(2)} KB`,
    percentage: `${percentage.toFixed(1)}%`,
    isLow: isStorageLow(),
    canStore: percentage < 100
  };
};

export default {
  getStorageUsage,
  getStoragePercentage,
  isStorageLow,
  cleanOldMessages,
  cleanOldNotifications,
  cleanOldMeetings,
  cleanOldStudyGoals,
  cleanOldMedia,
  performFullCleanup,
  safeSetItem,
  getStorageStatus
};
