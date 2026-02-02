// Real-Time Sync Hook
// Synchronizes data across devices in real-time using Firebase

import { useEffect, useState, useCallback } from 'react';
import { database } from '../config/firebase';
import { ref, onValue, set, update } from 'firebase/database';

/**
 * Hook for real-time data synchronization
 * @param {string} path - Firebase database path (e.g., 'users', 'messages')
 * @param {*} initialValue - Initial value if no data exists
 * @returns {Object} - { data, loading, error, updateData, addData, removeData }
 */
export function useRealtimeSync(path, initialValue = null) {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen for real-time updates
  useEffect(() => {
    if (!path || !database) {
      setLoading(false);
      return;
    }

    try {
      const dbRef = ref(database, path);
      
      const unsubscribe = onValue(
        dbRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setData(snapshot.val());
          } else {
            setData(initialValue);
          }
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error('Firebase read error:', error);
          setError(error.message);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Firebase setup error:', err);
      setError(err.message);
      setLoading(false);
    }
  }, [path, initialValue]);

  // Update entire data
  const updateData = useCallback(async (newData) => {
    if (!path || !database) {
      console.error('Firebase not initialized');
      return;
    }

    try {
      await set(ref(database, path), newData);
      console.log('Data updated successfully');
    } catch (err) {
      console.error('Error updating data:', err);
      setError(err.message);
    }
  }, [path]);

  // Add new item to object/array
  const addData = useCallback(async (key, value) => {
    if (!path || !database) {
      console.error('Firebase not initialized');
      return;
    }

    try {
      const updates = {};
      updates[`${path}/${key}`] = value;
      await update(ref(database), updates);
      console.log('Data added successfully');
    } catch (err) {
      console.error('Error adding data:', err);
      setError(err.message);
    }
  }, [path]);

  // Remove item
  const removeData = useCallback(async (key) => {
    if (!path || !database) {
      console.error('Firebase not initialized');
      return;
    }

    try {
      await set(ref(database, `${path}/${key}`), null);
      console.log('Data removed successfully');
    } catch (err) {
      console.error('Error removing data:', err);
      setError(err.message);
    }
  }, [path]);

  return {
    data,
    loading,
    error,
    updateData,
    addData,
    removeData
  };
}

/**
 * Hook for listening to specific user data
 * @param {string} userId - User ID or username
 * @returns {Object} - User data and update function
 */
export function useUserData(userId) {
  return useRealtimeSync(`users/${userId}`, null);
}

/**
 * Hook for listening to all users
 * @returns {Object} - All users data and update function
 */
export function useAllUsers() {
  return useRealtimeSync('users', {});
}

/**
 * Hook for listening to messages
 * @param {string} conversationId - Conversation ID
 * @returns {Object} - Messages data and update function
 */
export function useMessages(conversationId) {
  return useRealtimeSync(`messages/${conversationId}`, []);
}

/**
 * Hook for listening to contacts
 * @param {string} userId - User ID
 * @returns {Object} - Contacts data and update function
 */
export function useContacts(userId) {
  return useRealtimeSync(`contacts/${userId}`, []);
}
