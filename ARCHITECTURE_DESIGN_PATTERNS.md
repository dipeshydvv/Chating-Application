# 🏗️ Architecture & Design Patterns

## Project Architecture

### Overall Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│                   Port: 3000                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  App.js (Router)                                 │  │
│  │  ├─ LoginPage                                    │  │
│  │  ├─ SplashScreen                                 │  │
│  │  └─ ChatHome (Main Hub)                          │  │
│  │     └─ 30 Feature Components                     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  State Management                                │  │
│  │  ├─ React Hooks (useState, useEffect)            │  │
│  │  ├─ Context API (optional)                       │  │
│  │  └─ localStorage (persistence)                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Styling                                         │  │
│  │  ├─ Tailwind CSS                                 │  │
│  │  ├─ CSS Variables (themes)                       │  │
│  │  └─ Dark Mode Support                            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Backend (Spring Boot)                 │
│                   Port: 8080                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  REST API Endpoints                              │  │
│  │  ├─ /api/auth (Authentication)                   │  │
│  │  ├─ /api/messages (Messaging)                    │  │
│  │  ├─ /api/users (User Management)                 │  │
│  │  └─ /api/contacts (Contact Management)           │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Database (SQLite)                               │  │
│  │  ├─ Users Table                                  │  │
│  │  ├─ Messages Table                               │  │
│  │  ├─ Contacts Table                               │  │
│  │  └─ Sessions Table                               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Design Patterns Used

### 1. Component Pattern
```javascript
// Functional Component with Hooks
function FeatureComponent({ prop1, prop2 }) {
  const [state, setState] = useState(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### 2. Container/Presentational Pattern
```javascript
// Container Component (ChatHome.js)
// - Manages state
// - Handles logic
// - Passes props to presentational components

// Presentational Component (StudyMode.js)
// - Receives props
// - Renders UI
// - Calls callbacks
```

### 3. Custom Hooks Pattern
```javascript
// Custom Hook for reusable logic
function useStudySession() {
  const [session, setSession] = useState(null);
  
  const startSession = () => { /* ... */ };
  const endSession = () => { /* ... */ };
  
  return { session, startSession, endSession };
}
```

### 4. Context API Pattern
```javascript
// Theme Context
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 5. Higher-Order Component (HOC) Pattern
```javascript
// HOC for authentication
function withAuth(Component) {
  return function ProtectedComponent(props) {
    const isAuthenticated = checkAuth();
    
    if (!isAuthenticated) {
      return <LoginPage />;
    }
    
    return <Component {...props} />;
  };
}
```

### 6. Render Props Pattern
```javascript
// Render Props for flexible rendering
function DataFetcher({ render }) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetchData().then(setData);
  }, []);
  
  return render(data);
}
```

### 7. Compound Components Pattern
```javascript
// Compound Components
<GameRoom>
  <GameRoom.Header />
  <GameRoom.Board />
  <GameRoom.Controls />
</GameRoom>
```

### 8. Observer Pattern
```javascript
// Event Emitter Pattern
class EventEmitter {
  on(event, callback) { /* ... */ }
  emit(event, data) { /* ... */ }
  off(event, callback) { /* ... */ }
}
```

### 9. Factory Pattern
```javascript
// Component Factory
function createComponent(type, props) {
  switch(type) {
    case 'study': return <StudyMode {...props} />;
    case 'game': return <GameRoom {...props} />;
    case 'music': return <MusicPlayer {...props} />;
    default: return null;
  }
}
```

### 10. Singleton Pattern
```javascript
// Singleton for global state
class AppState {
  static instance = null;
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new AppState();
    }
    return this.instance;
  }
}
```

---

## State Management Strategy

### Local State (useState)
```javascript
// Component-level state
const [message, setMessage] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState(null);
```

### Global State (Context API)
```javascript
// App-level state
const [user, setUser] = useState(null);
const [theme, setTheme] = useState('dark');
const [contacts, setContacts] = useState([]);
```

