import { createContext, useContext, useState } from "react";
const MessageMenuContext = createContext();

export const MessageMenuProvider = ({ children }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [position, setPosition] = useState({
        x: 0,
        y: 0,
    });
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [editingMessage, setEditingMessage] = useState(null);

    const openMenu = (message, x, y) => {
        setSelectedMessage(message);
        setPosition({ x, y });
        setMenuOpen(true);
    };
    const closeMenu = () => {
        setMenuOpen(false);
        setSelectedMessage(null);
    };
    const startEditing = (message) => {
        if (!message || message.isDeleted) return;
        setEditingMessage(message);
        closeMenu();
    };

    const cancelEditing = () => {
        setEditingMessage(null);
    };
    const startReply = (message) => {
        if (!message) return;
        setReplyingTo(message);
        closeMenu();
    };
    const cancelReply = () => {
        setReplyingTo(null);
    };
    return (
        <MessageMenuContext.Provider
            value={{
                menuOpen,
                position,
                selectedMessage,
                editingMessage,
                replyingTo,
                openMenu,
                closeMenu,
                startEditing,
                cancelEditing,
                startReply,
                cancelReply,
                setEditingMessage,
            }}
        >
            {children}
        </MessageMenuContext.Provider>
    );
};

export const useMessageMenu = () => {
    const context = useContext(MessageMenuContext);
    if (!context) {
        throw new Error(
            "useMessageMenu must be used inside MessageMenuProvider"
        );
    }
    return context;
};