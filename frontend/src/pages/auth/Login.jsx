import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, MessageCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";

import AuthCard from "../../components/auth/AuthCard";
import AuthInput from "../../components/auth/AuthInput";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";
import SocialButton from "../../components/auth/SocialButton";

import { login } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [rememberMe, setRememberMe] = useState(false);
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
            const data = await login(formData);
            setUser(data.user);
            navigate("/chat");
        } catch (err) {
            alert(err.response?.data?.message || "Login Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthCard>
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .5 }}
        >
            <div className="flex justify-center">
                <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
                    <MessageCircle
                    size={32}
                    className="text-white"
                    />
                </div>
            </div>

            <h1 className="text-center text-3xl font-bold text-white mt-6">
                Welcome Back
            </h1>

            <p className="text-center text-zinc-400 mt-2">
                Login to continue chatting
            </p>

            <form
                onSubmit={handleSubmit}
                className="space-y-5 mt-8"
            >
            <AuthInput
                icon={Mail}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
            />
            <PasswordInput
                name="password"
                value={formData.password}
                onChange={handleChange}
            />
            <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 text-zinc-400">
                <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                />
                    Remember me
                </label>
                <button
                type="button"
                className="text-indigo-400 hover:text-indigo-300"
                >
                Forgot Password?
                </button>
            </div>
            <AuthButton loading={loading}>
                Login
            </AuthButton>
            </form>


            <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-zinc-700"></div>
            <span className="text-zinc-500 text-sm">
                OR
            </span>
            <div className="flex-1 h-px bg-zinc-700"></div>
            </div>
            <div className="space-y-3">
            <SocialButton
                icon={<FcGoogle size={22} />}
                title="Continue with Google"
            />
            </div>
            <p className="text-center text-zinc-400 mt-8">
                Don't have an account?
                <Link
                    to="/signup"
                    className="text-indigo-400 ml-2 hover:text-indigo-300"
                >
                    Sign Up
                </Link>
            </p>
        </motion.div>
        </AuthCard>
    );
};

export default Login;