### Persistent State (localStorage)
```javascript
// Persisted state
const [preferences, setPreferences] = useState(() => {
  const saved = localStorage.getItem('preferences');
  return saved ? JSON.parse(saved) : defaultPreferences;
});

useEffect(() => {
  localStorage.setItem('preferences', JSON.stringify(preferences));
}, [preferences]);
```

---

## Data Flow

### Unidirectional Data Flow
```
User Action
    ↓
Event Handler
    ↓
State Update
    ↓
Component Re-render
    ↓
UI Update
```

### Props Flow
```
Parent Component
    ↓
Props (data)
    ↓
Child Component
    ↓
Callbacks (functions)
    ↓
Parent Component
```

### API Flow
```
Frontend
    ↓
HTTP Request (Axios)
    ↓
Backend API
    ↓
Database
    ↓
HTTP Response
    ↓
Frontend Update
```

---

## Component Hierarchy

### Level 1: Root
```
App.js
```

### Level 2: Pages
```
LoginPage.js
SplashScreen.js
ChatHome.js
```

### Level 3: Feature Components
```
StudyMode.js
GameRoom.js
MusicPlayer.js
AIAssistant.js
... (27 more)
```

### Level 4: Sub-components
```
Modal
Form
Button
Input
Card
```

---

## Styling Architecture

### Tailwind CSS Utility Classes
```html
<div className="bg-gray-900 text-white p-4 rounded-lg">
  <h1 className="text-2xl font-bold mb-4">Title</h1>
  <p className="text-gray-300">Description</p>
</div>
```

### CSS Variables for Theming
```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #1f2937;
  --text-color: #ffffff;
  --background-color: #111827;
}

.themed-element {
  background-color: var(--background-color);
  color: var(--text-color);
}
```

### Dark Mode Implementation
```javascript
// Toggle dark mode
function toggleDarkMode() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('darkMode', isDarkMode);
}
```

---

## Error Handling Strategy

### Try-Catch Pattern
```javascript
try {
  const response = await fetchData();
  setData(response);
} catch (error) {
  setError(error.message);
  console.error('Error:', error);
}
```

### Error Boundary Component
```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error);
    this.setState({ hasError: true });
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Validation Pattern
```javascript
function validateInput(input) {
  if (!input.trim()) {
    throw new Error('Input cannot be empty');
  }
  if (input.length < 3) {
    throw new Error('Input must be at least 3 characters');
  }
  return true;
}
```

---

## Performance Optimization

### Code Splitting
```javascript
// Lazy load components
const StudyMode = React.lazy(() => import('./StudyMode'));

<Suspense fallback={<Loading />}>
  <StudyMode />
</Suspense>
```

### Memoization
```javascript
// Prevent unnecessary re-renders
const MemoizedComponent = React.memo(function Component(props) {
  return <div>{props.value}</div>;
});
```

### useCallback Hook
```javascript
// Memoize callbacks
const handleClick = useCallback(() => {
  // Handle click
}, [dependency]);
```

### useMemo Hook
```javascript
// Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

---

## Security Patterns

### Input Validation
```javascript
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

### XSS Prevention
```javascript
// Use textContent instead of innerHTML
element.textContent = userInput; // Safe
element.innerHTML = userInput; // Unsafe
```

### CSRF Protection
```javascript
// Include CSRF token in requests
const headers = {
  'X-CSRF-Token': csrfToken,
  'Content-Type': 'application/json'
};
```

### Password Security
```javascript
// Hash passwords on backend
const hashedPassword = await bcrypt.hash(password, 10);
```

---

## Testing Patterns

### Unit Testing
```javascript
// Test individual components
describe('StudyMode', () => {
  it('should add participant', () => {
    const { getByText } = render(<StudyMode />);
    fireEvent.click(getByText('Add'));
    expect(getByText('Participant')).toBeInTheDocument();
  });
});
```

### Integration Testing
```javascript
// Test component interactions
describe('ChatHome Integration', () => {
  it('should send message and display', () => {
    // Test full flow
  });
});
```

### E2E Testing
```javascript
// Test user workflows
describe('User Registration Flow', () => {
  it('should register and login', () => {
    // Test complete flow
  });
});
```

---

## API Design

### RESTful Endpoints
```
GET    /api/messages           - Get all messages
GET    /api/messages/:id       - Get specific message
POST   /api/messages           - Create message
PUT    /api/messages/:id       - Update message
DELETE /api/messages/:id       - Delete message
```

### Request/Response Format
```javascript
// Request
{
  "type": "text",
  "content": "Hello",
  "recipientId": "user123"
}

