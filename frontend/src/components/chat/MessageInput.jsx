import {Smile,Paperclip,Send,Mic,X} from "lucide-react";
import { useEffect,useRef,useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { sendMessage,sendGroupMessage,sendImage,sendFile,sendVoice } from "../../services/messageService";
import { useSocket } from "../../context/SocketContext";
import { useMessageMenu } from "../../context/MessageMenuContext";

const MessageInput = () => {
    const { user } = useAuth();
    const { socket } = useSocket();
    const {selectedUser,setMessages,selectedChat} = useChat();

    const fileInputRef = useRef(null);
    const attachmentInputRef = useRef(null);
    const emojiRef = useRef(null);
    const inputRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recordingTimerRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const imageInputRef = useRef(null);

    const [text, setText] = useState("");
    const [emojiOpen, setEmojiOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordedAudio, setRecordedAudio] = useState(null);
    const [audioPreview, setAudioPreview] = useState(null);
    const [sendingVoice, setSendingVoice] = useState(false);

    const emojis = [
        "😀", "😂", "🤣", "😊", "😍",
        "🥰", "😘", "😎", "🤔", "😢",
        "😭", "😡", "🥳", "😴", "🤯",
        "👍", "👎", "👏", "🙏", "💪",
        "🔥", "❤️", "💯", "🎉", "✨",
        "👌", "🤝", "👀", "💀", "🙌",
    ];
    const handleEmojiSelect = (emoji) => {
        const input = inputRef.current;
        if (!input) {
            setText((prev) => prev + emoji);
            return;
        }
        const start = input.selectionStart ?? text.length;
        const end = input.selectionEnd ?? text.length;
        const newText = text.slice(0, start) + emoji + text.slice(end);
        setText(newText);
        requestAnimationFrame(() => {
            input.focus();
            const newPosition = start + emoji.length;
            input.setSelectionRange(
                newPosition,
                newPosition
            );
        });
    };
    const handleSend = async () => {
        if (!user?._id || !text.trim() || !selectedChat) return;
        try {
            let newMessage;
            if (selectedChat.isGroup) {
                newMessage = await sendGroupMessage({
                    chatId: selectedChat._id,
                    text: text.trim(),
                    replyTo: replyingTo?._id || null,
                });
            } else {
                if (!selectedUser?._id) return;
                newMessage = await sendMessage({
                    receiverId: selectedUser._id,
                    text: text.trim(),
                    replyTo: replyingTo?._id || null,
                });
            }
            setMessages((prev) => {
                const exists = prev.some(
                    (message) =>
                        message._id === newMessage._id
                );
                if (exists) return prev;
                return [...prev, newMessage];
            });
            setText("");
            setEmojiOpen(false);
            cancelReply();
        } catch (error) {
            console.error(
                "Send message failed:",
                error.response?.data || error
            );
        }
    };
    const handleSendImage = async () => {
        if ( !selectedImage || !selectedChat || uploadingImage) {
            return;
        }

        try {
            setUploadingImage(true);
            let newMessage;
            if (selectedChat.isGroup) {
                newMessage = await sendImage({
                        file:selectedImage,
                        chatId:selectedChat._id,
                        caption:text.trim(),
                        replyTo:replyingTo?._id || null,
                    });
            } else {
                if (!selectedUser?._id) {
                    return;
                }
                newMessage = await sendImage({
                        file:selectedImage,
                        receiverId:selectedUser._id,
                        caption:text.trim(),
                        replyTo:replyingTo?._id ||null,
                    });
            }

            setMessages((prev) => {
                const exists = prev.some( (message) => message._id === newMessage._id );
                if (exists) {
                    return prev;
                }
                return [
                    ...prev,
                    newMessage,
                ];
            });
            if (imagePreview) {
                URL.revokeObjectURL( imagePreview );
            }
            setSelectedImage(null);
            setImagePreview(null);
            setText("");
            if (imageInputRef.current) {
                imageInputRef.current.value = "";
            }
            cancelReply();

        } catch (error) {
            console.error(
                "Image send failed:",
                error.response?.data ||
                    error
            );
        } finally {
            setUploadingImage(false);
        }
    };
    const handleSendFile = async () => {
        if ( !selectedFile || !selectedChat ) {
            return;
        }
        try {
            let newMessage;
            if (selectedChat.isGroup) {
                newMessage = await sendFile({
                    file: selectedFile,
                    chatId: selectedChat._id,
                    replyTo: replyingTo?._id || null,
                });
            } else {
                if (!selectedUser?._id) return;
                newMessage = await sendFile({
                    file: selectedFile,
                    receiverId: selectedUser._id,
                    replyTo: replyingTo?._id || null,
                });
            }
            setMessages((prev) => {
                const exists = prev.some(
                    (message) =>
                        message._id === newMessage._id
                );
                if (exists) return prev;
                return [
                    ...prev,
                    newMessage
                ];
            });
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            cancelReply();
        } catch (error) {
            console.error(
                "File send failed:",
                error.response?.data || error
            );
        }
    };
    const handleAttachmentSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // IMAGE
        if (file.type.startsWith("image/")) {
            setSelectedImage(file);
            setSelectedFile(null);

            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
            return;
        }
        // NORMAL FILE - PDF, DOCX, ZIP etc.
        setSelectedFile(file);
        setSelectedImage(null);
        setImagePreview(null);
    };
    const handleMainSend = async () => {
        // VOICE
        if (recordedAudio) {
            await handleSendVoiceFile(
                recordedAudio
            );
            return;
        }
        // IMAGE
        if (selectedImage) {
            await handleSendImage();
            return;
        }
        // FILE
        if (selectedFile) {
            await handleSendFile();
            return;
        }
        // TEXT
        if (text.trim()) {
            await handleSend();
        }
    };
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
            mediaStreamRef.current = stream;
            const recorder = new MediaRecorder(stream);
            mediaRecorderRef.current = recorder;
            audioChunksRef.current = [];
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(
                        event.data
                    );
                }
            };
            recorder.onstop = () => {
                const blob = new Blob(
                    audioChunksRef.current,
                    {
                        type:
                            recorder.mimeType ||
                            "audio/webm",
                    }
                );
                const extension = recorder.mimeType?.includes("mp4") ? "m4a" : "webm";
                const file = new File( [blob], `voice-${Date.now()}.${extension}`,
                    {
                        type:recorder.mimeType || "audio/webm",
                    }
                );
                setRecordedAudio(file);
                const url = URL.createObjectURL(blob);
                setAudioPreview(url);
                mediaStreamRef.current
                    ?.getTracks()
                    .forEach((track) =>
                        track.stop()
                    );
                mediaStreamRef.current = null;
            };
            recorder.start();
            setIsRecording(true);
            setRecordingTime(0);
            recordingTimerRef.current =
                setInterval(() => {
                    setRecordingTime(
                        (prev) => prev + 1
                    );
                }, 1000);
        } catch (error) {
            console.error(
                "Microphone access failed:",
                error
            );
        }
    };
    const stopRecording = () => {
        if ( mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
        clearInterval( recordingTimerRef.current );
        recordingTimerRef.current = null;
    };
    const handleSendVoiceFile = async (audioFile) => {
        if (!audioFile || !selectedChat || sendingVoice ) {
            return;
        }
        try {
            setSendingVoice(true);
            let newMessage;
            if (selectedChat.isGroup) {
                newMessage = await sendVoice({
                    file: audioFile,
                    chatId: selectedChat._id,
                    replyTo: replyingTo?._id || null,
                });
            } else {
                if (!selectedUser?._id) return;
                newMessage = await sendVoice({
                    file: audioFile,
                    receiverId: selectedUser._id,
                    replyTo: replyingTo?._id || null,
                });
            }
            setMessages((prev) => {
                const exists = prev.some( (message) => message._id === newMessage._id );
                if (exists) return prev;
                return [...prev, newMessage];
            });
            if (audioPreview) {
                URL.revokeObjectURL(audioPreview);
            }
            setRecordedAudio(null);
            setAudioPreview(null);
            setRecordingTime(0);
            cancelReply();
        } catch (error) {
            console.error(
                "Voice send failed:",
                error.response?.data || error
            );
        } finally {
            setSendingVoice(false);
        }
    };

    const handleSendVoice = () => {
        if (!recordedAudio) return;
        handleSendVoiceFile(recordedAudio);
    };
    const cancelRecording = () => {
        if ( mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive" ) {
            mediaRecorderRef.current.onstop =
                null;
            mediaRecorderRef.current.stop();
        }
        mediaStreamRef.current ?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
        clearInterval( recordingTimerRef.current );
        recordingTimerRef.current = null;
        if (audioPreview) {
            URL.revokeObjectURL(
                audioPreview
            );
        }

        setIsRecording(false);
        setRecordingTime(0);
        setRecordedAudio(null);
        setAudioPreview(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if ( emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiOpen(false);
            }
        };
        document.addEventListener(
            "mousedown",
            handleClickOutside
        );
        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const { replyingTo,cancelReply } = useMessageMenu();
    const canSend =text.trim().length > 0 ||
                    selectedImage !== null ||
                    selectedFile !== null ||
                    recordedAudio !== null ||
                    isRecording;
        
    return (
        <div className="bg-[var(--header-bg)] border-t border-[var(--border-color)] transition-colors duration-200">

            {/* Reply Preview */}
            {replyingTo && (
                <div className="px-4 pt-3">

                    {/* Accent */}
                    <div className="w-1 bg-indigo-500 shrink-0" />
                    {/* Content */}
                    <div className="flex-1 min-w-0 px-3 py-2.5">
                        <p className="text-xs font-semibold text-indigo-400">
                            Replying to message
                        </p>

                        <p className="mt-0.5 text-sm text-[var(--text-secondary)] truncate">
                            {replyingTo.isDeleted
                                ? "This message was deleted"
                                : replyingTo.text ||
                                (replyingTo.image
                                    ? "📷 Photo"
                                    : replyingTo.audio
                                    ? "🎤 Voice message"
                                    : "Message")}
                        </p>
                    </div>

                    {/* Close */}
                    <button
                        type="button"
                        onClick={cancelReply}
                        className=" flex items-center justify-center px-4 text-[var(--text-secondary)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                        aria-label="Cancel reply"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}
            {/* Image Preview */}
            {imagePreview && (
                <div className="px-4 pt-3">
                    <div className="relative inline-block">
                        <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-52 max-w-64 rounded-xl object-cover border border-zinc-700"
                        />

                        <button
                            type="button"
                            onClick={() => {
                                URL.revokeObjectURL(imagePreview);
                                setSelectedImage(null);
                                setImagePreview(null);
                                if (imageInputRef.current) {
                                    imageInputRef.current.value = "";
                                }
                            }}
                            className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-zinc-950 text-white flex items-center justify-center"
                        >
                            <X size={15} />
                        </button>
                    </div>
                </div>
            )}

            {/* Message Input */}
            <div className="h-20 px-5 flex items-center gap-4">

                {/* Emoji */}
                <div ref={emojiRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setEmojiOpen((prev) => !prev)}
                        className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200
                            ${
                                emojiOpen
                                    ? "bg-[var(--surface-hover)] text-[var(--accent)]"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                            }
                        `}
                        title="Emoji"
                    >
                        <Smile size={22} />
                    </button>

                    {emojiOpen && (
                        <div className="absolute bottom-12 left-0 z-[100] w-72 rounded-2xl border border-zinc-700 bg-zinc-900 p-3 shadow-2xl">
                            <div className="mb-3">
                                <p className="text-sm font-semibold text-white">
                                    Emojis
                                </p>

                                <p className="text-xs text-zinc-500">
                                    Pick an emoji
                                </p>
                            </div>

                            <div className="grid grid-cols-6 gap-1">
                                {emojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() =>
                                            handleEmojiSelect(emoji)
                                        }
                                        className="flex h-9 w-9 items-center justify-center rounded-lg text-xl transition hover:bg-zinc-800 active:scale-90"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Image Input */}
                <input
                    ref={attachmentInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,.zip"
                    onChange={handleAttachmentSelect}
                    className="hidden"
                />

                {/* Attachment */}
                    <button
                        type="button"
                        onClick={() =>
                            attachmentInputRef.current?.click()
                        }
                        className="text-zinc-400 hover:text-white"
                    >
                        <Paperclip size={22} />
                    </button>

                    {/* Text*/}
                    {isRecording ? (
                        <div className="flex-1 min-w-0 bg-zinc-800 rounded-full px-5 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-red-400 text-sm font-medium">
                                    Recording
                                </span>
                                <span className="text-zinc-300 text-sm font-mono">
                                    {Math.floor(recordingTime / 60)}:
                                    {String(recordingTime % 60).padStart(2, "0")}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={cancelRecording}
                                className=" text-zinc-400 hover:text-red-400 text-sm transition"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={
                                selectedImage
                                    ? "Add a caption..."
                                    : replyingTo
                                    ? "Type your reply..."
                                    : "Type your message..."
                            }
                            className="flex-1 min-w-0 bg-[var(--input-bg)] border border-transparent rounded-full px-5 py-3 outline-none text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-all duration-200 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] focus:ring-opacity-20"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    if (!canSend || uploadingImage) return;
                                    handleMainSend();
                                }
                            }}
                        />
                    )}

                    {/* Voice */}
                    <button
                        type="button"
                        onClick={
                            isRecording
                                ? stopRecording
                                : startRecording
                        }
                        className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200
                            ${
                                isRecording
                                    ? "bg-red-500/10 text-red-500 animate-pulse"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]"
                            }
                        `}
                    >
                        <Mic size={22} />
                    </button>

                    {/* Send */}
                    <button
                        type="button"
                        onClick={handleMainSend}
                        disabled={!canSend || uploadingImage}
                        className={`
                            h-11 w-11 shrink-0
                            rounded-full
                            flex items-center justify-center
                            transition-all duration-200
                            ${
                                canSend && !uploadingImage
                        ? `
                            bg-[var(--accent)]
                            text-white
                            cursor-pointer
                            hover:scale-105
                            active:scale-95
                            shadow-sm
                        `
                        : `
                            bg-[var(--surface-bg)]
                            text-[var(--text-secondary)]
                            cursor-default
                        `
                            }
                        `}
                    >
                        <Send size={18} />
                    </button>

                </div>
            </div>
        );
};

export default MessageInput;