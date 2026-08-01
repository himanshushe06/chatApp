import { useRef } from "react";

const OTPInput = ({ otp, setOtp,onComplete,}) => {
    const inputRefs = useRef([]);

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = value;
        setOtp(updatedOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" &&!otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "ArrowLeft" &&index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        if (e.key === "ArrowRight" &&index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData("text")
            .trim();
        if (!/^\d{6}$/.test(pasted)) return;
        const values = pasted.split("");
        setOtp(values);
        values.forEach((value, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = value;
            }
        });
        inputRefs.current[5]?.focus();
    };

    return (
        <div
            className="flex justify-center gap-3"
            onPaste={handlePaste}
        >
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(element) =>
                        (inputRefs.current[index] =
                            element)
                    }
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                        handleChange(
                            e.target.value,
                            index
                        );
                        const updated = [...otp];
                        updated[index] = e.target.value;
                        if ( updated.every((digit) => digit !== "")) {
                            setTimeout(() => {
                                if (typeof onComplete === "function") {
                                        onComplete(updated.join(""));
                                    }
                            }, 150);
                        }
                    }}
                    onKeyDown={(e) =>
                        handleKeyDown(
                            e,
                            index
                        )
                    }
                    className="h-14 w-14 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-bg)] text-center text-2xl font-bold text-[var(--text-primary)] outline-none transition-all duration-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20"
                />
            ))}
        </div>
    );
};

export default OTPInput;