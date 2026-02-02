# Quick Connect Backend

Spring Boot backend for the Quick Connect Web3 social platform.

## Features

- Web3 wallet authentication (MetaMask)
- Email/password authentication
- Real-time messaging with text, voice, and location sharing
- User management and online status
- JWT token-based security
- RESTful API

## Prerequisites

- Java 17+
- Maven 3.6+
- PostgreSQL (for production)

## Installation

1. Clone the repository
2. Navigate to the backend directory:
```bash
cd backend
```

3. Build the project:
```bash
mvn clean install
```

## Running the Application

### Development (H2 Database)
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### Production (PostgreSQL)
Update `application.properties` with your PostgreSQL credentials and run:
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=prod"
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email
- `POST /api/auth/web3-login` - Login with Web3 wallet
- `GET /api/auth/verify` - Verify JWT token

### Messages
- `POST /api/messages/send` - Send message
- `GET /api/messages/conversation/{userId}` - Get conversation history
- `GET /api/messages/unread` - Get unread messages
- `PUT /api/messages/{messageId}/read` - Mark message as read
- `POST /api/messages/upload-voice` - Upload voice note

## Database Schema

### Users Table
- id (Primary Key)
- walletAddress (Unique)
- email (Unique)
- username
- avatar
- latitude, longitude
- locationShared
- isOnline
- lastSeen
- createdAt, updatedAt

### Messages Table
- id (Primary Key)
- senderId (Foreign Key)
- receiverId (Foreign Key)
- content
- messageType (TEXT, VOICE, LOCATION, EMOJI)
- voiceUrl
- voiceDuration
- latitude, longitude
- isRead
- createdAt

## Configuration

Edit `src/main/resources/application.properties`:

```properties
# JWT Secret (change in production)
jwt.secret=your-secret-key

# JWT Expiration (in milliseconds)
jwt.expiration=86400000

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/quickconnect
spring.datasource.username=postgres
spring.datasource.password=your-password
```

## Security

- JWT tokens expire after 24 hours
- CORS enabled for localhost:3000
- Password hashing with bcrypt (to be implemented)
- Web3 signature verification (to be implemented)

## Future Enhancements

- WebSocket support for real-time messaging
- File upload to cloud storage (S3/GCS)
- Voice note transcription
- Message encryption
- Push notifications
- User blocking/reporting
- Message reactions

## License

MIT
