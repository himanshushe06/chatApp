import { Calendar,Mail,Pencil,LogOut } from "lucide-react";
import { useState } from "react";
import Modal from "../Common/Modal";
import EditProfileModal from "./EditProfileModal";
import ImagePreviewModal from "../Common/ImagePreviewModal";

const ProfileModal = ({ isOpen,onClose,user,onLogout }) => {
    const [editOpen, setEditOpen] = useState(false);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    if (!user) return null;
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="My Profile"
        >
            <div className="flex flex-col items-center">
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.username || "My profile"}
                        onClick={() =>
                            setImagePreviewOpen(true)
                        }
                        className="h-28 w-28 rounded-full object-cover cursor-zoom-in transition duration-200 hover:scale-105 hover:opacity-90"
                    />
                ) : (
                    <div className="w-28 h-28 rounded-full bg-indigo-600 flex items-center justify-center text-4xl text-white font-bold">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>
                )}

                <h2 className="mt-5 text-2xl font-bold text-white">
                    {user.username}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-zinc-400">
                    <Mail size={16} />
                    {user.email}
                </div>
                <div className="w-full mt-6 space-y-4">
                    <div className="bg-zinc-800 rounded-xl p-4">
                        <p className="text-xs uppercase text-zinc-500">
                            About
                        </p>
                        <p className="mt-2 text-white">
                            {user.about ||
                                "Hey there! I'm using Chat App."}
                        </p>
                    </div>
                    <div className="bg-zinc-800 rounded-xl p-4 flex items-center gap-3">
                        <Calendar
                            size={18}
                            className="text-indigo-400"
                        />
                        <div>
                            <p className="text-xs text-zinc-500">
                                Joined
                            </p>
                            <p className="text-white">
                                {new Date(
                                    user.createdAt
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="w-full mt-6 flex flex-col gap-3">
                    <button
                        onClick={() => setEditOpen(true)}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
                    >
                        <Pencil size={18} />
                        Edit Profile
                    </button>
                    <button
                        onClick={onLogout}
                        className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                    <EditProfileModal
                        isOpen={editOpen}
                        onClose={() => setEditOpen(false)}
                    />
                </div>
                    <ImagePreviewModal
                        isOpen={imagePreviewOpen}
                        onClose={() =>
                            setImagePreviewOpen(false)
                        }
                        src={user?.avatar}
                        alt={user?.username || "My profile"}
                    />
            </div>
        </Modal>
    );
};

export default ProfileModal;