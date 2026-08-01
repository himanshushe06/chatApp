import { createContext, useContext,useEffect,useState } from "react";
import { useAuth } from "./AuthContext";
const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [typingUser, setTypingUser] = useState("");
    const [chats, setChats] = useState([]);
    const [messagesLoading, setMessagesLoading] =
    useState(false);
    useEffect(() => {
        setSelectedUser(null);
        setSelectedChat(null);
        setMessages([]);
        setChats([]);
        setTypingUser("");
    }, [user?._id]);
    
    const clearConversation = (chatId) => {
        setChats((prev) =>
            prev.map((chat) => {
                if (chat._id !== chatId) {
                    return chat;
                }
                return {
                    ...chat,
                    lastMessage: null,
                    unreadCount: {},
                };
            })
        );
        if (selectedChat?._id === chatId) {
            setMessages([]);
        }
    };

    return (
        <ChatContext.Provider
            value={{
                selectedUser,
                setSelectedUser,

                selectedChat,
                setSelectedChat,

                chats,
                setChats,

                messages,
                setMessages,

                onlineUsers,
                setOnlineUsers,

                typingUser,
                setTypingUser,

                messagesLoading,
                setMessagesLoading,

                clearConversation,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);