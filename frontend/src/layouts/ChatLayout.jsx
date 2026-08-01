import Sidebar from "../components/chat/Sidebar";

const ChatLayout = ({ children }) => {
    return (
        <div className="h-screen bg-[var(--app-bg)] flex overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default ChatLayout;