import { useEffect } from "react";
import { X } from "lucide-react";

const Modal = ({ isOpen,onClose,title,children,width = "max-w-md" }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);
        return () => {
            document.body.style.overflow = "auto";
            window.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [isOpen, onClose]);
    if (!isOpen) return null;
    return (
        <div
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`w-full ${width} bg-[var(--modal-bg)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200`}
            >
                <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-color)]">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                        {title}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]transition"
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;