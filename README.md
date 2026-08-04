# 💬 ChatTalk

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.IO-Real--Time-010101?logo=socket.io" />
  <img src="https://img.shields.io/badge/JWT-Authentication-orange" />
  <img src="https://img.shields.io/badge/Cloudinary-Media-3448C5" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
</p>

A **production-ready real-time chat application** built using the **MERN Stack** that enables secure one-to-one and group messaging with real-time communication, media sharing, friend management, and modern messaging features inspired by WhatsApp.

---

## 🌐 Live Demo

🔗 https://www.chattalk.website

---

# ✨ Features

## 🔐 Authentication

- User Registration & Login
- JWT Authentication
- HTTP Only Cookie Authentication
- Email OTP Verification
- Secure Password Hashing (bcrypt)
- Protected Routes

---

## 👤 User Management

- Edit Profile
- Profile Picture Upload
- Cloudinary Integration
- Online / Offline Presence
- Friend Discovery

---

## 🤝 Friend System

- Send Friend Requests
- Accept / Reject Requests
- Real-Time Friend Request Updates
- Automatic Chat Creation

---

## 💬 Messaging

- One-to-One Chat
- Group Chat
- Real-Time Messaging using Socket.IO
- Typing Indicators
- Reply to Messages
- Edit Messages
- Delete for Me
- Delete for Everyone
- Chat Deletion
- Unread Message Counter

---

## 📩 Message Status

- ✓ Sent
- ✓✓ Delivered
- ✓✓ Seen

---

## 🎤 Media Support

- Image Sharing
- Voice Messages
- Profile Pictures
- Cloudinary Storage

---

## 🎨 User Experience

- Responsive UI
- Smooth Animations
- Dark / Light Theme
- Professional OTP Verification Flow
- Beautiful Email Templates

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Context API
- Socket.IO Client
- Framer Motion
- React Hot Toast
- Lucide React

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication
- bcrypt
- Multer
- Cloudinary
- Resend Email API

---

## Tools

- Git
- GitHub
- VS Code
- Postman
- Vercel

---

# 🏗 Architecture

```text
                React Frontend
                      │
                      │ REST APIs
                      ▼
               Express.js Backend
                │              │
                │              │
        Socket.IO Server       JWT
                │
                ▼
             MongoDB
                │
                ▼
           Cloudinary
```

---

# 📂 Project Structure

```text
ChatTalk
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controller
│   │   ├── Db
│   │   ├── middleware
│   │   ├── model
│   │   ├── routes
│   │   ├── socket
│   │   ├── utils
│   │   └── app.js
│   │
│   ├── uploads
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── layouts
│   │   ├── lib
│   │   ├── pages
│   │   ├── routes
│   │   ├── services
│   │   ├── socket
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── vite.config.js
│   ├── vercel.json
│   └── package.json
│
├── screenshots
│
└── README.md
```

---

# 📡 REST API Overview

## Authentication

```http
POST /auth/signup

POST /auth/login

POST /auth/verify-otp

PUT /auth/profile
```

---

## Chats

```http
GET    /chats

POST   /chats/request

PUT    /chats/accept/:id

DELETE /chats/reject/:id
```

---

## Messages

```http
POST   /messages/send

GET    /messages/:chatId

PATCH  /messages/edit/:id

PATCH  /messages/delete/:id

PUT    /messages/seen/:id
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/himanshushe06/YOUR_REPOSITORY_NAME.git
```

---

## Backend

```bash
cd backend

npm install
```

Create `.env`

```env
PORT=4000

MONGO_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

RESEND_API_KEY=

EMAIL_FROM=
```

Run

```bash
npm run dev
```

---

## Frontend

```bash
cd frontend

npm install
```

Create `.env`

```env
VITE_API_URL=http://localhost:4000/api
```

Run

```bash
npm run dev
```

---

# 📸 Screenshots

## Login

![](screenshots/login.png)

---

## Signup

![](screenshots/signup.png)

---

## Chat Dashboard

![](screenshots/chat-dashboard.png)

---

## Friend Requests

![](screenshots/friend-request.png)

---

## Group Chat

![](screenshots/group-chat.png)

---

## Profile

![](screenshots/profile.png)

---

# ⚡ Performance Highlights

- Real-Time WebSocket Communication
- JWT Authentication
- RESTful API Architecture
- Scalable MVC Design Pattern
- Optimized React Context State Management
- Responsive User Interface
- Secure Image Uploads
- Cloudinary Integration
- Modular Backend Architecture

---

# 🔒 Security Features

- JWT Authentication
- HTTP Only Cookies
- Password Hashing (bcrypt)
- Email OTP Verification
- Protected Routes
- Secure File Upload Validation
- Cloudinary Secure Media Storage

---

# 🚀 Future Improvements

- Video Calling
- Voice Calling
- Screen Sharing
- Push Notifications
- Message Search
- Message Reactions
- Message Forwarding
- AI Chat Assistant
- Mobile Application

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a Pull Request.

---

# 👨‍💻 Author

**Himanshu Shekhar**

📧 harsh06022005@gmail.com

🔗 LinkedIn  
https://www.linkedin.com/in/himanshu0602/

💻 GitHub  
https://github.com/himanshushe06

---

# ⭐ Support

If you found this project useful, please consider giving it a ⭐ on GitHub.

It helps others discover the project and supports future development.
