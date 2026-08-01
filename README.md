# 💬 ChatApp

A modern full-stack real-time chat application built with the MERN stack, featuring secure authentication, real-time messaging, group chats, media sharing, email verification, and a polished user experience inspired by modern messaging platforms.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Real--Time-black?logo=socket.io)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

### 🔐 Authentication
- User Signup & Login
- JWT Authentication
- HTTP-Only Cookies
- Email OTP Verification
- Secure Password Hashing (bcrypt)
- Profile Management

### 💬 Real-Time Messaging
- One-to-One Chat
- Group Chat
- Real-Time Messaging with Socket.IO
- Typing Indicators
- Online/Offline Status
- Unread Message Counter

### 📨 Messages
- Send Text Messages
- Image Sharing
- Voice Messages
- Reply to Messages
- Edit Messages
- Delete for Me
- Delete for Everyone
- Message Status
  - ✓ Sent
  - ✓✓ Delivered
  - ✓✓ Seen

### 👥 Friends
- Friend Requests
- Accept / Reject Requests
- Real-Time Updates
- Instant Chat Creation

### 🎨 User Experience
- Dark & Light Theme
- Responsive UI
- Smooth Animations
- Interactive Message Menu
- Professional OTP Verification Flow
- Beautiful Email Templates

### ☁️ Media
- Cloudinary Image Upload
- Profile Picture Upload
- Secure Storage

---

# 🛠 Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- Axios
- Socket.IO Client
- React Hot Toast
- Lucide React

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT
- bcrypt
- Multer
- Cloudinary
- Resend Email API

---

# 📂 Project Structure

```
ChatApp
│
├── frontend
│   ├── src
│   ├── components
│   ├── pages
│   ├── context
│   ├── services
│   └── api
│
├── backend
│   ├── controller
│   ├── model
│   ├── routes
│   ├── middleware
│   ├── socket
│   ├── config
│   └── utils
│
└── README.md
```

---

# 🚀 Getting Started

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/ChatApp.git
```

```
cd ChatApp
```

---

## Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file

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

Run backend

```bash
npm run dev
```

---

## Frontend Setup

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

> Add screenshots here after deployment.

- Login Page
- Signup Page
- OTP Verification
- Chat Dashboard
- Group Chat
- Message Features
- Profile Settings

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing
- HTTP-Only Cookies
- Email OTP Verification
- Protected Routes
- Secure File Uploads

---

# 📈 Future Improvements

- Video Calling
- Audio Calling
- Screen Sharing
- Message Search
- Push Notifications
- Message Reactions
- AI Chat Assistant
- Mobile Application

---

# 🤝 Contributing

Contributions are welcome.

Fork the repository, create a feature branch, and submit a Pull Request.

---

# 👨‍💻 Author

**Himanshu Shekhar**

B.Tech Computer Science Engineering

GitHub: https://github.com/YOUR_USERNAME

LinkedIn: https://linkedin.com/in/YOUR_LINKEDIN

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.
