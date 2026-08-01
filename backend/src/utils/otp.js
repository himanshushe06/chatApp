import crypto from "crypto";

export const generateOTP = () => {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
};

export const hashOTP = (otp) => {
    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
};

export const getOTPExpiry = () => {
    const minutes =
        Number(process.env.OTP_EXPIRE_MINUTES) || 5;

    return new Date(
        Date.now() + minutes * 60 * 1000
    );
};

export const verifyOTP = (enteredOTP,hashedOTP) => {
    return (
        hashOTP(enteredOTP) === hashedOTP
    );
};