# Threadly - Frontend

Frontend application for **Threadly**, a modern full-stack social media platform inspired by Threads/Twitter.

Built using **React + Vite**, this frontend delivers a fast, responsive, and interactive user experience with modern UI architecture and optimized API communication.

---

# Live Deployment

## Frontend (Vercel)

https://social-media-app-threadly.vercel.app/

---

# Features

- Modern Responsive UI
- Authentication & Protected Routes
- User Profiles & Follow System
- Create Posts with Images
- Like, Bookmark & Comment Features
- Nested Comment Replies
- Direct Messaging (DMs)
- Share Posts in Chats
- Notification System
- Optimistic UI Updates
- Axios Interceptors for Secure API Handling
- Context API State Management

---

# Tech Stack

## Frontend
- React.js
- Vite

## Styling
- Tailwind CSS

## Routing
- React Router DOM

## API Communication
- Axios

## State Management
- React Context API

---

# Folder Structure

```bash
Threadly-Frontend/
│
├── public/                # Static public assets
├── src/
│   ├── api/               # Axios instances & API wrappers
│   ├── assets/            # Images & SVG assets
│   ├── components/        # Reusable UI components
│   ├── context/           # Global state providers
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Application pages
│   ├── styles/            # Additional styling files
│   ├── utils/             # Utility/helper functions
│   ├── App.jsx            # Main application routes
│   ├── main.jsx           # React entry point
│   └── index.css          # Tailwind base styles
│
├── .env                   # Environment variables
├── package.json           # Dependencies & scripts
├── tailwind.config.js     # Tailwind configuration
└── vite.config.js         # Vite configuration
```

---

# Installation & Setup

## 1. Navigate to Frontend Folder

```bash
cd Threadly-Frontend
```

## 2. Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production:

```env
VITE_API_BASE_URL=https://social-media-app-threadly.onrender.com/api
```

---

# Running the Application

## Development Mode

```bash
npm run dev
```

Application runs on:

```bash
http://localhost:5173
```

---

# Frontend Architecture

## Context API State Management

### AuthContext
Handles:
- User authentication
- Login/Register flow
- Persistent JWT storage
- Protected route handling

### DMContext
Handles:
- Direct message state
- Optimistic UI updates
- Real-time message rendering
- Unread message counts

---

# Axios Interceptors

All API calls pass through a centralized Axios instance that:

- Automatically attaches JWT Bearer Tokens
- Handles expired sessions
- Intercepts unauthorized responses
- Simplifies API management

---

# Deployment Guide

# Deploying on Vercel (Recommended)

## Steps

1. Push frontend code to GitHub.
2. Login to Vercel.
3. Import your repository.
4. Set Root Directory:

```bash
Threadly-Frontend
```

5. Framework Preset:
```bash
Vite
```

6. Build Command:

```bash
npm run build
```

7. Output Directory:

```bash
dist
```

8. Add Environment Variable:

```env
VITE_API_BASE_URL=https://social-media-app-threadly.onrender.com/api
```

9. Click Deploy.

---

# Production Frontend URL

```bash
https://social-media-app-threadly.vercel.app/
```

---

# Frontend ↔ Backend Communication

```text
React Frontend
       │
       ▼
Axios API Requests
       │
       ▼
Express Backend API
       │
 ┌─────┴─────┐
 ▼           ▼
MongoDB   Cloudinary
```

---

# Performance & Optimization

- Fast Vite bundling
- Lazy component rendering
- Optimistic UI updates
- Reusable component architecture
- Responsive mobile-first design
- API abstraction layer

---

# Future Improvements

- WebSocket Real-time Chat
- Push Notifications
- Story/Status Feature
- Infinite Feed Scrolling
- Dark/Light Theme Toggle
- Search & Explore Page

---

# Backend API

Backend API powers authentication, posts, messaging, notifications, and media uploads.

Backend Deployment:

```bash
https://social-media-app-threadly.onrender.com
```

---

# Contributors

Developed collaboratively as a Full Stack MERN Social Media Platform Project.