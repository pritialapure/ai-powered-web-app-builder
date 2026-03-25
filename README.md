# NxtBuild - AI-Powered Web App Builder

**Transform Ideas into Working Apps Instantly**

NxtBuild is a full-stack web application that leverages Google's Gemini AI to generate complete, functional web applications from natural language descriptions. Built with a modern MERN stack (MongoDB, Express, React, Node.js), NxtBuild bridges the gap between having an idea and having a working app.

## 🚀 Features

- **User Authentication**: Secure registration and login with JWT tokens
- **Project Management**: Create, view, rename, and delete web app projects
- **AI Code Generation**: Generate complete HTML/CSS/JavaScript apps from natural language using Gemini AI
- **Chat Interface**: Conversational UI for describing and iteratively refining apps
- **Live Preview**: See generated apps rendered in real-time inside an iframe
- **Code Editor**: View and edit the generated source code
- **Code Download**: Download generated code as a standalone HTML file
- **Responsive Design**: Works seamlessly across desktop and tablet devices

## 📋 Prerequisites

Before getting started, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB Atlas Account** - [Free tier available](https://www.mongodb.com/cloud/atlas)
- **Google Gemini API Key** - [Get it here](https://ai.google.dev/)
- **VS Code** (recommended)

## 📁 Project Structure

```
ai_powered_web_app_builder/
├── server/                          # Express Backend
│   ├── server.js                    # Entry point
│   ├── package.json
│   ├── .env                         # Environment variables
│   └── src/
│       ├── app.js                   # Express app setup
│       ├── config/
│       │   ├── db.config.js         # MongoDB connection
│       │   └── gemini.config.js     # Gemini AI client
│       ├── constants/
│       │   └── prompts.js           # AI system prompts
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── project.controller.js
│       │   └── generation.controller.js
│       ├── middleware/
│       │   ├── auth.middleware.js
│       │   └── error.middleware.js
│       ├── models/
│       │   ├── User.model.js
│       │   └── Project.model.js
│       ├── routes/
│       │   ├── index.js
│       │   ├── auth.routes.js
│       │   ├── project.routes.js
│       │   └── generation.routes.js
│       ├── services/
│       │   ├── auth.service.js
│       │   ├── project.service.js
│       │   ├── generation.service.js
│       │   └── gemini.service.js
│       └── utils/
│           ├── jwt.utils.js
│           └── code.utils.js
├── client/                          # React Frontend
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── FeatureCard.jsx
│       │   ├── ChatMessage.jsx
│       │   ├── ChatInput.jsx
│       │   ├── CodeEditor.jsx
│       │   ├── LivePreview.jsx
│       │   ├── ProjectCard.jsx
│       │   ├── Navbar.jsx
│       │   └── ProtectedRoute.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── ToastContext.jsx
│       ├── pages/
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── DashboardPage.jsx
│       │   └── BuilderPage.jsx
│       ├── services/
│       │   ├── api.js
│       │   ├── authService.js
│       │   ├── projectService.js
│       │   └── generationService.js
│       └── styles/
│           ├── landing.css
│           ├── login.css
│           ├── dashboard.css
│           ├── builder.css
│           └── navbar.css
```

## 🔧 Installation & Setup

### Step 1: Clone or Download the Repository

```bash
cd ai_powered_web_app_builder
```

### Step 2: Set Up Environment Variables

Navigate to the server directory and update the `.env` file with your credentials:

```bash
cd server
# Edit .env file with your values
```

**Required Environment Variables:**

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | Any random secret string (e.g., `my_super_secret_key_123`) |
| `GEMINI_API_KEY` | Your Google Gemini API key |
| `PORT` | Server port (default: 5000) |
| `CLIENT_URL` | Frontend URL (default: http://localhost:5173) |

### Step 3: Install Server Dependencies

```bash
cd server
npm install
```

**Key dependencies:**
- `express` - Web framework
- `mongoose` - MongoDB object modeling
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `@google/genai` - Google Gemini AI SDK
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### Step 4: Install Client Dependencies

```bash
cd client
npm install
```

**Key dependencies:**
- `react` - UI library
- `react-router-dom` - Client-side routing
- `axios` - HTTP client
- `js-cookie` - Cookie management
- `vite` - Build tool

### Step 5: Start the Application

#### Terminal 1 - Start Backend Server:

```bash
cd server
npm run dev
```

The server will run on `http://localhost:5000`

#### Terminal 2 - Start Frontend Dev Server:

```bash
cd client
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📖 How to Use

### 1. **Landing Page**
   - Visit `http://localhost:5173`
   - See the marketing landing page introducing NxtBuild
   - Click "Get Started" to begin

### 2. **Sign Up / Login**
   - Create a new account with your email and password
   - Or log in with existing credentials
   - JWT tokens are stored securely in cookies (7-day expiry)

### 3. **Dashboard**
   - View all your projects
   - Click "+ New Project" to create a new web app project
   - Click on a project card to open it in the builder
   - Delete projects you no longer need

### 4. **Builder Interface**
   - **Left Panel (Chat)**:
     - Type descriptions of what you want to build
     - Click "Send" or press Enter to generate code
     - See Gemini AI's responses in real-time
     - Try suggestion chips for quick starts
   
   - **Right Panel (Preview & Code)**:
     - **Preview Tab**: See your app running live in an iframe
     - **Code Tab**: View or edit the generated HTML/CSS/JavaScript
     - **Download Button**: Save your app as a `.html` file
   
   - **Project Title**: Click to rename your project

### 5. **Tips for Best Results**

- Be specific: "Build a responsive portfolio landing page with a hero section, about section, and contact form"
- Ask for refinements: "Change the button color to blue" or "Add a footer section"
- Request features: "Add a working calculator" or "Create a to-do list with add/delete functionality"
- Use conversation history: The AI remembers what you've built so far

## 🔐 Authentication Flow

```
User Registration
    ↓
Password Hashed (bcryptjs)
    ↓
User Stored in MongoDB
    ↓
JWT Token Generated
    ↓
Token Sent to Frontend
    ↓
Token Stored in Secure Cookies
    ↓
Token Sent with Every Request (Authorization Header)
    ↓
Middleware Verifies Token
    ↓
Request Proceeds (or 401 Unauthorized)
```

## 🧠 How AI Code Generation Works

1. **User sends prompt** → "Build a portfolio landing page"
2. **Build context** → Include conversation history + current code (if editing)
3. **Call Gemini AI** → Send full prompt to Google's Gemini model
4. **Parse response** → Extract HTML code from AI's markdown response
5. **Save to database** → Store messages, code, and versions
6. **Display preview** → Render HTML in iframe
7. **User refines** → Continue conversation to improve the app

## 🎨 Technology Stack

### Frontend
- **React 19** - UI component library
- **Vite** - Lightning-fast dev build tool
- **React Router DOM** - Client-side routing
- **Axios** - HTTP requests
- **js-cookie** - Cookie management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Google Gemini AI** - Code generation engine
- **bcryptjs** - Password hashing
- **JWT** - Authentication tokens

## 📝 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Create new account
- `POST /login` - Login with email/password
- `GET /me` - Get current user (requires auth)
- `POST /logout` - Logout (requires auth)

### Project Routes (`/api/projects`)
- `GET /` - Get all user projects (requires auth)
- `POST /` - Create new project (requires auth)
- `GET /:id` - Get specific project (requires auth)
- `PUT /:id` - Update project (requires auth)
- `DELETE /:id` - Delete project (requires auth)

### Generation Routes (`/api/generate`)
- `POST /:projectId` - Generate/refine code with AI (requires auth)

## 🐛 Troubleshooting

### "MongoDB connection failed"
- Verify your `MONGODB_URI` in `.env` is correct
- Check MongoDB Atlas IP whitelist includes your machine
- Ensure cluster is active

### "Gemini API error"
- Verify your `GEMINI_API_KEY` is valid and active
- Check you haven't exceeded API quotas
- Ensure the key has appropriate permissions

### "CORS error"
- Make sure `CLIENT_URL` in `.env` matches your frontend URL
- Verify frontend is running on correct port

### "Token not recognized"
- Clear cookies and refresh
- Log out and log back in
- Check JWT_SECRET hasn't changed

## 🚢 Deployment

### Deploy Backend (Heroku, Railway, Render)

1. Set environment variables on hosting platform
2. Push code to Git repository
3. Connect repository to hosting service
4. Deploy automatically on push

### Deploy Frontend (Vercel, Netlify)

1. Build production bundle: `npm run build`
2. Deploy the `dist` folder
3. Set API endpoint environment variable pointing to backend

## 📚 Additional Resources

- [Google Gemini AI Documentation](https://ai.google.dev/)
- [MongoDB Atlas Guide](https://docs.mongodb.com/atlas/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [JWT.io](https://jwt.io/)

## 🛠️ Future Enhancements

- [ ] Version history with restore functionality
- [ ] Shareable public URLs for generated apps
- [ ] Prompt templates for common app types
- [ ] Code syntax highlighting in editor
- [ ] Team collaboration
- [ ] API integration examples
- [ ] Mobile app builder
- [ ] Custom domain hosting

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and enhancement requests.

## 💬 Support

For issues, questions, or feedback, please create an issue in the repository or contact the development team.

---

**Happy Building! 🚀**

Transform your ideas into working web apps in seconds with NxtBuild.
