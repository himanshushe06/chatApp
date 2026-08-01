import { Navigate, Route, Routes } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import ChatLayout from "../layouts/ChatLayout";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import Chat from "../pages/chat/Chat";
import NewChat from "../pages/chat/NewChat";
import FriendRequests from "../pages/chat/FriendRequests";
import Profile from "../pages/chat/Profile";
import ProtectedRoute from "./ProtectedRoute";
import CreateGroup from "../components/chat/CreateGroup";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route
                path="/login"
                element={
                    <AuthLayout>
                        <Login />
                    </AuthLayout>
                }
            />

            <Route
                path="/signup"
                element={
                    <AuthLayout>
                        <Signup />
                    </AuthLayout>
                }
            />

            <Route
                path="/chat"
                element={
                    <ProtectedRoute>
                        <ChatLayout>
                            <Chat />
                        </ChatLayout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/new-chat"
                element={
                    <ChatLayout>
                        <NewChat />
                    </ChatLayout>
                }
            />

            <Route
                path="/requests"
                element={
                    <ChatLayout>
                        <FriendRequests />
                    </ChatLayout>
                }
            />

            <Route
                path="/profile"
                element={
                    <ChatLayout>
                        <Profile />
                    </ChatLayout>
                }
            />
            <Route
                path="/create-group"
                element={<CreateGroup />}
            />

            <Route
                path="*"
                element={<NotFound />}
            />
        </Routes>
    );
};

export default AppRoutes;