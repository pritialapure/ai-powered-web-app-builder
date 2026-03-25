# 🏗️ NxtBuild Architecture & Data Flow

Complete visual overview of how NxtBuild works.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NxtBuild System                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────────┐              ┌─────────────────────────┐  │
│  │  Frontend (React)    │              │   Backend (Express)      │  │
│  │  Port: 5173          │◄────HTTP────►│   Port: 5000            │  │
│  │  ┌────────────────┐  │   /api/*     │                         │  │
│  │  │ Pages          │  │              │  ┌────────────────────┐ │  │
│  │  │ • Landing      │  │              │  │ Routes             │ │  │
│  │  │ • Login        │  │              │  │ • /auth/*          │ │  │
│  │  │ • Dashboard    │  │              │  │ • /projects/*      │ │  │
│  │  │ • Builder      │  │              │  │ • /generate/*      │ │  │
│  │  └────────────────┘  │              │  └────────────────────┘ │  │
│  │                      │              │                         │  │
│  │  ┌────────────────┐  │              │  ┌────────────────────┐ │  │
│  │  │ Context        │  │              │  │ Controllers        │ │  │
│  │  │ • Auth         │  │              │  │ • Auth             │ │  │
│  │  │ • Toast        │  │              │  │ • Project          │ │  │
│  │  └────────────────┘  │              │  │ • Generation       │ │  │
│  │                      │              │  └────────────────────┘ │  │
│  │  ┌────────────────┐  │              │         ▲               │  │
│  │  │ Components     │  │              │         │               │  │
│  │  │ • Chat         │  │              │  ┌──────▼────────────┐  │  │
│  │  │ • Preview      │  │              │  │ Services           │  │  │
│  │  │ • CodeEditor   │  │              │  │ • Auth             │  │  │
│  │  │ • Navbar       │  │              │  │ • Project          │  │  │
│  │  └────────────────┘  │              │  │ • Generation       │  │  │
│  │                      │              │  │ • Gemini AI        │  │  │
│  │  ┌────────────────┐  │              │  └──────┬────────────┘  │  │
│  │  │ Services       │  │              │         │               │  │
│  │  │ • API calls    │  │              │  ┌──────▼────────────┐  │  │
│  │  │ • Auth         │  │              │  │ Models             │  │  │
│  │  │ • Projects     │  │              │  │ • User             │  │  │
│  │  │ • Generation   │  │              │  │ • Project          │  │  │
│  │  └────────────────┘  │              │  └────────────────────┘  │  │
│  └──────────────────────┘              └─────────────────────────┘  │
│                                                 │                    │
│                                                 │                    │
│                                        ┌────────▼────────────┐     │
│                                        │ External Services    │     │
│                                        ├──────────────────────┤     │
│                                        │ • MongoDB Atlas      │     │
│                                        │ • Google Gemini AI   │     │
│                                        │ • JWT Tokens         │     │
│                                        │ • bcryptjs hashing   │     │
│                                        └──────────────────────┘     │
│                                                                      │
└────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

```
┌─────────────────┐
│  User Sign Up   │
└────────┬────────┘
         │
         ▼
   ┌─────────────────────────────┐
   │ Frontend: LoginPage          │
   │ • Collect: name, email, pwd │
   └──────────┬──────────────────┘
              │
              │ POST /api/auth/register
              ▼
   ┌─────────────────────────────┐
   │ Backend: registerUser()      │
   │ • Validate input            │
   │ • Check email exists        │
   └──────────┬──────────────────┘
              │
              ▼
   ┌─────────────────────────────┐
   │ Auth Service: register()    │
   │ • Hash password (bcryptjs)  │
   │ • Create user in DB         │
   │ • Generate JWT token        │
   └──────────┬──────────────────┘
              │
              ▼
   ┌─────────────────────────────┐
   │ Response to Frontend         │
   │ { token, user }             │
   └──────────┬──────────────────┘
              │
              ▼
   ┌─────────────────────────────┐
   │ Frontend: Save Token         │
   │ • Store in cookies (7 days) │
   │ • Set AuthContext user      │
   │ • Redirect to dashboard     │
   └─────────────────────────────┘
```

---

## Project Creation Flow

```
┌──────────────────────────────┐
│ User clicks "+ New Project"  │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Frontend: createProject()            │
│ POST /api/projects { title }         │
│ Include: Authorization header        │
└────────────┬───────────────────────┬─┘
             │                       │
             │                       ▼
             │         ┌──────────────────────────────┐
             │         │ Backend: Auth Middleware      │
             │         │ • Verify JWT token           │
             │         │ • Extract user ID            │
             │         │ • Attach to req.user         │
             │         └────────────┬─────────────────┘
             │                      │
             ▼                      ▼
┌──────────────────────────────────────────────────┐
│ Backend: createProject()                          │
│ • Create Project document in MongoDB             │
│ • Set userId from req.user.id                    │
│ • Initialize: title, messages[], code='', ...    │
│ • Save to database                               │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│ Response to Frontend                              │
│ { _id, title, messages, generatedCode, ... }    │
└──────────────┬───────────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────────┐
│ Frontend:                                         │
│ • Add project to state                           │
│ • Navigate to /builder/:projectId                │
│ • Open BuilderPage                               │
└──────────────────────────────────────────────────┘
```

---

## Code Generation Flow

```
┌──────────────────────────────────────────┐
│ User enters prompt in chat & clicks Send │
└─────────────┬────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ Frontend: handleSend(prompt)                     │
│ • Add user message to local state               │
│ • Show loading indicator                        │
│ • POST /api/generate/:projectId { prompt }     │
└─────────────┬────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ Backend: generateCode()                          │
│ • Verify authentication                         │
│ • Validate prompt not empty                     │
│ • Extract projectId & userId                    │
└─────────────┬────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ Generation Service: generateCode()               │
│ • Load project from DB                          │
│ • Build full prompt:                            │
│   - System prompt                               │
│   - Last 10 messages (context)                  │
│   - Current code (if editing)                   │
│   - User's new prompt                           │
└─────────────┬────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ Gemini Service: askGemini(fullPrompt)            │
│ • Send prompt to Google Gemini AI               │
│ • Call Google Gemini API                        │
│ • Wait for response                             │
└─────────────┬────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ Parse AI Response                                │
│ • Extract markdown code block (```html)         │
│ • Separate description from code                │
│ • Return { code, description }                  │
└─────────────┬────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ Save to MongoDB                                  │
│ • Add user message to messages[]                │
│ • Add AI message to messages[]                  │
│ • Archive old code to versions[]                │
│ • Update generatedCode with new code            │
│ • Set title from first user message             │
│ • Save project document                         │
└─────────────┬────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ Response to Frontend                             │
│ { message, code }                               │
└─────────────┬────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────────────────┐
│ Frontend: Display Results                        │
│ • Add AI message to chat                        │
│ • Update code state                             │
│ • Render in LivePreview iframe                  │
│ • Remove loading indicator                      │
│ • User sees working app!                        │
└──────────────────────────────────────────────────┘
        │
        ▼ (User can refine)
   ┌─────────────┐
   │  Repeat for │
   │  refinement │
   └─────────────┘
```

---

## Data Models

### User Schema
```
User {
  _id: ObjectId (unique)
  name: String (required)
  email: String (required, unique)
  password: String (hashed, required)
  lastLogin: Date
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Project Schema
```
Project {
  _id: ObjectId (unique)
  userId: String (required, links to User)
  title: String
  description: String
  messages: [
    {
      role: "user" | "assistant"
      content: String
      timestamp: Date
    }
  ]
  generatedCode: String (HTML/CSS/JS)
  versions: [
    {
      code: String
      createdAt: Date
    }
  ]
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

---

## Request/Response Cycle

```
┌─────────────────────────────────────────────────┐
│  Frontend (React)                               │
│                                                  │
│  1. User Action                                 │
│     (click, type, submit)                       │
│     │                                           │
│     ▼                                           │
│  2. Event Handler                              │
│     (onClick, onChange, onSubmit)              │
│     │                                           │
│     ▼                                           │
│  3. API Call via axios                         │
│     (with Authorization header)                │
│     │                                           │
└─────┼───────────────────────────────────────────┘
      │
      │  HTTP Request
      │  POST /api/endpoint
      │  Authorization: Bearer <token>
      │  Content-Type: application/json
      │  { ...payload }
      │
      ▼
┌──────────────────────────────────────────────────┐
│  Network Layer                                    │
│  (Express CORS middleware)                       │
│  ✓ Allow origin                                 │
│  ✓ Preflight requests                           │
└──────┬───────────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│  Backend (Express)                                │
│                                                   │
│  1. Route Matching                              │
│     (find matching route handler)               │
│     │                                           │
│     ▼                                           │
│  2. Middleware Chain                           │
│     • body parser (extract JSON)                │
│     • auth middleware (verify JWT)              │
│     • validation                                │
│     │                                           │
│     ▼                                           │
│  3. Controller Function                         │
│     (parse request, call service)               │
│     │                                           │
│     ▼                                           │
│  4. Service Layer                              │
│     (business logic, DB queries)                │
│     │                                           │
│     ▼                                           │
│  5. Database (MongoDB)                         │
│     (read/write documents)                      │
│     │                                           │
│     ▼                                           │
│  6. Format Response                            │
│     {                                           │
│       success: true,                            │
│       data: { ... }                             │
│     }                                           │
└──────┬───────────────────────────────────────────┘
       │
       │  HTTP Response (200, 201, 400, 401, etc)
       │  Content-Type: application/json
       │  { "success": true, "data": {...} }
       │
       ▼
┌─────────────────────────────────────────────────┐
│  Frontend (React)                               │
│                                                  │
│  1. Axios intercepts response                  │
│  2. handleSuccess() if success:true            │
│  3. Update component state                     │
│  4. Re-render UI with new data                 │
│  5. User sees result                           │
└─────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App
├── Routes
│   ├── Route: /  (Landing)
│   │   └── LandingPage
│   │       ├── FeatureCard
│   │       └── FeatureCard
│   │
│   ├── Route: /login (Login/Signup)
│   │   └── LoginPage
│   │
│   ├── Route: /dashboard (Protected)
│   │   ├── ProtectedRoute
│   │   │   ├── Navbar
│   │   │   └── DashboardPage
│   │   │       ├── ProjectCard
│   │   │       ├── ProjectCard
│   │   │       └── ProjectCard
│   │   │
│   │   └── Navbar (shown on all protected pages)
│   │
│   └── Route: /builder/:projectId (Protected)
│       ├── ProtectedRoute
│       │   ├── Navbar
│       │   └── BuilderPage
│       │       ├── ChatMessage
│       │       ├── ChatMessage
│       │       ├── ChatInput
│       │       ├── LivePreview
│       │       └── CodeEditor
```

---

## State Management

```
AuthContext
├── Providers
│   ├── User data when logged in
│   ├── Loading state
│   └── Login/logout functions
│
└── Consumers
    ├── App (for routing)
    ├── Navbar (for user info)
    ├── LoginPage (for auth)
    └── ProtectedRoute (for access control)

ToastContext
├── Providers
│   ├── Toast message
│   ├── Toast type (success/error)
│   └── showToast() function
│
└── Consumers
    ├── All pages (for notifications)
    ├── All services (for feedback)
    └── Layout (for display)
```

---

## API Communication Layers

```
Component
    │
    └──► Service (authService.js, projectService.js, etc)
         └──► API Client (api.js with axios)
              ├── Headers (Authorization: Bearer token)
              ├── Base URL (http://localhost:5000/api)
              └── HTTP Methods (GET, POST, PUT, DELETE)
                   │
                   └──► Express Backend
                        ├── Routes (match URL pattern)
                        ├── Middleware (auth, validation)
                        ├── Controllers (handle request)
                        ├── Services (business logic)
                        └── Models (MongoDB)
```

---

## Security Layers

```
┌─────────────────────────────────────┐
│  1. Data in Transit (HTTPS)         │
│     • Encrypt with SSL/TLS          │
│     • Prevent man-in-the-middle     │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  2. Authentication (JWT)            │
│     • Signed token in cookies       │
│     • Verify on every request       │
│     • Expires in 7 days             │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  3. Password Hashing (bcryptjs)     │
│     • Salt rounds: 10               │
│     • Never store plain text        │
│     • Compare on login              │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  4. Data Isolation                  │
│     • User-specific queries         │
│     • userId in request             │
│     • MongoDB index on userId       │
└─────────────────────────────────────┘
```

---

## Deployment Architecture (Example)

```
┌─────────────────────────────────────────────────────┐
│         Production Environment                       │
│                                                      │
│  ┌────────────────────┐     ┌───────────────────┐  │
│  │  Git Repository    │     │  GitHub Actions   │  │
│  │  (Source Code)     │────►│  (CI/CD Pipeline) │  │
│  └────────────────────┘     └──────┬────────────┘  │
│                                     │                │
│                    ┌────────────────┴────┬──────┐   │
│                    │                     │      │   │
│                    ▼                     ▼      ▼   │
│            ┌────────────────┐  ┌──────────────────┐ │
│            │  Frontend      │  │  Backend          │ │
│            │  (Vercel)      │  │  (Render/Railway) │ │
│            │  dist/ folder  │  │  Node.js + npm    │ │
│            │  Vite build    │  │  start script     │ │
│            └────────────────┘  └──────────────────┘ │
│                  │                       │           │
│                  │                       ▼           │
│                  │              ┌──────────────────┐ │
│                  │              │  MongoDB Atlas   │ │
│                  │              │  (Cloud Database)│ │
│                  │              └──────────────────┘ │
│                  │                                   │
│                  └─────────────.env──────────────┐   │
│                      (Environment Variables)     │   │
│                      • MONGODB_URI               │   │
│                      • GEMINI_API_KEY            │   │
│                      • JWT_SECRET                │   │
│                                                  │   │
│                     External APIs               │   │
│                      • Google Gemini AI         │   │
│                      • MongoDB Atlas            │   │
└────────────────────────────────────────────────┘    │
```

---

## Performance Optimization

```
Frontend Optimizations
├── React.memo (prevent re-renders)
├── useCallback (memoize functions)
├── useEffect dependencies
├── Lazy loading routes
├── Code splitting with Vite
└── CSS optimization (minimize selectors)

Backend Optimizations
├── MongoDB connection pooling
├── Query indexing (email, userId)
├── Middleware order (fail fast)
├── Error handling (avoid stack traces)
├── JWT caching
└── Service layer reuse

Network Optimizations
├── CORS headers
├── Compression (gzip)
├── Caching headers
├── Minimize payload size
└── HTTP/2 multiplexing
```

---

## Scalability Considerations

```
Current Architecture (Single User)
│
├─ Can scale horizontally:
│  ├─ Load balancer (Nginx, HAProxy)
│  ├─ Multiple backend instances
│  ├─ Session store (Redis)
│  └─ MongoDB replica set
│
├─ Database scaling:
│  ├─ Indexing strategy
│  ├─ Query optimization
│  ├─ Sharding for large datasets
│  └─ Read replicas
│
└─ Frontend scaling:
   ├─ CDN for static files
   ├─ Edge caching
   ├─ Lazy loading
   └─ Code-splitting
```

---

**This architecture provides a solid foundation for a modern web application with authentication, database, and AI integration!** 🚀
