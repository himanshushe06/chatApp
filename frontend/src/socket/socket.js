import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
    withCredentials: true,
    autoConnect: false,      
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000
});
socket.on("connect", () => {
    console.log("✅ Connected:", socket.id);
});
socket.on("connect_error", (err) => {
    console.log("❌ Socket Error:", err.message);
});

export default socket;