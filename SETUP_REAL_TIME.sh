#!/bin/bash

# Real-Time Communication Setup Script
# This script sets up Firebase for real-time user synchronization

echo "🚀 Setting up Real-Time Communication..."
echo ""

# Step 1: Create .env file
echo "📝 Creating .env file..."
cat > .env << 'EOF'
# Firebase Configuration
# Get these values from https://console.firebase.google.com

# IMPORTANT: Replace these with YOUR Firebase project credentials
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY_HERE
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN_HERE
REACT_APP_FIREBASE_DATABASE_URL=YOUR_DATABASE_URL_HERE
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID_HERE
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET_HERE
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID_HERE
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID_HERE
EOF

echo "✅ .env file created!"
echo ""

# Step 2: Show instructions
echo "📋 NEXT STEPS:"
echo ""
echo "1. Go to: https://console.firebase.google.com"
echo "2. Click 'Add project'"
echo "3. Name it: 'quick-connect'"
echo "4. Create Realtime Database"
echo "5. Copy your Firebase config"
echo "6. Update .env file with your credentials"
echo ""
echo "7. Then run:"
echo "   npm run build"
echo "   npm start"
echo ""
echo "🎉 Done!"
