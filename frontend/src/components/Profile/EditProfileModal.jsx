import { useEffect, useState } from "react";
import Modal from "../Common/Modal";
import { updateProfile } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const EditProfileModal = ({ isOpen,onClose }) => {
    const { user, updateUser } = useAuth();
    const [saving, setSaving] = useState(false);
    const [username, setUsername] = useState("");
    const [about, setAbout] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState("");
    useEffect(() => {
        if (!isOpen || !user) return;
        setUsername(user.username || "");
        setAbout(user.about || "");
        setAvatar(null);
        setPreview(user.avatar || "");

    }, [isOpen, user]);

    const handleSubmit = async () => {
        try {
            setSaving(true);
            const formData = new FormData();
            formData.append("username", username);
            formData.append("about", about);
            if (avatar) {
                formData.append("avatar", avatar);
            }
            const res = await updateProfile(formData);
            updateUser(res.user);
            onClose();
        } catch (error) {
            console.error(err);
            alert(
                err.response?.data?.message ||
                "Failed to update profile."
            );
        } finally {
            setSaving(false);
        }
    };
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Profile"
        >
            <div className="space-y-5">
                <div className="flex justify-center">
                    <label className="cursor-pointer">
                        <img
                            src={
                                preview || "https://placehold.co/150x150"
                            }
                            alt=""
                            className="w-28 h-28 rounded-full object-cover"
                        />
                        <input
                            hidden
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                setAvatar(file);
                                setPreview(
                                    URL.createObjectURL(file)
                                );
                            }}
                        />
                    </label>
                </div>
                <input
                    className="w-full bg-zinc-800 rounded-xl p-3 text-white outline-none"
                    value={username}
                    onChange={(e) =>
                        setUsername(e.target.value)
                    }
                    placeholder="Username"
                />
                <textarea
                    className="w-full bg-zinc-800 rounded-xl p-3 text-white outline-none"
                    rows={4}
                    value={about}
                    onChange={(e) =>
                        setAbout(e.target.value)
                    }
                    placeholder="About"
                />
                <button
                    disabled={saving}
                    onClick={handleSubmit}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 rounded-xl py-3 text-white font-semibold disabled:opacity-50"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </Modal>
    );
};

export default EditProfileModal;