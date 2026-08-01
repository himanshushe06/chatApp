let io = null;

const setIO = (socketInstance) => {
    io = socketInstance;
};
const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized.");
    }
    return io;
};
export {
    setIO,
    getIO,
};