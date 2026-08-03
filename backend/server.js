import "dotenv/config";

import http from "http";
import { Server } from "socket.io";

import app from "./src/app.js";

import setupSocket from "./src/socket/socket.js";
import { setIO } from "./src/socket/socketManager.js";

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});
setupSocket(io);
setIO(io);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});