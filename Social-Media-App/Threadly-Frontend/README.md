# Threadly - Frontend

This is the frontend application for **Threadly**, built with React and Vite. It provides a beautiful, responsive, and interactive user interface for a full-stack social media platform.

## Tech Stack
- **React.js**: UI Library.
- **Vite**: Fast frontend build tool.
- **Tailwind CSS**: Utility-first styling for modern and responsive designs.
- **Axios**: HTTP client for API requests (configured with interceptors for JWT auth).
- **React Router Dom**: For page navigation and routing.

##  Folder Structure
```
Threadly-Frontend/
│
├── public/            # Static assets
├── src/
│   ├── api/           # Axios instance and API call wrappers (auth, post, user, message)
│   ├── assets/        # Images, SVGs, and other local assets
│   ├── components/    # Reusable UI components (Navbar, Modals, PostCards, etc.)
│   ├── context/       # React Context Providers (AuthContext, DMContext)
│   ├── hooks/         # Custom React hooks (useAuth, usePosts)
│   ├── pages/         # Top-level Page components (Home, Profile, Messages, etc.)
│   ├── styles/        # Additional stylesheets
│   ├── utils/         # Helper functions
│   ├── App.jsx        # Root application component mapping routes
│   ├── main.jsx       # React DOM rendering entry point
│   └── index.css      # Base Tailwind imports and core styles
│
├── .env               # Environment variables
├── package.json       # Project dependencies
├── tailwind.config.js # Tailwind CSS configuration
└── vite.config.js     # Vite bundler configuration
```

## Prerequisites & Installation

1. **Navigate to the frontend folder**:
   ```bash
   cd Threadly-Frontend
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```

## Environment Variables (.env)
Create a `.env` file in the root of `Threadly-Frontend` and add the following keys. By default, it connects to the local backend.

```env
# Point this to your backend server URL (local or production)
VITE_API_BASE_URL=http://localhost:5000/api
```

##  Key Architecture & Features

### **Context API State Management**
- **AuthContext**: Manages user session, JWT token (`threadly_token` in `localStorage`), login/register methods.
- **DMContext**: Manages optimistic UI updates for Direct Messages, real-time message population, and unread counts.

### **API Interceptors**
All API calls are routed through an `axiosInstance` that automatically intercepts requests to attach the `Bearer` token, and intercepts 401 responses to automatically log out users whose sessions have expired.

##  Deployments (Vercel / Netlify)

### **Deploying on Vercel (Recommended)**
Vite applications are incredibly easy to deploy on Vercel.
1. Connect your GitHub repository to [Vercel](https://vercel.com/).
2. Select the `Threadly-Frontend` folder as your Root Directory.
3. Framework Preset: **Vite** will be auto-detected.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable: `VITE_API_BASE_URL` = `<your-deployed-backend-url>/api`
7. Click **Deploy**.

### **Deploying on Render**
1. Create a `Static Site` on Render.
2. Root Directory: `Threadly-Frontend`
3. Build Command: `npm run build`
4. Publish Directory: `dist`
5. Add the `VITE_API_BASE_URL` environment variable.

##  Running Locally
```bash
npm run dev
```
The application will be served at [http://localhost:3000](http://localhost:3000).
