# 💬 ChatTalk

A production-ready real-time chat application built with the MERN Stack, featuring secure authentication, instant messaging, friend management, media sharing, and WhatsApp-inspired messaging features.

🌐 **Live Demo:** https://www.chattalk.website

---

## 🚀 Features

### 🔐 Authentication
- Secure JWT Authentication
- User Signup & Login
- OTP Email Verification
- Protected Routes
- Password Encryption using bcrypt

### 👤 User Management
- Edit Profile
- Profile Picture Upload
- Cloudinary Image Storage
- Online / Offline Presence

### 🤝 Friend System
- Send Friend Requests
- Accept / Reject Requests
- Real-Time Friend Request Notifications

### 💬 Messaging
- One-to-One Chat
- Group Chat
- Instant Messaging using Socket.IO
- Typing Indicators
- Message Delivery Status
- Read Receipts
- Unread Message Count
- Edit Messages
- Delete for Me
- Delete for Everyone
- Delete Entire Conversation

### 📷 Media Support
- Image Uploads
- Voice Messages
- Profile Pictures

### ⚡ Real-Time Features
- Live Message Delivery
- Online User Tracking
- Instant UI Updates
- Active Chat Detection
- Automatic Unread Count Reset

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Tailwind CSS
- Axios
- Socket.IO Client
- React Context API
- Vite

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT Authentication
- Multer
- Cloudinary

## Database

- MongoDB Atlas

## Tools

- Git
- GitHub
- Postman
- VS Code
- Resend (Email OTP)

---

# 📂 Project Structure

```
ChatTalk
│
├── client
│   ├── src
│   ├── public
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── sockets
│   ├── utils
│   └── package.json
│
└── README.md
```

---

# 📸 Screenshots

> Replace these placeholders with screenshots from your application.

## Login

![Login](screenshots/login.png)

---

## Chat Window

![Chat](screenshots/chat.png)

---

## Friend Requests

![Friend Requests](screenshots/request.png)

---

## Group Chat

![Group Chat](screenshots/group.png)

---

## Profile

![Profile](screenshots/profile.png)

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/himanshushe06/ChatTalk.git
```

Move into the project

```bash
cd ChatTalk
```

---

## Backend Setup

```bash
cd server

npm install
```

Create a `.env` file

```env
PORT=4000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

RESEND_API_KEY=
```

Start backend

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd client

npm install

npm run dev
```

---

# 🎯 Future Improvements

- Video Calling
- Voice Calling
- Message Search
- Message Reactions
- Pinned Messages
- Message Forwarding
- Notifications
- End-to-End Encryption
- AI Chat Assistant

---

# 📈 Highlights

- Real-Time Communication using Socket.IO
- RESTful API Architecture
- JWT Authentication
- Scalable MVC Backend
- Cloudinary Media Storage
- Responsive UI
- Modern React Architecture
- Clean Code Structure

---

# 👨‍💻 Author

**Himanshu Shekhar**

LinkedIn

https://linkedin.com/in/himanshu0602

GitHub

https://github.com/himanshushe06

Email

harsh06022005@gmail.com

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

It helps others discover the project and supports future development.
