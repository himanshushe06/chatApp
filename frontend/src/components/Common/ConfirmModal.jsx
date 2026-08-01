import { motion, AnimatePresence } from "framer-motion";

const ConfirmModal = ({ open,title,message,confirmText = "Confirm",cancelText = "Cancel",confirmVariant = "danger",onConfirm,onCancel }) => {
    if (!open) return null;
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[10000] bg-black/50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onCancel}
            >
                <motion.div
                    className="w-[380px] rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl p-6"
                    initial={{
                        opacity: 0,
                        scale: 0.9,
                        y: 20,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.9,
                        y: 20,
                    }}
                    transition={{
                        duration: 0.2,
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-lg font-semibold text-white">
                        {title}
                    </h2>

                    <p className="mt-3 text-sm text-zinc-400">
                        {message}
                    </p>

                    <div className="flex justify-end gap-3 mt-8">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white transition"
                        >
                            {cancelText}
                        </button>

                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 rounded-lg text-white transition ${
                                confirmVariant === "danger"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ConfirmModal;