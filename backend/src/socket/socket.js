import UserModel from "../model/user.schema.js";

const users = new Map();
const activeChats = new Map();
let ioInstance = null;
export const getIO = () => {
    if (!ioInstance) {
        throw new Error("Socket.IO has not been initialized");
    }
    return ioInstance;
};
export const getUserSocketId = (userId) => {
    if (!userId) return null;
    return users.get(userId.toString());
};
export const getActiveChat = (userId) => {
    if (!userId) return null;
    return activeChats.get(userId.toString());
};
const setupSocket = (io) => {
    ioInstance = io;
    io.on("connection", (socket) => {
        socket.on("registerUser", (userId) => {
            if (!userId) return;
            users.set(userId.toString(), socket.id);
            socket.userId = userId;
            io.emit(
                "onlineUsers",
                Array.from(users.keys())
            );
        });
        socket.on("joinChat", (chatId) => {
            if (!socket.userId || !chatId) return;
            activeChats.set(
                socket.userId.toString(),
                chatId.toString()
            );
            socket.join(chatId.toString());
        });
        socket.on("leaveChat", (chatId) => {
            if (!socket.userId) return;
            activeChats.delete(
                socket.userId.toString()
            );
            if (chatId) {
                socket.leave(chatId.toString());
            }
        });
        socket.on("joinGroup", (groupId) => {
            if (!groupId) return;
            socket.join(groupId.toString());
        });
        socket.on("leaveGroup", (groupId) => {
            if (!groupId) return;
            socket.leave(groupId.toString());
        });
        socket.on(
            "typing",
            ({ receiverId, senderName }) => {
                if (!receiverId) return;
                const receiverSocketId = users.get(receiverId.toString());
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit(
                        "userTyping",
                        senderName
                    );
                }
            }
        );
        socket.on("stopTyping", (receiverId) => {
            if (!receiverId) return;
            const receiverSocketId = users.get(receiverId.toString());
            if (receiverSocketId) {
                io.to(receiverSocketId).emit(
                    "userStoppedTyping"
                );
            }
        });
        socket.on("sendMessage", (data) => {
            if (!data?.receiverId) return;
            const receiverSocketId = users.get( data.receiverId.toString() );
            if (receiverSocketId) {
                io.to(receiverSocketId).emit(
                    "receiveMessage",
                    data
                );
            }
        });
        socket.on("sendImage", (data) => {
            if (!data?.receiverId) return;
            const receiverSocketId = users.get( data.receiverId.toString() );
            if (receiverSocketId) {
                io.to(receiverSocketId).emit(
                    "receiveImage",
                    data
                );
            }
        });
        socket.on("sendGroupMessage", (data) => {
            if ( !data?.groupId ) return;
            io.to( data.groupId.toString() ).emit(
                "receiveGroupMessage",
                data
            );
        });
        socket.on("deleteMessage", (data) => {
            if (!data?.receiverId) return;
            const receiverSocketId = users.get( data.receiverId.toString() );
            if (receiverSocketId) {
                io.to(receiverSocketId).emit(
                    "messageDeleted",
                    data
                );
            }
        });
        socket.on("editMessage", (data) => {
            if (!data?.receiverId) return;
            const receiverSocketId = users.get( data.receiverId.toString() );
            if (receiverSocketId) {
                io.to(receiverSocketId).emit(
                    "messageEdited",
                    data
                );
            }
        });
        socket.on("sendVoice", (data) => {
            if (!data?.receiverId) return;
            const receiverSocketId = users.get( data.receiverId.toString() );
            if (receiverSocketId) {
                io.to(receiverSocketId).emit(
                    "receiveVoice",
                    data
                );
            }
        });
        socket.on("disconnect", async () => {
            for (const [userId, socketId] of users) {
                if (socketId === socket.id) {
                    try {
                        await UserModel.findByIdAndUpdate(
                            userId,
                            {
                                lastSeen: new Date(),
                            }
                        );
                    } catch (error) {
                        console.error(
                            "Failed to update lastSeen:",
                            error
                        );
                    }
                    users.delete(userId);
                    activeChats.delete(userId);
                    break;
                }
            }
            io.emit(
                "onlineUsers",
                Array.from(users.keys())
            );
        });
    });
};
export default setupSocket;