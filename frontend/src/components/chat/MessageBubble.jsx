import { useEffect, useState } from "react";
import { Check, CheckCheck, X } from "lucide-react";
import { motion } from "framer-motion";
import MessageActionButton from "./MessageActionButton";
import { useMessageMenu } from "../../context/MessageMenuContext";
import {editMessage,reactToMessage} from "../../services/messageService";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import VoiceMessage from "./VoiceMessage";
const MessageBubble = ({ message, own,onReplyClick ,isGroup = false,isFirstInGroup = true,
    isLastInGroup = true,}) => {
    const { editingMessage,cancelEditing } = useMessageMenu();
    const isEditing = editingMessage?._id === message._id;
    const [editText, setEditText] = useState(message.text || "");
    const [imageOpen, setImageOpen] = useState(false);

    useEffect(() => {
        if (isEditing) {
            setEditText(message.text || "");
        }
    }, [isEditing, message.text]);

    const time = new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
    const { setMessages } = useChat();

    const handleSaveEdit = async () => {
        if (!editText.trim()) return;
        try {
            const response = await editMessage( message._id,editText );
            const updatedMessage = response.message;
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === updatedMessage._id ? updatedMessage : msg
                )
            );
            cancelEditing();
        } catch (error) {
            console.error(
                "Failed to edit message:",
                error.response?.data || error
            );
        }
    };
    const handleReactionClick = async (emoji) => {
        try {
            await reactToMessage( message._id, emoji );
        } catch (error) {
            console.error(
                "Reaction failed:",
                error.response?.data || error
            );
        }
    };
    const { user } = useAuth();

    return (
    <>
        <motion.div
            initial={{
                opacity: 0,
                y: 20,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            transition={{
                duration: 0.25,
            }}
            className={`flex ${
                own ? "justify-end" : "justify-start"
            }`}
        >
            <div className={`group relative max-w-[72%] min-w-[90px] px-3.5 py-2.5 border transition-all duration-200 shadow-sm
                ${
                    own
                        ? `
                            bg-[var(--message-own)]
                            text-white
                            border-transparent
                        `
                        : `
                            bg-[var(--message-other)]
                            text-[var(--text-primary)]
                            border-[var(--border-color)]
                        `
                }

                ${
                    isFirstInGroup && isLastInGroup
                        ? "rounded-2xl"
                        : own
                        ? `
                            rounded-l-2xl
                            ${isFirstInGroup ? "rounded-tr-2xl" : "rounded-tr-md"}
                            ${isLastInGroup ? "rounded-br-md" : "rounded-br-md"}
                        `
                        : `
                            rounded-r-2xl
                            ${isFirstInGroup ? "rounded-tl-2xl" : "rounded-tl-md"}
                            ${isLastInGroup ? "rounded-bl-md" : "rounded-bl-md"}
                        `
                }
            `}
            >
            {!message.isDeleted && !isEditing && (
                <MessageActionButton
                    own={own}
                    message={message}
                />
            )}

            {isGroup && !own && isFirstInGroup && (
                <div className="flex items-center gap-2 mb-1.5">
                    {message.sender?.avatar ? (
                        <img
                            src={message.sender.avatar}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[9px] font-bold text-white">
                            {message.sender?.username
                                ?.charAt(0)
                                ?.toUpperCase() || "?"}
                        </div>
                    )}

                    <span className="text-xs font-semibold text-indigo-300">
                        {message.sender?.username || "Unknown user"}
                    </span>
                </div>
            )}

            {/* Reply Quote */}
            {(message.replyTo || message.replyToDeleted) && (
                <div
                    onClick={() => {
                        // Permanently deleted message cannot be opened
                        if (message.replyToDeleted) return;

                        const replyId =
                            typeof message.replyTo === "object"
                                ? message.replyTo?._id
                                : message.replyTo;
                        if (replyId) {
                            onReplyClick?.(replyId);
                        }
                    }}
                    className={`mb-2.5 overflow-hidden rounded-xl border transition ${
                        message.replyToDeleted
                            ? "cursor-default opacity-70"
                            : "cursor-pointer"
                    } ${
                        own
                            ? "border-indigo-400/20 bg-indigo-700/50 hover:bg-indigo-700/70"
                            : "border-[var(--border-color)] bg-[var(--surface-bg)] hover:bg-[var(--surface-hover)]"
                    }`}
                >
                <div className="flex">
                    <div
                        className={`w-1 shrink-0 ${
                            message.replyToDeleted
                                ? "bg-zinc-500"
                                : own
                                ? "bg-indigo-300"
                                : "bg-indigo-500"
                        }`}
                    />
                        <div className="min-w-0 px-3 py-2">
                            <p
                                className={`text-[11px] font-semibold ${
                                    message.replyToDeleted
                                        ? "text-zinc-400"
                                        : own
                                        ? "text-indigo-200"
                                        : "text-indigo-400"
                                }`}
                            >
                                Reply
                            </p>
                            <p className={`mt-0.5 max-w-[280px] truncate text-sm ${
                            own
                                ? "text-white/70"
                                : "text-[var(--text-secondary)]"
                            }`}
                            >
                            {message.replyToDeleted
                                ? "Original message was deleted"
                                : message.replyTo?.text || (message.replyTo?.image
                                    ? "📷 Photo"
                                    : message.replyTo?.audio
                                    ? "🎤 Voice message"
                                    : "Message")}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            {message.reactions?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {Object.entries(
                        message.reactions.reduce(
                            (acc, reaction) => {
                                if (!acc[reaction.emoji]) {
                                    acc[reaction.emoji] = {
                                        count: 0,
                                        reactedByMe: false,
                                    };
                                }
                                acc[reaction.emoji].count++;

                                const reactionUserId = typeof reaction.user === "object"
                                        ? reaction.user?._id?.toString()
                                        : reaction.user?.toString();

                                if ( reactionUserId === user?._id?.toString() ) {
                                    acc[
                                        reaction.emoji
                                    ].reactedByMe = true;
                                }

                                return acc;
                            },
                            {}
                        )
                    ).map(
                        ([
                            emoji,
                            {
                                count,
                                reactedByMe,
                            },
                        ]) => (
                            <button
                                key={emoji}
                                onClick={() =>
                                    handleReactionClick(
                                        emoji
                                    )
                                }
                                className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs transition-all duration-150 hover:scale-105 shadow-sm ${
                                    reactedByMe
                                        ? "border-indigo-400 bg-indigo-500/20"
                                        : "border-[var(--border-color)] bg-[var(--surface-bg)] hover:bg-[var(--surface-hover)]"
                                }`}
                            >
                                <span className="text-sm">
                                    {emoji}
                                </span>

                                {count > 1 && (
                                    <span
                                        className={
                                            reactedByMe
                                                ? "text-indigo-100"
                                                : "text-[var(--text-secondary)]"
                                        }
                                    >
                                        {count}
                                    </span>
                                )}
                            </button>
                        )
                    )}
                </div>
            )}

            {/* Text */}
            {isEditing ? (
                <div className="min-w-[250px]">
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSaveEdit();
                            }

                            if (e.key === "Escape") {
                                cancelEditing();
                            }
                        }}
                        autoFocus
                        className=" w-full px-3 py-2 rounded-lg bg-[var(--input-bg)] text-[var(--text-primary)] border border-[var(--border-color)] outline-none focus:border-indigo-500"
                    />

                    <div className="flex justify-end gap-2 mt-2">
                        <button
                            onClick={cancelEditing}
                            className="px-3 py-1 text-sm rounded-lg bg-white/20 hover:bg-white/30"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={async () => {
                                try {
                                    const response = await editMessage(
                                        message._id,
                                        editText
                                    );
                                    const updatedMessage = response.message;
                                    setMessages((prev) =>
                                        prev.map((msg) =>
                                            msg._id === updatedMessage._id
                                                ? updatedMessage
                                                : msg
                                        )
                                    );
                                    cancelEditing();

                                } catch (error) {
                                    console.error(
                                        "Failed to edit message:",
                                        error.response?.data || error
                                    );
                                }
                            }}
                            disabled={!editText.trim()}
                            className="px-3 py-1 text-sm rounded-lg bg-white text-indigo-600 disabled:opacity-50"
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : message.isDeleted ? (
                <p className=" text-[13px] italic text-[var(--text-secondary)] flex items-center gap-1.5 ">
                    This message was deleted
                </p>
            ) : (
                message.text && (
                    <p className=" text-[15px] leading-[1.45] whitespace-pre-wrap break-words">
                        {message.text}
                    </p>
                )
            )}
                {/* Image */}
            {!message.isDeleted && message.image && (
                <button
                    type="button"
                    onClick={() => setImageOpen(true)}
                    className="mt-2 block overflow-hidden rounded-xl cursor-pointer"
                >
                    <img
                        src={message.image}
                        alt="sent"
                        className=" w-[220px]max-h-[260px] sm:w-[260px] object-cover rounded-xl transition duration-200 hover:brightness-95"
                    />
                </button>
            )}
                {/* File / Document */}
            {!message.isDeleted && message.fileUrl && (
                <div className=" mt-2 flex items-center gap-3 w-[240px] max-w-full p-3 rounded-xl bg-black/20">
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-white/10 flex items-center justify-center text-xl">
                        📄
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                            {message.fileName || "Document"}
                        </p>

                        <p className="text-[11px] opacity-60">
                            {message.fileSize
                                ? `${(message.fileSize / 1024 / 1024).toFixed(2)} MB`
                                : "File"}
                        </p>
                    </div>
                </div>
            )}
                {/* Audio */}
                {/* Voice Message */}
            {!message.isDeleted && message.audio && (
                <VoiceMessage
                    src={message.audio}
                    isOwn={own}
                />
            )}
                {/* Time & Status */}
                <div className={`flex justify-end items-center gap-1 mt-1.5 select-none ${
                        own
                            ? "text-white/70"
                            : "text-[var(--text-secondary)]"
                    }`}
                >
                    {message.isEdited && message.status === "seen" && (
                    <span className="text-[10px] leading-none">
                        edited
                    </span>
                )}

                <span className="text-[11px] opacity-70">
                    {time}
                </span>
                    {own && (
                        <>
                            {message.status === "sent" && (
                                <Check
                                    size={14}
                                    className="opacity-80"
                                />
                            )}
                            {message.status === "delivered" && (
                                <CheckCheck
                                    size={14}
                                    className="opacity-80"
                                />
                            )}
                            {message.status === "seen" && (
                                <CheckCheck
                                    size={14}
                                    className="text-sky-400"
                                />
                            )}
                        </>
                    )}
                </div>
            </div>
        </motion.div>

        {imageOpen && message.image && (
            <div className=" fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-6"
                onClick={() => setImageOpen(false)}
            >
                <button
                    type="button"
                    onClick={() => setImageOpen(false)}
                    className=" absolute top-5 right-5 w-11 h-11 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition"
                >
                    <X size={24} />
                </button>

                <img
                    src={message.image}
                    alt="Full size"
                    onClick={(e) => e.stopPropagation()}
                    className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl"
                />
            </div>
        )}
    </>
    );
};

export default MessageBubble;