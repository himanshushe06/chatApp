import { useEffect, useState } from "react";
import {getPendingRequests,acceptChatRequest,rejectChatRequest} from "../../services/chatService";
import { useSocket } from "../../context/SocketContext";

const FriendRequests = () => {
    const { socket } = useSocket();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const data = await getPendingRequests();
            setRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        if (!socket) return;

        const refreshRequests = () => {
            fetchRequests();
        };

        socket.on("friendRequestReceived", refreshRequests);
        socket.on("friendRequestAccepted", refreshRequests);
        socket.on("friendRequestRejected", refreshRequests);

        return () => {
            socket.off("friendRequestReceived", refreshRequests);
            socket.off("friendRequestAccepted", refreshRequests);
            socket.off("friendRequestRejected", refreshRequests);
        };
    }, [socket]);

    const handleAccept = async (chatId) => {
        try {
            await acceptChatRequest(chatId);
            await fetchRequests();
        } catch (error) {
            console.error(error);
        }
    };

    const handleReject = async (chatId) => {
        try {
            await rejectChatRequest(chatId);
            await fetchRequests();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center text-zinc-400">
                Loading requests...
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-zinc-900">
            <div className="border-b border-zinc-800 p-6">
                <h1 className="text-2xl font-bold text-white">
                    Friend Requests
                </h1>

                <p className="text-zinc-400 mt-1">
                    Accept or reject incoming chat requests.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto">
                {requests.length === 0 ? (
                    <div className="text-center text-zinc-500 mt-12">
                        No pending requests
                    </div>
                ) : (
                    requests.map((chat) => {
                        const sender = chat.participants.find(
                            (participant) =>
                                participant._id === chat.requestedBy
                        );

                        return (
                            <div
                                key={chat._id}
                                className="flex items-center justify-between px-6 py-5 border-b border-zinc-800"
                            >
                                <div className="flex items-center gap-4">
                                    {sender?.avatar ? (
                                        <img
                                            src={sender.avatar}
                                            alt={sender.username}
                                            className="h-14 w-14 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-14 w-14 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                            {sender?.username
                                                ?.charAt(0)
                                                .toUpperCase()}
                                        </div>
                                    )}

                                    <div>
                                        <h2 className="text-white font-semibold">
                                            {sender?.username}
                                        </h2>

                                        <p className="text-sm text-zinc-400">
                                            {sender?.email}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() =>
                                            handleReject(chat._id)
                                        }
                                        className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                                    >
                                        Reject
                                    </button>

                                    <button
                                        onClick={() =>
                                            handleAccept(chat._id)
                                        }
                                        className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white transition"
                                    >
                                        Accept
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default FriendRequests;