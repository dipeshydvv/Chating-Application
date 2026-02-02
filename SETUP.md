# Quick Connect - Complete Setup Guide

## Project Overview

Quick Connect is a Web3-based social platform featuring:
- **Splash Screen**: Animated landing page
- **Login Page**: Web3 wallet + email authentication
- **Chat Interface**: Real-time messaging with location, emojis, and voice notes
- **Backend**: Spring Boot REST API with JWT authentication

## Project Structure

```
capstone sem 3 new/
├── src/                          # React Frontend
│   ├── pages/
│   │   ├── SplashScreen.js       # 3-second animated intro
│   │   ├── LoginPage.js          # Web3 & email login
│   │   └── ChatHome.js           # Main chat interface
│   ├── App.js                    # Main app with routing
│   ├── index.js                  # React entry point
│   └── index.css                 # Global styles
├── public/
│   └── index.html                # HTML template
├── backend/                      # Java Spring Boot
│   ├── src/main/java/com/quickconnect/
│   │   ├── QuickConnectApplication.java
│   │   ├── controller/           # REST endpoints
│   │   ├── service/              # Business logic
│   │   ├── entity/               # JPA entities
│   │   ├── repository/           # Data access
│   │   ├── dto/                  # Data transfer objects
│   │   └── util/                 # Utilities (JWT)
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml                   # Maven dependencies
├── package.json                  # Frontend dependencies
└── README.md                     # Frontend documentation
```

## Frontend Setup

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Navigate to project root:
```bash
cd "/Users/dipeshyadav/Desktop/capstone sem 3 new"
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Features

**Splash Screen**
- 3-second animated intro
- Gradient background with floating animations
- Feature preview

**Login Page**
- Email login with validation
- MetaMask Web3 wallet connection
- Social login options (Google, GitHub)
- Beautiful glassmorphism UI

**Chat Interface**
- Contact list with search
- Real-time messaging
- **Location Sharing**: Share GPS coordinates
- **Emoji Reactions**: 16 emoji options per message
- **Voice Notes**: Record and send audio messages
- Online/offline status indicators
- Message timestamps

## Backend Setup

### Prerequisites
- Java 17+
- Maven 3.6+

### Installation

1. Navigate to backend:
```bash
cd backend
```

2. Build project:
```bash
mvn clean install
```

3. Run application:
```bash
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### API Endpoints

**Authentication**
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Email login
POST   /api/auth/web3-login        Web3 wallet login
GET    /api/auth/verify            Verify token
```

**Messages**
```
POST   /api/messages/send          Send message
GET    /api/messages/conversation/{userId}  Get chat history
GET    /api/messages/unread        Get unread messages
PUT    /api/messages/{messageId}/read       Mark as read
POST   /api/messages/upload-voice  Upload voice note
```

## Key Features Explained

### 1. Splash Screen
- Animated gradient background
- Floating blob animations
- Bouncing loading dots
- Auto-hides after 3 seconds

### 2. Web3 Authentication
- MetaMask wallet detection
- Automatic user creation on first login
- Wallet address stored in database
- JWT token generation

### 3. Chat Interface
- Sidebar with contact list
- Search functionality
- Online/offline status
- Unread message badges
- Message history per contact

### 4. Message Types

**Text Messages**
- Regular text with emoji support
- Timestamp tracking
- Read/unread status

**Voice Messages**
- Real-time recording
- Duration tracking
- Play/pause controls
- Delete functionality

**Location Messages**
- GPS coordinate sharing
- Latitude/longitude storage
- One-click sharing

**Emoji Reactions**
- 16 emoji options
- Quick selection
- Visual feedback

## Technology Stack

### Frontend
- **React 18**: UI framework
- **React Router v6**: Navigation
- **TailwindCSS 3**: Styling
- **Lucide React**: Icons
- **ethers.js / web3.js**: Web3 integration

### Backend
- **Spring Boot 3.1.5**: Framework
- **Spring Data JPA**: Database ORM
- **Spring Security**: Authentication
- **JWT (jjwt)**: Token management
- **web3j**: Web3 integration
- **H2/PostgreSQL**: Database

## Configuration

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_WEB3_PROVIDER=http://localhost:8545
```

### Backend (application.properties)
```properties
jwt.secret=your-secret-key
jwt.expiration=86400000
spring.datasource.url=jdbc:h2:mem:quickconnect
```

## Running Both Services

### Terminal 1 - Frontend
```bash
cd "/Users/dipeshyadav/Desktop/capstone sem 3 new"
npm start
```

### Terminal 2 - Backend
```bash
cd "/Users/dipeshyadav/Desktop/capstone sem 3 new/backend"
mvn spring-boot:run
```

## Testing the Application

1. **Splash Screen**: Automatically displays for 3 seconds
2. **Login**: 
   - Email: Use any email format
   - Web3: Click "Connect MetaMask" (requires MetaMask installed)
3. **Chat**:
   - Select a contact from the sidebar
   - Send text messages
   - Click emoji icon to select emoji
   - Click location icon to share GPS
   - Click mic icon to record voice message
   - Click send to submit

## Database Schema

### Users
- id, walletAddress, email, username, avatar
- latitude, longitude, locationShared
- isOnline, lastSeen, createdAt, updatedAt

### Messages
- id, senderId, receiverId, content, messageType
- voiceUrl, voiceDuration, latitude, longitude
- isRead, createdAt

## Security Considerations

- JWT tokens expire after 24 hours
- CORS enabled only for localhost:3000
- Web3 signature verification (to be implemented)
- Password hashing with bcrypt (to be implemented)
- Message encryption (to be implemented)

## Troubleshooting

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Backend won't compile
```bash
# Clear Maven cache
mvn clean install -U
```

### MetaMask not connecting
- Ensure MetaMask extension is installed
- Check browser console for errors
- Verify localhost:3000 is allowed in MetaMask

### Database errors
- Check H2 console: http://localhost:8080/api/h2-console
- Default credentials: sa / (empty password)

## Future Enhancements

- WebSocket for real-time messaging
- Cloud storage for voice notes (S3/GCS)
- Message encryption (end-to-end)
- User profiles and avatars
- Group chats
- Message reactions
- Call functionality
- Push notifications
- Blockchain integration for transactions

## Deployment

### Frontend (Netlify/Vercel)
```bash
npm run build
# Deploy the build/ folder
```

### Backend (Heroku/AWS)
```bash
mvn clean package
# Deploy the JAR file
```

## Support

For issues or questions, check:
- Frontend README.md
- Backend README.md
- Console logs in browser DevTools
- Backend logs in terminal

## License

MIT
