# AlgoZen Deployment Guide

This guide covers deploying AlgoZen to production using Vercel (frontend) and Render (backend).

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available)
- MongoDB Atlas account (free tier available)
- Clerk account for authentication
- Groq API key for AI features

## Quick Deploy

### 1. Deploy Frontend to Vercel

**Option A: Using Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
cd algozen
vercel --prod
```

**Option B: Using Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository: `https://github.com/rudraksha127/lucky_vv7fub.git`
4. Configure the project:
   - **Root Directory**: `algozen`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `client/.next`
   - **Install Command**: `cd client && npm install`
5. Add environment variables (see below)
6. Click "Deploy"

### 2. Deploy Backend to Render

**Option A: Using Render Dashboard**
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `algozen-api`
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: `algozen/server`
5. Add environment variables (see below)
6. Click "Create Web Service"

**Option B: Using Render CLI**
```bash
# Install Render CLI
npm install -g @render-cloud/cli

# Login
render login

# Deploy using render.yaml
cd algozen
render up
```

## Environment Variables

### Frontend (Vercel)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (e.g., `https://algozen-api.onrender.com`) |
| `VITE_SOCKET_URL` | WebSocket URL (same as API URL) |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |

### Backend (Render)
| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT tokens (generate a strong random string) |
| `ADMIN_KEY` | Admin authentication key |
| `CLIENT_URL` | Frontend URL (e.g., `https://algozen.vercel.app`) |
| `GROQ_API_KEY` | Groq API key for AI features |
| `CLERK_SECRET_KEY` | Clerk secret key |

## MongoDB Setup

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get the connection string (use SRV format)
3. Replace `<password>` with your database user password
4. Add as `MONGODB_URI` environment variable

## Clerk Authentication Setup

1. Create an account at [Clerk](https://clerk.com)
2. Create a new application
3. Get the **Publishable Key** (for frontend)
4. Get the **Secret Key** (for backend)
5. Configure allowed domains and redirect URLs

## Post-Deployment

### 1. Update API URLs
After deploying the backend, update the frontend environment variables with the backend URL.

### 2. Configure CORS
The backend is configured to allow requests from the frontend URL. Update `server/src/app.js` if needed.

### 3. Set up Custom Domain (Optional)
- **Vercel**: Go to Project Settings → Domains
- **Render**: Go to Service → Settings → Custom Domain

## Monitoring

### Frontend (Vercel)
- View deployment logs in Vercel dashboard
- Check Analytics in Project Settings

### Backend (Render)
- View logs in Render dashboard
- Monitor resource usage
- Set up alerts for errors

## Troubleshooting

### Build Failures
1. Check the build logs for specific errors
2. Ensure all dependencies are listed in package.json
3. Verify Node.js version compatibility

### Runtime Errors
1. Check environment variables are set correctly
2. Verify database connection string
3. Check CORS configuration

### Performance Issues
1. Enable caching in Vercel
2. Use MongoDB indexes for database queries
3. Consider upgrading to paid tier for more resources

## Local Development

```bash
# Install dependencies
cd algozen/client && npm install
cd ../server && npm install

# Start backend (port 5000)
cd server && npm start

# Start frontend (port 3001)
cd client && npm run dev
```

## Support

For issues:
- GitHub Issues: [rudraksha127/lucky_vv7fub](https://github.com/rudraksha127/lucky_vv7fub/issues)
- Documentation: Check the main README.md