# Chat Application Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Frontend](#frontend)
   - [Technologies Used](#technologies-used)
   - [Folder Structure](#folder-structure)
   - [Key Components](#key-components)
4. [Backend](#backend)
   - [Technologies Used](#technologies-used-1)
   - [Folder Structure](#folder-structure-1)
   - [Key Components](#key-components-1)
5. [Database Schema](#database-schema)
6. [Authentication](#authentication)
7. [Real-time Messaging](#real-time-messaging)
8. [Deployment](#deployment)
9. [Running the Application](#running-the-application)

## Introduction

This is a real-time chat application built with a React frontend and a Node.js/Express backend. It features user authentication, real-time messaging using Socket.IO, and a responsive UI built with Tailwind CSS.

## Project Structure

```
chat-application/
├── backend/
│   ├── controllers/
│   ├── lib/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── index.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── README.md
└── .gitignore
```

## Frontend

### Technologies Used

- React (Vite)
- Tailwind CSS
- Zustand (State Management)
- Socket.IO Client
- Axios

### Folder Structure

```
frontend/
├── public/
│   ├── avatar.png
│   ├── screenshot-for-readme.png
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── skeletons/
│   │   ├── AuthImagePattern.jsx
│   │   ├── ChatContainer.jsx
│   │   ├── ChatHeader.jsx
│   │   ├── MessageInput.jsx
│   │   ├── Navbar.jsx
│   │   ├── NoChatSelected.jsx
│   │   └── Sidebar.jsx
│   ├── constants/
│   │   └── index.js
│   ├── lib/
│   │   ├── axios.js
│   │   └── utils.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── SignUpPage.jsx
│   ├── store/
│   │   ├── useAuthStore.js
│   │   ├── useChatStore.js
│   │   └── useThemeStore.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

### Key Components

#### App.jsx
The main application component that handles routing and authentication state.

#### ChatContainer.jsx
Displays the chat messages and handles message rendering.

#### MessageInput.jsx
Component for composing and sending messages.

#### Sidebar.jsx
Displays the list of users and conversations.

#### Navbar.jsx
Top navigation bar with logout functionality.

#### Authentication Pages
- LoginPage.jsx
- SignUpPage.jsx
- ProfilePage.jsx

## Backend

### Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- Socket.IO
- Cloudinary (for image uploads)
- bcryptjs (for password hashing)
- jsonwebtoken (for authentication)

### Folder Structure

```
backend/
├── controllers/
│   ├── auth-controller.js
│   └── message.controller.js
├── lib/
│   ├── cloudinary.js
│   ├── db.js
│   ├── socket.js
│   └── utils.js
├── middleware/
│   └── auth.middleware.js
├── models/
│   ├── message.model.js
│   └── user.model.js
├── routes/
│   ├── auth.route.js
│   └── message.route.js
├── seed/
│   └── user.seed.js
├── index.js
├── package.json
└── .env
```

### Key Components

#### index.js
The main server file that initializes the Express app, connects to the database, and sets up Socket.IO.

#### Controllers
- auth-controller.js: Handles user registration, login, and profile management.
- message.controller.js: Handles sending and retrieving messages.

#### Models
- user.model.js: Defines the User schema with fields for name, username, password, gender, and profile picture.
- message.model.js: Defines the Message schema with fields for sender, receiver, and message content.

#### Middleware
- auth.middleware.js: Verifies JWT tokens for protected routes.

#### Lib
- cloudinary.js: Handles image uploads to Cloudinary.
- db.js: Database connection setup.
- socket.js: Socket.IO configuration for real-time messaging.
- utils.js: Utility functions.

## Database Schema

### User Schema
```javascript
{
  name: String,
  username: { type: String, unique: true },
  password: String,
  gender: { type: String, enum: ['male', 'female'] },
  profilePic: String
}
```

### Message Schema
```javascript
{
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver: { type: Schema.Types.ObjectId, ref: 'User' },
  message: String,
  timestamp: { type: Date, default: Date.now }
}
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. User registers or logs in with username/password
2. Server verifies credentials and generates a JWT token
3. Token is sent to client and stored in localStorage
4. For subsequent requests, token is included in Authorization header
5. Server middleware verifies token before processing protected routes

## Real-time Messaging

Real-time messaging is implemented using Socket.IO:

1. Client connects to Socket.IO server on login
2. When a user sends a message:
   - Client emits 'sendMessage' event with message data
   - Server receives event, saves message to database
   - Server emits 'newMessage' event to recipient
   - Recipient's client receives event and updates UI

## Deployment

### Backend Deployment
1. Set up a MongoDB database (e.g., MongoDB Atlas)
2. Deploy Node.js server to a hosting service (e.g., Render, Heroku)
3. Configure environment variables:
   - PORT
   - MONGO_URI
   - JWT_SECRET
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the build folder to a static hosting service (e.g., Netlify, Vercel)
3. Configure environment variables:
   - VITE_BACKEND_URL (backend API URL)

## Running the Application

### Prerequisites
- Node.js installed
- MongoDB database
- Cloudinary account (for image uploads)

### Backend Setup
1. Navigate to the `backend` directory
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
4. Start the server: `npm run dev`

### Frontend Setup
1. Navigate to the `frontend` directory
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

### Accessing the Application
1. Open your browser and go to `http://localhost:5173` (or the port specified by Vite)
2. Register a new account or log in with existing credentials
3. Start chatting with other users!