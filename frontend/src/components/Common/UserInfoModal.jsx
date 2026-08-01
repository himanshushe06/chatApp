import { X,Mail,CircleUserRound } from "lucide-react";
import { useState } from "react";
import ImagePreviewModal from "../Common/ImagePreviewModal";

const UserInfoModal = ({ isOpen,onClose,user,isOnline }) => {
    if (!isOpen || !user) return null;
    const [imagePreviewOpen, setImagePreviewOpen] =
    useState(false);
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
            onMouseDown={onClose}
        >
            <div
                onMouseDown={(e) => e.stopPropagation()}
                className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
                    <h2 className="text-lg font-semibold text-white">
                        User Info
                    </h2>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col items-center px-6 py-7">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.username || "User"}
                            onClick={() =>
                                setImagePreviewOpen(true)
                            }
                            className="h-24 w-24 rounded-full object-cover cursor-zoom-in transition duration-200 hover:scale-105 hover:opacity-90"
                        />
                    ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-indigo-600 text-3xl font-bold text-white">
                            {user.username
                                ?.charAt(0)
                                .toUpperCase()}
                        </div>
                    )}

                    <h3 className="mt-4 text-xl font-semibold text-white">
                        {user.username}
                    </h3>

                    <p
                        className={`mt-1 text-sm ${
                            isOnline
                                ? "text-green-400"
                                : "text-zinc-500"
                        }`}
                    >
                        {isOnline ? "Online" : "Offline"}
                    </p>
                </div>

                <div className="border-t border-zinc-800 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <Mail
                            size={19}
                            className="text-zinc-500"
                        />

                        <div>
                            <p className="text-xs text-zinc-500">
                                Email
                            </p>

                            <p className="text-sm text-zinc-200">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                        <CircleUserRound
                            size={19}
                            className="text-zinc-500"
                        />

                        <div>
                            <p className="text-xs text-zinc-500">
                                Username
                            </p>

                            <p className="text-sm text-zinc-200">
                                {user.username}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <ImagePreviewModal
                isOpen={imagePreviewOpen}
                onClose={() =>
                    setImagePreviewOpen(false)
                }
                src={user?.avatar}
                alt={user?.username || "User"}
            />
        </div>
    );
};

export default UserInfoModal;