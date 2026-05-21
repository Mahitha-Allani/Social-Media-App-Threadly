# Threadly - Full Stack Social Media Application

**Threadly** is a modern, fully-featured social media platform clone (inspired by Threads/Twitter). This repository acts as a monorepo containing both the robust **Node.js/Express backend** and the dynamic **React/Vite frontend**.

## Welcome to Threadly

Threadly allows users to:
- **Sign up & Profile Management:** Create accounts, customize profiles with avatars, bios, and verify statuses.
- **Social Graph:** Follow and unfollow other users.
- **Post & Engage:** Create rich posts (with text and image via Cloudinary), like, bookmark, and share.
- **Rich Comments:** Deeply nested commenting system (comments and replies).
- **Direct Messaging (DMs):** Private chat with followers. Capable of embedded post sharing (share a post directly into a DM chat).
- **Notifications:** Real-time push notifications for likes, comments, and follows.

##  Why this architecture?
This project is separated into a dedicated backend (`Threadly-Backend`) and frontend (`Threadly-Frontend`). 

**Why separate them?**
1. **Scalability:** The frontend (static site) can be hosted on a global CDN (like Vercel) for rapid load speeds, while the backend API can be scaled horizontally on application servers (like Render or AWS).
2. **Separation of Concerns:** Frontend developers can focus on React components and Tailwind styling, while backend engineers manage Mongoose schemas and API security.
3. **Security:** Environment secrets (like MongoDB URIs and JWT secrets) remain strictly on the backend. 

## System Diagram & Structure

```mermaid
graph TD
    Client[Browser / Client (React + Vite)]
    API[Backend API (Express.js)]
    DB[(MongoDB)]
    Cloudinary[(Cloudinary Storage)]

    Client -->|HTTP / Axios| API
    API -->|Mongoose ODM| DB
    API -->|Image Uploads| Cloudinary
```

### **General Directory Layout**
```text
Group Project(Social-Media-App)/
│
├── Threadly-Backend/        # The Node.js Express API Server
│   ├── .env                 # Backend Secrets
│   ├── server.js            # Server entry
│   └── README.md            # Dedicated Backend Documentation
│
├── Threadly-Frontend/       # The React Vite Application
│   ├── .env                 # Frontend Configs (API Base URL)
│   ├── src/                 # UI Code
│   └── README.md            # Dedicated Frontend Documentation
│
└── README.md                # This overarching project guide
```

## Getting Started Locally

To run the entire platform locally, you will need two terminal windows running concurrently.

### **1. Start the Backend**
```bash
cd Threadly-Backend
npm install
# Ensure you have your .env file configured (see Backend README)
npm run dev
```

### **2. Start the Frontend**
```bash
cd Threadly-Frontend
npm install
# Ensure you have your .env file configured to point to localhost:5000 (see Frontend README)
npm run dev
```

##  Production Deployment strategy

To take this platform live, you will deploy the two folders as separate apps:

1. **Deploy Backend (e.g., to Render)**
   - Create a Web Service pointing to the `Threadly-Backend` directory.
   - Setup your `DB_URL` and `JWT_SECRET` variables.
   - Get your assigned backend URL (e.g., `https://threadly-api.onrender.com`).

2. **Deploy Frontend (e.g., to Vercel/Netlify)**
   - Create a static site pointing to the `Threadly-Frontend` directory.
   - Add the environment variable: `VITE_API_BASE_URL=https://threadly-api.onrender.com/api`.
   - Your frontend will now correctly point to your live production backend!

---

*For detailed, exhaustive information about schemas, environment requirements, and inner workings, please refer to the specific `README.md` files located directly inside the `Threadly-Frontend` and `Threadly-Backend` directories.*
