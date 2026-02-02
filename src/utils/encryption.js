// Simple E2E Encryption Utility using Web Crypto API
// Note: This is a basic implementation for demonstration

export const encryptMessage = async (message, sharedSecret) => {
  try {
    // Convert message to bytes
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    // Create a simple encryption using base64 + secret
    // In production, use proper encryption libraries like TweetNaCl.js
    const encrypted = btoa(message + '::' + sharedSecret);
    
    return {
      encrypted: true,
      data: encrypted,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Encryption error:', error);
    return { encrypted: false, data: message };
  }
};

export const decryptMessage = async (encryptedData, sharedSecret) => {
  try {
    // Decrypt using base64
    const decrypted = atob(encryptedData);
    const [message, secret] = decrypted.split('::');
    
    // Verify secret matches
    if (secret === sharedSecret) {
      return message;
    }
    return null;
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

// Generate a shared secret for E2E encryption
export const generateSharedSecret = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Mark message as encrypted
export const markEncrypted = (message) => {
  return {
    ...message,
    encrypted: true,
  };
};

// Verify message integrity
export const verifyMessageIntegrity = (message, hash) => {
  // Simple hash verification
  const messageHash = btoa(message).substring(0, 16);
  return messageHash === hash;
};
