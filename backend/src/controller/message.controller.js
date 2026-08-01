import Message from "../model/message.js";
import cloudinary from "../config/cloudinary.js";
import Chat from "../model/chat.js";
import UserModel from "../model/user.schema.js";
import { getUserSocketId,getActiveChat } from "../socket/socket.js";
import { getIO } from "../socket/socketManager.js";
const sendMessage = async (req, res) => {
    try {
        const sender = req.user.id;
        const { receiverId, text, replyTo } = req.body;
        const receiverUser = await UserModel.findById(receiverId);
        let replyMessage = null;
        if (replyTo) {
            replyMessage = await Message.findById(replyTo);
            if (!replyMessage) {
                return res.status(404).json({
                    success: false,
                    message: "Original message not found",
                });
            }
            // Make sure the replied message belongs to this conversation
            const belongsToConversation =
                (
                    replyMessage.sender.equals(sender) &&
                    replyMessage.receiver.equals(receiverId)
                ) ||
                (
                    replyMessage.sender.equals(receiverId) &&
                    replyMessage.receiver.equals(sender)
                );

            if (!belongsToConversation) {
                return res.status(403).json({
                    success: false,
                    message: "Cannot reply to this message",
                });
            }
        }
        if (!receiverUser) {
            return res.status(404).json({
                message: "Receiver not found",
            });
        }
        if (receiverUser.blockedUsers.some(id => id.equals(sender))) {
            return res.status(403).json({
                message: "You are blocked",
            });
        }
        // Find existing private chat
        let chat = await Chat.findOne({
            isGroup: false,
            participants: { $all: [sender, receiverId]}
        });
        // First conversation → create pending request
        if (!chat) {
            // Save first message
            const message = await Message.create({
                sender,
                receiver: receiverId,
                text
            });
            const receiverSocketId = getUserSocketId(receiverId);
            if (receiverSocketId) {
                message.status = "delivered";
                await message.save();
            }
            chat = await Chat.create({
                participants: [sender, receiverId],
                requestedBy: sender,
                status: "pending",
                lastMessage: message._id
            });
            // message Link with chat
            message.chatId = chat._id;
            await message.save();
            return res.status(201).json({
                success: true,
                requestSent: true,
                message: "Chat request sent successfully.",
                data: message
            });
        }
        // Request still pending
        if (chat.status === "pending") {
            // Receiver accepting hasn't happened yet
            if (!chat.requestedBy.equals(sender)) {
                return res.status(403).json({
                    success: false,
                    pending: true,
                    message: "Accept the chat request before sending messages."
                });
            }
            return res.status(403).json({
                success: false,
                pending: true,
                message: "Wait until the user accepts your request."
            });
        }
        // Accepted chat → normal messaging
        let message = await Message.create({
            sender,
            receiver: receiverId,
            text,
            chatId: chat._id,
            replyTo: replyTo || null,
        });
        chat.lastMessage = message._id;
        // Generate the same chat ID used by the frontend
        const activeChatId = [sender.toString(), receiverId.toString()]
            .sort()
            .join("_");
        const receiverActiveChat = getActiveChat(receiverId);
        // Increase unread only if receiver is NOT viewing this chat
        if (receiverActiveChat !== activeChatId) {
            const currentUnread = chat.unreadCount.get(receiverId.toString()) || 0;
            chat.unreadCount.set(
                receiverId.toString(),
                currentUnread + 1
            );
        }
        await chat.save();
        const senderSocketId = getUserSocketId(sender);
        const receiverSocketId = getUserSocketId(receiverId);
        // Sender updates immediately
        if (senderSocketId) {
            getIO()
                .to(senderSocketId)
                .emit("receiveMessage", message);
        }
        // Receiver gets the message + unread update
        if (receiverSocketId) {
            getIO()
                .to(receiverSocketId)
                .emit("receiveMessage", message);
            getIO()
                .to(receiverSocketId)
                .emit("unreadUpdated", {
                    chatId: chat._id,
                    count: chat.unreadCount.get(receiverId.toString()),
                });
        }
        return res.status(201).json(message);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
const getMessages = async (req,res)=>{
    try{
        const {senderId,receiverId} = req.params;
        const messages = await Message.find({
            $or: [
                {
                    sender: senderId,
                    receiver: receiverId
                },
                {
                    sender: receiverId,
                    receiver: senderId
                }
            ]
        })
        .populate({
            path: "replyTo",
            select: "text image audio sender isDeleted",
        })
        .sort({ createdAt: 1 });
        res.status(200).json(messages);
    }
    catch(error){   
        res.status(500).json({error:error.message});
    }
};
const markAsSeen = async (req, res) => {
    try {
        const { messageId } = req.params;
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }
        if (!message.receiver.equals(req.user.id)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (message.status !== "seen") {
            message.status = "seen";
            await message.save();
            const senderSocketId = getUserSocketId(message.sender);
            if (senderSocketId) {
                getIO()
                    .to(senderSocketId)
                    .emit("messageSeenUpdate", {
                        messageId: message._id,
                        status: "seen",
                    });
            }
        }
        return res.status(200).json({
            success: true,
            message,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};
const sendImage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const {receiverId,chatId,caption,replyTo } = req.body;
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image is required",
            });
        }
        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                folder: "chat-images",
                resource_type: "image",
            }
        );
        if (chatId) {
            const chat = await Chat.findById(chatId);
            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: "Group not found",
                });
            }
            if (!chat.isGroup) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid group chat",
                });
            }
            // Make sure sender is member
            const isMember = chat.participants.some(
                (participant) =>
                    participant.toString() ===
                    senderId.toString()
            );
            if (!isMember) {
                return res.status(403).json({
                    success: false,
                    message: "You are not a member of this group",
                });
            }
            // Validate reply
            if (replyTo) {
                const repliedMessage = await Message.findById( replyTo );
                if (!repliedMessage) {
                    return res.status(404).json({
                        success: false,
                        message:
                            "Original message not found",
                    });
                }
                if (
                    repliedMessage.chatId?.toString() !==
                    chat._id.toString()
                ) {
                    return res.status(403).json({
                        success: false,
                        message: "Cannot reply to this message",
                    });
                }
            }
            // Create image message
            let message = await Message.create({
                    sender: senderId,
                    receiver: null,
                    chatId: chat._id,
                    image:result.secure_url,
                    text:caption?.trim() || "",
                    replyTo:replyTo || null,
                    status: "sent",
                });
            // Update last message
            chat.lastMessage = message._id;
            // Update unread counts
            for ( const participant of chat.participants) {
                const participantId = participant.toString();
                if ( participantId === senderId.toString()) {
                    continue;
                }
                const currentUnread = chat.unreadCount.get( participantId ) || 0;
                chat.unreadCount.set(
                    participantId,
                    currentUnread + 1
                );
            }
            await chat.save();
            // Populate message
            message = await Message.findById( message._id )
                    .populate(
                        "sender",
                        "_id username avatar"
                    )
                    .populate({
                        path: "replyTo",
                        select:
                            "text image audio sender isDeleted",
                        populate: {
                            path: "sender",
                            select:
                                "_id username avatar",
                        },
                    });
            // Socket delivery
            for ( const participant of chat.participants) {
                const participantId = participant.toString();
                const socketId = getUserSocketId( participantId);
                if (!socketId) continue;
                getIO()
                    .to(socketId)
                    .emit(
                        "receiveGroupMessage",
                        message
                    );
                if ( participantId !== senderId.toString()) {
                    getIO()
                        .to(socketId)
                        .emit(
                            "unreadUpdated",
                            {
                                chatId:chat._id,
                                count:chat.unreadCount.get( participantId ) || 0,
                            }
                        );
                }
            }
            return res
                .status(201)
                .json(message);
        }
        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required",
            });
        }
        // Find private chat
        const chat = await Chat.findOne({
                isGroup: false,
                participants: {
                    $all: [
                        senderId,
                        receiverId,
                    ],
                },
                status: "accepted",
            });
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Accepted conversation not found",
            });
        }
        // Validate reply
        if (replyTo) {
            const repliedMessage = await Message.findById( replyTo );
            if (!repliedMessage) {
                return res.status(404).json({
                    success: false,
                    message: "Original message not found",
                });
            }
            if ( repliedMessage.chatId?.toString() !== chat._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "Cannot reply to this message",
                });
            }
        }
        //Create private image message
        let message = await Message.create({
                sender: senderId,
                receiver: receiverId,
                chatId: chat._id,
                image: result.secure_url,
                text: caption?.trim() || "",
                replyTo: replyTo || null,
            });
        chat.lastMessage = message._id;
        // Unread count
        const activeChatId = [
            senderId.toString(),
            receiverId.toString(),
        ]
            .sort()
            .join("_");
        const receiverActiveChat = getActiveChat(receiverId);
        if ( receiverActiveChat !== activeChatId) {
            const currentUnread = chat.unreadCount.get( receiverId.toString()) || 0;
            chat.unreadCount.set(
                receiverId.toString(),
                currentUnread + 1
            );
        }
        await chat.save();
        message = await Message.findById( message._id)
                .populate(
                    "sender",
                    "_id username avatar"
                )
                .populate({
                    path: "replyTo",
                    select: "text image audio sender isDeleted",
                    populate: {
                        path: "sender",
                        select: "_id username avatar",
                    },
                });
        // Socket delivery
        const senderSocketId = getUserSocketId(senderId);
        const receiverSocketId = getUserSocketId( receiverId );
        if (senderSocketId) {
            getIO()
                .to(senderSocketId)
                .emit(
                    "receiveMessage",
                    message
                );
        }
        if (receiverSocketId) {
            getIO()
                .to(receiverSocketId)
                .emit(
                    "receiveMessage",
                    message
                );
            getIO()
                .to(receiverSocketId)
                .emit(
                    "unreadUpdated",
                    {
                        chatId:chat._id,
                        count:chat.unreadCount.get(receiverId.toString()) || 0,
                    }
                );
        }
        return res
            .status(201)
            .json(message);
    } catch (error) {
        console.error(
            "Send image error:",
            error
        );
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const userId = req.user.id;
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }
        // Normalize sender id
        const senderId = message.sender?._id?.toString() || message.sender?.toString();
        // Only sender can delete for everyone
        if (senderId !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own message",
            });
        }
        if (message.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Message already deleted",
            });
        }
        // Save values BEFORE modifying message
        const chatId = message.chatId?.toString() || null;
        const receiverId =  message.receiver?._id?.toString() ||
                            message.receiver?.toString() ||
                            null;

        // Mark deleted
        message.isDeleted = true;
        message.text = "";
        message.image = null;
        message.audio = null;
        message.file = null;
        message.fileName = null;
        message.fileType = null;
        message.fileSize = null;
        message.reactions = [];
        await message.save();
        // Update replies pointing to this message
        await Message.updateMany(
            {
                replyTo: message._id,
            },
            {
                $set: {
                    replyToDeleted: true,
                },
            }
        );
        const io = getIO();
        const payload = {
            messageId: message._id.toString(),
            chatId,
        };
        if (chatId && !receiverId) {
            io.to(chatId).emit(
                "messageDeleted",
                payload
            );
        }
        else if (receiverId) {
            const senderSocketId = getUserSocketId(senderId);
            const receiverSocketId = getUserSocketId(receiverId);
            // Update sender
            if (senderSocketId) {
                io.to(senderSocketId).emit(
                    "messageDeleted",
                    payload
                );
            }
            // Update receiver
            if (receiverSocketId) {
                io.to(receiverSocketId).emit(
                    "messageDeleted",
                    payload
                );
            }
        }
        return res.status(200).json({
            success: true,
            message: "Message deleted successfully",
            messageId: message._id,
        });
    } catch (error) {
        console.error(
            "Delete message error:",
            error
        );
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const editMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;
        if (!text?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty",
            });
        }
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }
        if (message.sender?.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message:
                    "You can only edit your own message",
            });
        }

        if (message.isDeleted) {
            return res.status(400).json({
                success: false,
                message:
                    "Deleted messages cannot be edited",
            });
        }

        const EDIT_TIME_LIMIT = 15 * 60 * 1000;

        const createdAt = new Date(message.createdAt).getTime();

        if ( Date.now() - createdAt >EDIT_TIME_LIMIT) {
            return res.status(403).json({
                success: false,
                message:
                    "Message can only be edited within 15 minutes",
            });
        }
        message.text = text.trim();
        message.isEdited = true;
        await message.save();
        const updatedMessage = await Message.findById(message._id)
                .populate(
                    "sender",
                    "username avatar email"
                )
                .populate({
                    path: "replyTo",
                    populate: {
                        path: "sender",
                        select: "username avatar",
                    },
                })
                .populate(
                    "reactions.user",
                    "username avatar"
                );
        const io = getIO();
        if (message.chatId) {
            io.to(
                message.chatId.toString()
            ).emit(
                "messageEdited",
                updatedMessage
            );
        } else {
            const receiverSocketId =
                getUserSocketId(
                    message.receiver
                );
            if (receiverSocketId) {
                io.to(receiverSocketId).emit(
                    "messageEdited",
                    updatedMessage
                );
            }
        }
        return res.status(200).json({
            success: true,
            message: updatedMessage,
        });
    } catch (error) {
        console.error(
            "Edit message error:",
            error
        );
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const sendVoice = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { receiverId, chatId, replyTo } = req.body;
        // Make sure audio exists
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Audio file is required",
            });
        }
        // Upload audio to Cloudinary
        const result = await cloudinary.uploader.upload(
            req.file.path,
            {
                resource_type: "video",
                folder: "chat-voice",
            }
        );
        if (chatId) {
            const chat = await Chat.findById(chatId);
            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: "Group not found",
                });
            }
            if (!chat.isGroup) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid group chat",
                });
            }
            const isMember = chat.participants.some(
                (participant) =>
                    participant.toString() === senderId.toString()
            );
            if (!isMember) {
                return res.status(403).json({
                    success: false,
                    message: "You are not a member of this group",
                });
            }
            let message = await Message.create({
                sender: senderId,
                receiver: null,
                chatId: chat._id,
                audio: result.secure_url,
                replyTo: replyTo || null,
                status: "sent",
            });
            chat.lastMessage = message._id;
            await chat.save();
            message = await Message.findById(message._id)
                .populate(
                    "sender",
                    "_id username avatar"
                )
                .populate({
                    path: "replyTo",
                    select: "text image audio sender isDeleted",
                    populate: {
                        path: "sender",
                        select: "_id username avatar",
                    },
                });
            // Send to all group members
            for (const participant of chat.participants) {
                const socketId = getUserSocketId(
                    participant.toString()
                );
                if (socketId) {
                    getIO()
                        .to(socketId)
                        .emit(
                            "receiveGroupMessage",
                            message
                        );
                }
            }
            return res.status(201).json(message);
        }
        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required",
            });
        }
        const chat = await Chat.findOne({
            isGroup: false,
            participants: {
                $all: [
                    senderId,
                    receiverId
                ],
            },
            status: "accepted",
        });
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Accepted conversation not found",
            });
        }
        let message = await Message.create({
            sender: senderId,
            receiver: receiverId,
            chatId: chat._id,
            audio: result.secure_url,
            replyTo: replyTo || null,
            status: "sent",
        });
        // Update last message
        chat.lastMessage = message._id;
        const activeChatId = [
            senderId.toString(),
            receiverId.toString(),
        ]
            .sort()
            .join("_");
        const receiverActiveChat = getActiveChat(receiverId);
        if ( receiverActiveChat !== activeChatId) {
            const currentUnread = chat.unreadCount.get( receiverId.toString()) || 0;
            chat.unreadCount.set(
                receiverId.toString(),
                currentUnread + 1
            );
        }
        await chat.save();
        // Populate message
        message = await Message.findById(message._id)
            .populate(
                "sender",
                "_id username avatar"
            )
            .populate({
                path: "replyTo",
                select: "text image audio sender isDeleted",
                populate: {
                    path: "sender",
                    select: "_id username avatar",
                },
            });
        const senderSocketId = getUserSocketId(senderId);
        const receiverSocketId = getUserSocketId(receiverId);
        // Sender
        if (senderSocketId) {
            getIO()
                .to(senderSocketId)
                .emit(
                    "receiveMessage",
                    message
                );
        }
        // Receiver
        if (receiverSocketId) {
            getIO()
                .to(receiverSocketId)
                .emit(
                    "receiveMessage",
                    message
                );
            getIO()
                .to(receiverSocketId)
                .emit(
                    "unreadUpdated",
                    {
                        chatId: chat._id,
                        count: chat.unreadCount.get(receiverId.toString()) || 0,
                    }
                );
        }
        return res
            .status(201)
            .json(message);
    } catch (error) {
        console.error(
            "Send voice error:",
            error
        );
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const resetUnreadCount = async (req, res) => {
    try 
    {
        const { chatId } = req.params;
        const userId = req.user.id;
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                message: "Chat not found"
            });
        }
        chat.unreadCount.set(userId.toString(), 0);
        await chat.save();
        const socketId = getUserSocketId(userId);
        if (socketId) {
            getIO()
                .to(socketId)
                .emit("unreadUpdated", {
                    chatId,
                    count: 0,
                });
        }
        return res.json({
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
};
const reactToMessage = async (req, res) => {
    try {
        const { messageId } = req.params;
        const { emoji } = req.body;
        const userId = req.user.id;
        if (!emoji) {
            return res.status(400).json({
                success: false,
                message: "Emoji is required",
            });
        }
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "Message not found",
            });
        }
        if (message.isDeleted) {
            return res.status(400).json({
                success: false,
                message: "Cannot react to deleted message",
            });
        }
        const senderId = message.sender?._id?.toString() || message.sender?.toString();
        const receiverId =  message.receiver?._id?.toString() ||
                            message.receiver?.toString() ||
                            null;
        const chatId = message.chatId?.toString() || null;
        const isGroupMessage = !receiverId;
        if (isGroupMessage) {
            if (!chatId) {
                return res.status(400).json({
                    success: false,
                    message: "Group chat not found",
                });
            }
            const chat = await Chat.findById(chatId);
            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: "Chat not found",
                });
            }
            const isMember = chat.participants.some(
                (participant) =>
                    participant.toString() ===
                    userId.toString()
            );
            if (!isMember) {
                return res.status(403).json({
                    success: false,
                    message: "You are not a member of this group",
                });
            }
        } else {
            const allowed = senderId === userId.toString() || receiverId === userId.toString();
            if (!allowed) {
                return res.status(403).json({
                    success: false,
                    message: "You cannot react to this message",
                });
            }
        }
        const existingReactionIndex =
            message.reactions.findIndex(
                (reaction) => {
                    const reactionUserId = reaction.user?._id?.toString() || reaction.user?.toString();
                    return (
                        reactionUserId === userId.toString()
                    );
                }
            );
        if (existingReactionIndex !== -1) {
            const existingReaction = message.reactions[ existingReactionIndex ];
            // Same emoji clicked again,REMOVE reaction
            if (existingReaction.emoji === emoji) {
                message.reactions.splice(existingReactionIndex,1);
            }
            // Different emoji,CHANGE reaction
            else { 
                message.reactions[ existingReactionIndex].emoji = emoji;
            }
        }
        // User has no reaction yet
        else {
            message.reactions.push({
                user: userId,
                emoji,
            });
        }
        await message.save();
        const updatedMessage = await Message.findById(message._id)
                .populate(
                    "sender",
                    "username avatar email"
                )
                .populate(
                    "reactions.user",
                    "username avatar"
                )
                .populate({
                    path: "replyTo",
                    populate: {
                        path: "sender",
                        select: "username avatar",
                    },
                });
        const io = getIO();
        // GROUP
        if (isGroupMessage) {
            io.to(chatId).emit(
                "messageReactionUpdated",
                updatedMessage
            );
        }
        // PRIVATE
        else {
            const senderSocketId = getUserSocketId(senderId);
            const receiverSocketId = getUserSocketId(receiverId);
            if (senderSocketId) {
                io.to(senderSocketId).emit(
                    "messageReactionUpdated",
                    updatedMessage
                );
            }
            if ( receiverSocketId &&receiverSocketId !== senderSocketId ) {
                io.to(receiverSocketId).emit(
                    "messageReactionUpdated",
                    updatedMessage
                );
            }
        }
        return res.status(200).json({
            success: true,
            message: updatedMessage,
        });
    } catch (error) {
        console.error(
            "React message error:",
            error
        );
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const sendGroupMessage = async (req, res) => {
    try {
        const senderId = req.user.id;
        const { chatId, text, replyTo } = req.body;
        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "Group chat ID is required",
            });
        }
        if (!text?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message cannot be empty",
            });
        }
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }
        if (!chat.isGroup) {
            return res.status(400).json({
                success: false,
                message: "This is not a group chat",
            });
        }
        const isMember = chat.participants.some(
            (participant) =>
                participant.toString() === senderId.toString()
        );
        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "You are not a member of this group",
            });
        }
        if (replyTo) {
            const repliedMessage = await Message.findById(replyTo);
            if (!repliedMessage) {
                return res.status(404).json({
                    success: false,
                    message: "Original message not found",
                });
            }
            if ( repliedMessage.chatId?.toString() !== chat._id.toString() ) {
                return res.status(403).json({
                    success: false,
                    message: "Cannot reply to this message",
                });
            }
        }
        let message = await Message.create({
            sender: senderId,
            receiver: null,
            chatId: chat._id,
            text: text.trim(),
            replyTo: replyTo || null,
            status: "sent",
        });
        chat.lastMessage = message._id;
        for (const participant of chat.participants) {
            const participantId = participant.toString();
            if (participantId === senderId.toString()) {
                continue;
            }
            const currentUnread = chat.unreadCount.get(participantId) || 0;
            chat.unreadCount.set( participantId,currentUnread + 1 );
        }
        await chat.save();
        message = await Message.findById(message._id)
            .populate(
                "sender",
                "_id username avatar"
            )
            .populate({
                path: "replyTo",
                select:"text image audio sender isDeleted",
                populate: {
                    path: "sender",
                    select: "_id username avatar",
                },
            });
        for (const participant of chat.participants) {
            const participantId = participant.toString();
            const socketId = getUserSocketId(participantId);
            if (!socketId) continue;
            getIO()
                .to(socketId)
                .emit(
                    "receiveGroupMessage",
                    message
                );
            if ( participantId !== senderId.toString()) {
                getIO()
                    .to(socketId)
                    .emit("unreadUpdated", {
                        chatId: chat._id,
                        count:
                            chat.unreadCount.get(
                                participantId
                            ) || 0,
                    });
            }
        }
        return res.status(201).json(message);
    } catch (error) {
        console.error(
            "Send group message error:",
            error
        );
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
const getGroupMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Group not found",
            });
        }
        if (!chat.isGroup) {
            return res.status(400).json({
                success: false,
                message: "This is not a group chat",
            });
        }
        const isMember = chat.participants.some(
            (participant) =>
                participant.toString() ===
                userId.toString()
        );
        if (!isMember) {
            return res.status(403).json({
                success: false,
                message:
                    "You are not a member of this group",
            });
        }
        const messages = await Message.find({ chatId: chat._id })
            .populate(
                "sender",
                "_id username avatar"
            )
            .populate({
                path: "replyTo",
                select: "text image audio sender isDeleted",
                populate: {
                    path: "sender",
                    select: "_id username avatar",
                },
            })
            .populate(
                "reactions.user",
                "_id username avatar"
            )
            .sort({ createdAt: 1 });
        return res.status(200).json(messages);
    } catch (error) {
        console.error(
            "Get group messages error:",
            error
        );
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
const sendFile = async ({ file,receiverId = null,chatId = null,replyTo = null }) => {
    const formData = new FormData();
    formData.append("file", file);
    if (receiverId) {
        formData.append(
            "receiverId",
            receiverId
        );
    }
    if (chatId) {
        formData.append(
            "chatId",
            chatId
        );
    }
    if (replyTo) {
        formData.append(
            "replyTo",
            replyTo
        );
    }
    const { data } =
        await axiosInstance.post(
            "/messages/file",
            formData
        );
    return data;
};
export default {
    sendMessage,
    getMessages,
    markAsSeen,
    sendImage,
    deleteMessage,
    editMessage,
    sendVoice,
    resetUnreadCount,
    reactToMessage,
    sendGroupMessage,
    getGroupMessages,
    sendFile
};