import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { CheckCircle2 } from "lucide-react";

const VerificationSuccess = ({
    onContinue,
}) => {
    return (
        <div className="relative">

            <Confetti
                recycle={false}
                numberOfPieces={220}
            />

            <motion.div
                initial={{
                    scale: .8,
                    opacity: 0,
                }}
                animate={{
                    scale: 1,
                    opacity: 1,
                }}
                transition={{
                    duration: .4,
                }}
                className="text-center"
            >
                <motion.div
                    initial={{
                        scale: 0,
                        rotate: -180,
                    }}
                    animate={{
                        scale: 1,
                        rotate: 0,
                    }}
                    transition={{
                        delay: .2,
                        type: "spring",
                    }}
                    className=" mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20 "
                >
                    <CheckCircle2
                        size={60}
                        className="text-green-500"
                    />
                </motion.div>

                <h2 className="mt-8 text-3xl font-bold text-[var(--text-primary)]">
                    Email Verified 🎉
                </h2>

                <p className="mt-4 text-[var(--text-secondary)] leading-7">
                    Congratulations!

                    <br />

                    Your email has been
                    verified successfully.

                </p>

                <button
                    onClick={onContinue}
                    className="mt-10 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700"
                >
                    Continue
                </button>
            </motion.div>

        </div>
    );
};

export default VerificationSuccess;