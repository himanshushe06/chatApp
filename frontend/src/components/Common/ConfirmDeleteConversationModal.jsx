const ConfirmDeleteConversationModal = ({ isOpen,onClose,onConfirm,loading }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center">
            <div className="w-[420px] rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-white">
                        Delete Conversation
                    </h2>
                    <p className="mt-4 text-zinc-400 leading-7">
                        This will permanently delete all messages in this conversation.
                    </p>
                    <p className="mt-2 text-red-400 text-sm">
                        This action cannot be undone.
                    </p>
                </div>
                <div className="flex justify-end gap-3 border-t border-zinc-800 p-5">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteConversationModal;