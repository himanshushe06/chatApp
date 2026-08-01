import { motion, AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";

const OTPModal = ({ open,email,children }) => {
    if (!open) return null;
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
                <motion.div
                    initial={{
                        scale: 0.9,
                        opacity: 0,
                        y: 30,
                    }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        y: 0,
                    }}
                    exit={{
                        scale: 0.9,
                        opacity: 0,
                    }}
                    transition={{
                        duration: .25,
                    }}
                    className="w-full max-w-md rounded-3xl bg-[var(--surface-bg)] border border-[var(--border-color)] shadow-2xl p-8"
                >
                    <div className="flex justify-center">
                        <div className="h-16 w-16 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center">
                            <Mail
                                size={30}
                                className="text-indigo-600"
                            />
                        </div>
                    </div>

                    <h2 className="mt-6 text-2xl font-bold text-center text-[var(--text-primary)]">
                        Verify your email
                    </h2>

                    <p className="mt-3 text-center text-sm text-[var(--text-secondary)]">
                        We've sent a verification code to
                    </p>

                    <p className="mt-2 text-center font-semibold text-indigo-500">
                        {email}
                    </p>
                    <div className="mt-8">
                        {children}
                    </div>

                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default OTPModal;