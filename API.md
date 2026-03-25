# NxtBuild API Documentation

Complete API reference for NxtBuild backend endpoints.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All requests (except auth endpoints) require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are obtained from login/register and stored in cookies automatically by the frontend.

---

## 🔐 Authentication Endpoints

### POST /auth/register
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "65abc123def456",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error (409 Conflict):**
```json
{
  "success": false,
  "message": "Email already registered."
}
```

---

### POST /auth/login
Authenticate with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "65abc123def456",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password."
}
```

---

### GET /auth/me
Get current authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "65abc123def456",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Please log in to access this route."
}
```

---

### POST /auth/logout
Logout the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

## 📁 Project Endpoints

### GET /projects
List all projects for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters (optional):**
- None currently

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65abc123def456",
      "userId": "65abc123def456",
      "title": "My Portfolio",
      "description": "",
      "messages": [],
      "generatedCode": "<html>...</html>",
      "versions": [],
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

### POST /projects
Create a new project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "My New Project"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123def456",
    "userId": "65abc123def456",
    "title": "My New Project",
    "description": "",
    "messages": [],
    "generatedCode": "",
    "versions": [],
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

---

### GET /projects/:id
Get a specific project by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Project ID (MongoDB ObjectId)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123def456",
    "userId": "65abc123def456",
    "title": "My Portfolio",
    "description": "A portfolio website",
    "messages": [
      {
        "role": "user",
        "content": "Build a portfolio landing page",
        "timestamp": "2025-01-15T10:30:00Z"
      },
      {
        "role": "assistant",
        "content": "I've created a beautiful portfolio...",
        "timestamp": "2025-01-15T10:31:00Z"
      }
    ],
    "generatedCode": "<html>...</html>",
    "versions": [
      {
        "code": "<html>...</html>",
        "createdAt": "2025-01-15T10:30:00Z"
      }
    ],
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:31:00Z"
  }
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Project not found."
}
```

---

### PUT /projects/:id
Update a project.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Project ID

**Request Body (any field):**
```json
{
  "title": "Updated Title",
  "description": "New description",
  "messages": [...],
  "generatedCode": "<html>...</html>"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "65abc123def456",
    "userId": "65abc123def456",
    "title": "Updated Title",
    "description": "New description",
    ...
  }
}
```

---

### DELETE /projects/:id
Delete a project permanently.

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Project ID

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Project deleted successfully."
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Project not found."
}
```

---

## 🤖 Code Generation Endpoint

### POST /generate/:projectId
Generate or refine code using AI.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**URL Parameters:**
- `projectId` - Project ID to generate code for

**Request Body:**
```json
{
  "prompt": "Make the header section have a dark blue background"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": {
      "role": "assistant",
      "content": "I've updated the header with a dark blue background..."
    },
    "code": "<html><head><style>...header { background-color: #003366; }...</style></head><body>...</body></html>"
  }
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "message": "Please describe what you want to build."
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Project not found."
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Please log in to access this route."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error."
}
```

---

## Rate Limiting

Currently no rate limiting is applied. In production, consider implementing:
- 100 requests per minute per IP
- 10 code generation requests per hour per user
- Login attempt rate limiting

---

## Request Examples

### Using curl

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get Projects (with token)
curl -X GET http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create Project
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"title": "My Project"}'

# Generate Code
curl -X POST http://localhost:5000/api/generate/PROJECT_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Build a simple counter app"}'
```

### Using JavaScript/Fetch

```javascript
// Register
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});
const data = await response.json();
console.log(data);
```

---

## Data Models

### User
```javascript
{
  _id: ObjectId,
  name: String,         // Required
  email: String,        // Required, Unique
  password: String,     // Hashed with bcryptjs
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```javascript
{
  _id: ObjectId,
  userId: String,       // Reference to User (required)
  title: String,        // Default: "Untitled Project"
  description: String,
  messages: [
    {
      role: String,     // "user" or "assistant"
      content: String,
      timestamp: Date
    }
  ],
  generatedCode: String,
  versions: [
    {
      code: String,
      createdAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

---

## Best Practices

1. **Always include Authorization header** for protected endpoints
2. **Validate input** on the frontend before sending
3. **Handle errors gracefully** - frontend should display user-friendly messages
4. **Cache responses** when appropriate to reduce API calls
5. **Keep prompts concise** - AI works best with clear, specific requests
6. **Save project state** after generation to avoid data loss

---

**Last Updated:** January 2025
