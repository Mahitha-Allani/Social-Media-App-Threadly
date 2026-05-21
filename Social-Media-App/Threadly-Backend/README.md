# Threadly - Backend

This is the backend API for **Threadly**, a full-stack social media application clone. It provides RESTful endpoints for user authentication, posting, commenting, liking, sharing to DMs, and real-time messaging.

##  Tech Stack
- **Node.js & Express.js**: Reliable and fast web framework.
- **MongoDB & Mongoose**: NoSQL database for flexible data modeling.
- **JSON Web Tokens (JWT)**: Secure authentication and authorization.
- **Cloudinary**: Cloud-based image storage and management.
- **Cors, Cookie-Parser, Multer**: Middlewares for handling requests and file uploads.

##  Folder Structure
```
Threadly-Backend/
│
├── Controllers/       # Request handlers (auth, post, message, user, comment, notification)
├── Middleware/        # Custom middlewares (auth validation)
├── Models/            # Mongoose schemas (User, Post, Message, Comment, Notification)
├── Routes/            # Express route definitions
├── config/            # External service configs (Cloudinary)
├── uploads/           # Local file storage (if not using Cloudinary)
├── .env               # Environment variables
├── package.json       # Project dependencies
└── server.js          # Entry point of the application
```

##  Prerequisites & Installation

1. **Clone the repository** (if not already done).
2. **Navigate to the backend folder**:
   ```bash
   cd Threadly-Backend
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```

## Environment Variables (.env)
Create a `.env` file in the root of `Threadly-Backend` and add the following keys:

```env
PORT=5000
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/threadly?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
```

##  Database Schemas (Mongoose)

### **User Schema**
- `username`, `email`, `password`, `name`, `bio`, `profileImage`
- `followers` / `following` (Array of ObjectIds)
- `verified` (Boolean)
- `bookmarks` (Array of ObjectIds)

### **Post Schema**
- `author` (ObjectId -> User)
- `content` (String), `image` (String)
- `likes`, `shares`, `bookmarks` (Array of ObjectIds)
- `comments` (Embedded array containing `user`, `content`, `replies`)

### **Message Schema (DMs)**
- `senderId` (ObjectId -> User)
- `receiverId` (ObjectId -> User)
- `text` (String)
- `postId` (ObjectId -> Post) - *Used for embedded shared posts in DMs*
- `read` (Boolean)

### **Notification Schema**
- `senderId` (ObjectId -> User)
- `receiverId` (ObjectId -> User)
- `type` (Enum: 'like', 'comment', 'follow', 'reply', 'message')
- `postId` (ObjectId -> Post - Optional)
- `read` (Boolean)

##  Deployments (Render / Vercel)

### **Deploying on Render (Recommended for Node/Express)**
1. Go to [Render](https://render.com/) and create a new **Web Service**.
2. Connect your GitHub repository.
3. Set the Root Directory to `Threadly-Backend`.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Add all your `.env` variables in the Render Environment Variables section.
7. Click **Deploy**.

### **Deploying on Vercel**
This project includes a `vercel.json`. You can deploy directly to Vercel:
1. Import the repository in Vercel.
2. Set Root Directory to `Threadly-Backend`.
3. Add `.env` variables.
4. Deploy. (Note: Serverless environments like Vercel have limits on WebSocket/long-running connections and file uploads without third-party services like Cloudinary).

##  Running the Server locally
```bash
npm run dev
# or
node server.js
```
The server will start at `http://localhost:5000`.
