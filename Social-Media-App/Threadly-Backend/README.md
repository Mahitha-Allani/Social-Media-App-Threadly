# Threadly - Backend API

Backend service for **Threadly**, a modern full-stack social media platform inspired by Threads/Twitter.

This API powers authentication, posts, comments, notifications, direct messaging, user relationships, and media uploads for the Threadly frontend application.

---

# Live Deployment

## Backend API (Render)

https://social-media-app-threadly.onrender.com

---

# Features

- User Authentication & Authorization (JWT)
- User Profiles & Follow System
- Create/Edit/Delete Posts
- Image Uploads with Cloudinary
- Nested Comments & Replies
- Likes & Bookmarks
- Direct Messaging (DMs)
- Share Posts inside Chats
- Notification System
- RESTful API Architecture
- MongoDB Database Integration
- Secure Middleware-based Route Protection

---

# Tech Stack

## Backend
- Node.js
- Express.js

## Database
- MongoDB
- Mongoose ODM

## Authentication
- JSON Web Tokens (JWT)

## Media Storage
- Cloudinary

## Middleware & Utilities
- Cors
- Cookie Parser
- Multer
- Dotenv

---

# Folder Structure

```bash
Threadly-Backend/
│
├── Controllers/       # Business logic controllers
├── Middleware/        # Authentication & custom middleware
├── Models/            # Mongoose database schemas
├── Routes/            # API route handlers
├── config/            # Cloudinary & external configurations
├── uploads/           # Temporary/local uploads
├── .env               # Environment variables
├── package.json       # Dependencies & scripts
└── server.js          # Application entry point
```

---

# Installation & Setup

## 1. Clone Repository

```bash
git clone <repository-url>
```

## 2. Navigate to Backend

```bash
cd Threadly-Backend
```

## 3. Install Dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the root directory and configure the following:

```env
PORT=5000

DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/threadly

JWT_SECRET=your_super_secret_jwt_key

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

NODE_ENV=development
```

---

# Running the Server

## Development Mode

```bash
npm run dev
```

## Production Mode

```bash
node server.js
```

Server runs on:

```bash
http://localhost:5000
```

---

# Deployment Guide

# Deploying on Render (Recommended)

## Steps

1. Push your backend code to GitHub.
2. Login to Render.
3. Create a new **Web Service**.
4. Connect your GitHub repository.
5. Set Root Directory:

```bash
Threadly-Backend
```

6. Configure Build Command:

```bash
npm install
```

7. Configure Start Command:

```bash
node server.js
```

8. Add all environment variables from `.env`.
9. Click **Deploy**.

---

# Production Backend URL

```bash
https://social-media-app-threadly.onrender.com
```

---

# API Architecture Overview

```text
Client (React Frontend)
        │
        ▼
Express.js REST API
        │
 ┌──────┴──────┐
 ▼             ▼
MongoDB     Cloudinary
(Database)  (Image Storage)
```

---

# Database Schemas

## User Schema
- username
- email
- password
- name
- bio
- profileImage
- followers
- following
- bookmarks
- verified

---

## Post Schema
- author
- content
- image
- likes
- shares
- bookmarks
- comments
- replies

---

## Message Schema
- senderId
- receiverId
- text
- postId
- read

---

## Notification Schema
- senderId
- receiverId
- type
- postId
- read

---

# Security Features

- JWT-based Authentication
- Protected API Routes
- Secure Password Handling
- Environment Variable Protection
- CORS Configuration
- Cookie-based Session Handling

---

# Future Improvements

- WebSocket Real-time Messaging
- Real-time Notifications
- Post Search & Explore
- Story/Status Feature
- Email Verification
- OAuth Login (Google/GitHub)

---

# Frontend Repository

Frontend application connects to this backend API using Axios and environment-based API configuration.

---

# Contributors

Developed collaboratively as a Full Stack MERN Social Media Platform Project.