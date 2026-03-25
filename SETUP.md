# 🚀 Quick Start Guide - NxtBuild Setup

Follow these steps to get NxtBuild running locally in 10 minutes.

## Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (free tier works)
- Google Gemini API key

## Step 1: Get Your MongoDB Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or log in
3. Create a new cluster (free tier: M0)
4. Click "Connect" on your cluster
5. Choose "Drivers" → "Node.js"
6. Copy the connection string
7. Replace `<username>` and `<password>` with your database credentials

Example: `mongodb+srv://user:password@cluster0.abcd.mongodb.net/nxtbuild`

## Step 2: Get Your Google Gemini API Key

1. Go to [Google AI Studio](https://ai.google.dev/)
2. Click "Get API Key"
3. Create a new API key in Google Cloud
4. Copy the API key

## Step 3: Configure Environment Variables

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxx.mongodb.net/nxtbuild
JWT_SECRET=your_random_secret_key_123_change_this
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

⚠️ **Never commit .env to git!** Add it to .gitignore

## Step 4: Install Dependencies

```bash
# Terminal 1 - Backend
cd server
npm install

# Terminal 2 - Frontend  
cd client
npm install
```

## Step 5: Start the Application

```bash
# Terminal 1 - Backend (from server directory)
npm run dev
# Output: Server is running on port 5000

# Terminal 2 - Frontend (from client directory)
npm run dev
# Output: Local: http://localhost:5173
```

## Step 6: Open in Browser

1. Visit `http://localhost:5173`
2. Click "Get Started"
3. Sign up with any email/password
4. Start building!

## Example First App

Try these prompts to test:

- "Build a simple to-do list app with add and delete buttons"
- "Create a weather app that shows current conditions"
- "Make a portfolio landing page for a photographer"
- "Build a contact form with validation"

## Troubleshooting

### Port Already in Use
```bash
# Change port in server/.env or run frontend on different port:
npm run dev -- --port 3000
```

### MongoDB Connection Error
- Check MONGODB_URI is correct
- Add your IP to MongoDB Atlas whitelist
- Reset username/password if needed

### Gemini API Error
- Verify API key is valid
- Check quotas/billing in Google Cloud
- Ensure API is enabled

### CORS Error
- Restart backend server
- Check CLIENT_URL matches frontend URL

## Popular Gemini Models

- `gemini-2.5-flash` (default, fastest) - Recommended for code generation
- `gemini-1.5-pro` - More capable, slower
- `gemini-1.5-flash` - Lower cost, good for simple tasks

## Next Steps

- Create your first project
- Explore prompt examples in the builder
- Try refining generated code through conversation
- Download your app as HTML

## Support

Need help?
- Check the main README.md
- Review API endpoint documentation
- Check browser console for errors
- Review server logs in terminal

---

**You're all set! Happy building! 🎉**