// Response
{
  "success": true,
  "data": {
    "id": "msg123",
    "type": "text",
    "content": "Hello",
    "timestamp": "2025-11-24T..."
  }
}
```

### Error Response Format
```javascript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [...]
  }
}
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  username VARCHAR(255) UNIQUE,
  avatar VARCHAR(255),
  bio TEXT,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id INT PRIMARY KEY,
  senderId INT,
  receiverId INT,
  content TEXT,
  type VARCHAR(50),
  timestamp TIMESTAMP,
  isRead BOOLEAN,
  FOREIGN KEY (senderId) REFERENCES users(id),
  FOREIGN KEY (receiverId) REFERENCES users(id)
);
```

### Contacts Table
```sql
CREATE TABLE contacts (
  id INT PRIMARY KEY,
  userId INT,
  contactId INT,
  name VARCHAR(255),
  isBlocked BOOLEAN,
  createdAt TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (contactId) REFERENCES users(id)
);
```

---

## Deployment Architecture

### Frontend Deployment
```
Source Code (GitHub)
    ↓
Build Process (npm run build)
    ↓
Optimized Bundle
    ↓
CDN (Netlify/Vercel)
    ↓
User Browser
```

### Backend Deployment
```
Source Code (GitHub)
    ↓
Build Process (mvn clean package)
    ↓
JAR File
    ↓
Server (Heroku/AWS)
    ↓
API Endpoint
```

### Database Deployment
```
SQLite (Development)
    ↓
PostgreSQL (Production)
    ↓
Cloud Database (AWS RDS)
    ↓
Backup & Replication
```

---

## Scalability Considerations

### Horizontal Scaling
- Load balancing
- Multiple server instances
- Database replication
- CDN for static assets

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Cache frequently accessed data
- Compress responses

### Caching Strategy
- Browser caching
- Server-side caching (Redis)
- CDN caching
- Database query caching

---

## Monitoring & Logging

### Application Logging
```javascript
console.log('Info:', message);
console.warn('Warning:', message);
console.error('Error:', message);
```

### Performance Monitoring
```javascript
// Measure component render time
const start = performance.now();
// Component logic
const end = performance.now();
console.log(`Render time: ${end - start}ms`);
```

### Error Tracking
```javascript
// Send errors to monitoring service
try {
  // Code
} catch (error) {
  trackError(error);
}
```

---

## Best Practices

### Code Organization
- ✅ Separate concerns
- ✅ Single responsibility
- ✅ DRY (Don't Repeat Yourself)
- ✅ KISS (Keep It Simple, Stupid)

### Naming Conventions
- ✅ Descriptive names
- ✅ camelCase for variables
- ✅ PascalCase for components
- ✅ UPPER_CASE for constants

### File Structure
- ✅ Organized by feature
- ✅ Clear directory hierarchy
- ✅ Related files together
- ✅ Utility files separate

### Documentation
- ✅ Code comments
- ✅ JSDoc comments
- ✅ README files
- ✅ API documentation

---

## Summary

### Architecture Highlights
✅ Component-based architecture
✅ Unidirectional data flow
✅ Separation of concerns
✅ Reusable components
✅ Scalable design

### Design Patterns Used
✅ 10+ design patterns
✅ Best practices followed
✅ Clean code principles
✅ SOLID principles
✅ DRY principle

### Performance
✅ Optimized bundle size
✅ Lazy loading
✅ Memoization
✅ Code splitting
✅ Caching strategies

### Security
✅ Input validation
✅ XSS prevention
✅ CSRF protection
✅ Password hashing
✅ Secure storage

---

**Status:** 🟢 PRODUCTION READY

Architecture designed for scalability, maintainability, and performance!
