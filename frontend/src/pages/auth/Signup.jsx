import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, MessageCircle } from "lucide-react";
import { signup } from "../../services/authService";
import { sendOTP, verifyOTP } from "../../services/otpService";
import OTPModal from "../../components/auth/OTPModal";
import OTPInput from "../../components/auth/OTPInput";
import VerificationSuccess from "../../components/auth/VerificationSuccess";
import toast from "react-hot-toast";
import { useEffect } from "react";
const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [otpOpen, setOtpOpen] = useState(false);
    const [otp, setOtp] = useState(Array(6).fill(""));
    const [otpLoading, setOtpLoading] = useState(false);
    const [verified, setVerified] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const handleChange = (e) => {
        setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await sendOTP(formData.email);
            toast.success("OTP sent successfully");
            setOtpOpen(true);
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to send OTP"
            );
        } finally {
            setLoading(false);
        }
    };
    const handleVerifyOTP = async (code) => {
        try {
            setOtpLoading(true);
            await verifyOTP(
                formData.email,
                code || otp.join("")
            );
            setVerified(true);
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Invalid OTP"
            );
        } finally {
            setOtpLoading(false);
        }
    };
    const handleResendOTP = async () => {
        try {
            await sendOTP(formData.email);
            toast.success("OTP sent again");
            setCountdown(30);
            setCanResend(false);
            setOtp(Array(6).fill(""));
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to resend OTP"
            );
        }
    };
    const handleContinue = async () => {
        try {
            await signup(formData);
            toast.success(
                "Account created successfully"
            );
            navigate("/chat");
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Signup failed"
            );
        }
    };
    useEffect(() => {
        if (!otpOpen) return;
        if (countdown === 0) {
            setCanResend(true);
            return;
        }
        const timer = setTimeout(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
    }, [countdown, otpOpen]);
    return (
        <div className="w-full max-w-md bg-zinc-900 rounded-3xl shadow-xl p-8">
            <div className="flex flex-col items-center mb-8">
                <div className="h-16 w-16 rounded-full bg-indigo-600 flex items-center justify-center">
                <MessageCircle
                    className="text-white"
                    size={30}
                />
                </div>
                <h1 className="text-3xl font-bold text-white mt-4">
                    Create Account
                </h1>
                <p className="text-zinc-400 mt-2">
                    Join ChatApp today
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative">
                    <User
                        size={20}
                        className="absolute left-4 top-4 text-zinc-400"
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full bg-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none"
                    />
                </div>

                <div className="relative">
                    <Mail size={20} className="absolute left-4 top-4 text-zinc-400"/>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none"
                    />
                </div>

                <div className="relative">
                    <Lock size={20} className="absolute left-4 top-4 text-zinc-400"/>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white outline-none"
                    />
                </div>

                <button disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition py-3 rounded-xl text-white font-semibold"
                >
                    {loading ? "Creating..." : "Create Account"}
                </button>

            </form>

            <p className="text-center text-zinc-400 mt-6">
                Already have an account?
                <Link
                    to="/login"
                    className="text-indigo-500 ml-2"
                    >
                    Login
                </Link>
            </p>

            <OTPModal
                open={otpOpen}
                email={formData.email}
            >
                {!verified ? (
                    <>
                        <OTPInput
                            otp={otp}
                            setOtp={setOtp}
                            onComplete={handleVerifyOTP}
                        />
                        <button
                            onClick={handleVerifyOTP}
                            disabled={otpLoading}
                            className="mt-8 w-full rounded-xl bg-indigo-600 py-3 text-white font-semibold hover:bg-indigo-700"
                        >
                            {otpLoading
                                ? "Verifying..."
                                : "Verify OTP"}
                        </button>
                        <div className="mt-6 text-center">
                            {canResend ? (
                                <button
                                    onClick={handleResendOTP}
                                    className="font-semibold text-indigo-500 hover:text-indigo-600"
                                >
                                    Resend OTP
                                </button>
                            ) : (
                                <p className="text-sm text-[var(--text-secondary)]">
                                    Resend OTP in {countdown}s
                                </p>
                            )}
                        </div>
                    </>
                ) : (
                    <VerificationSuccess
                        onContinue={handleContinue}
                    />
                )}
            </OTPModal>
        </div>


    );
};

export default Signup;