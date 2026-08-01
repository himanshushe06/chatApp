import ChatHeader from "../../components/chat/ChatHeader";
import ChatWindow from "../../components/chat/ChatWindow";
import MessageInput from "../../components/chat/MessageInput";
import EmptyChat from "../../components/chat/EmptyChat";

import { useChat } from "../../context/ChatContext";

const Chat = () => {
    const { selectedChat } = useChat();

    return (
        <div
            className="
                flex
                flex-col
                h-screen
                bg-[var(--app-bg)]
            "
        >
            {selectedChat ? (
                <>
                    <ChatHeader />
                    <ChatWindow />
                    <MessageInput />
                </>
            ) : (
                <EmptyChat />
            )}
        </div>
    );
};

export default Chat;