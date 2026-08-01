import UserModel from "../model/user.schema.js";
import Chat from "../model/chat.js";

const getAllUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const users = await UserModel.find({
            _id: {
                $ne: currentUserId,
            },
        }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};
const getAvailableUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const chats = await Chat.find({
            isGroup: false,
            participants: currentUserId,
        }).select("participants");
        const excludedIds = new Set();
        excludedIds.add(currentUserId.toString());
        chats.forEach((chat) => {
            chat.participants.forEach((participant) => {
                excludedIds.add(participant.toString());
            });
        });
        const users = await UserModel.find({
            _id: {
                $nin: [...excludedIds],
            },
        }).select("-password");
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};
const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id)
            .select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};
const blockUser = async (req, res) => {
    try {
        const { blockedUserId } = req.body;
        const user = await UserModel.findByIdAndUpdate(
            req.user.id,
            {
                $addToSet: {
                    blockedUsers: blockedUserId,
                },
            },
            {
                new: true,
            }
        );
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};

const unblockUser = async (req, res) => {
    try {
        const { blockedUserId } = req.body;
        const user = await UserModel.findByIdAndUpdate(
            req.user.id,
            {
                $pull: {
                    blockedUsers: blockedUserId,
                },
            },
            {
                new: true,
            }
        );
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
};
export default {
    getAllUsers,
    getAvailableUsers,
    getUserById,
    blockUser,
    unblockUser,
};