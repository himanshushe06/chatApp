import { useEffect, useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAvailableUsers } from "../../services/userService";
import { sendChatRequest } from "../../services/chatService";

const NewChat = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [sendingId, setSendingId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getAvailableUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const keyword = search.toLowerCase();

            return (
                user.username?.toLowerCase().includes(keyword) ||
                user.email?.toLowerCase().includes(keyword)
            );
        });
    }, [users, search]);

    const handleSendRequest = async (receiverId) => {
        try {
            setSendingId(receiverId);

            await sendChatRequest(receiverId);

            navigate("/chat");
        } catch (error) {
            console.error(error);
        } finally {
            setSendingId(null);
        }
    };

    return (
        <div className="flex flex-col h-full bg-zinc-900">

            {/* Header */}
            <div className="border-b border-zinc-800 p-6">

                <h1 className="text-2xl font-bold text-white">
                    New Chat
                </h1>

                <p className="text-zinc-400 mt-1">
                    Search for a user and send a chat request.
                </p>

            </div>

            {/* Search */}
            <div className="p-5 border-b border-zinc-800">

                <div className="flex items-center bg-zinc-800 rounded-xl px-4 py-3">

                    <Search
                        size={18}
                        className="text-zinc-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="ml-3 w-full bg-transparent outline-none text-white placeholder:text-zinc-500"
                    />

                </div>

            </div>

            {/* Users */}
            <div className="flex-1 overflow-y-auto">

                {loading ? (

                    <div className="text-center mt-8 text-zinc-400">
                        Loading users...
                    </div>

                ) : filteredUsers.length === 0 ? (

                    <div className="text-center mt-8 text-zinc-500">
                        No users found.
                    </div>

                ) : (

                    filteredUsers.map((user) => (

                        <div
                            key={user._id}
                            className="flex items-center justify-between px-6 py-4 border-b border-zinc-800"
                        >

                            <div className="flex items-center gap-4">

                                {user.avatar ? (

                                    <img
                                        src={user.avatar}
                                        alt={user.username}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />

                                ) : (

                                    <div className="h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                        {user.username?.charAt(0).toUpperCase()}
                                    </div>

                                )}

                                <div>

                                    <h2 className="text-white font-medium">
                                        {user.username}
                                    </h2>

                                    <p className="text-sm text-zinc-400">
                                        {user.email}
                                    </p>

                                </div>

                            </div>

                            <button
                                onClick={() => handleSendRequest(user._id)}
                                disabled={sendingId === user._id}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 px-4 py-2 rounded-lg text-white transition"
                            >

                                <UserPlus size={18} />

                                {sendingId === user._id
                                    ? "Sending..."
                                    : "Send Request"}

                            </button>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
};

export default NewChat;