import express from "express"
import authRegister from "../controller/auth.controller.js"
import userVerification from "../middleware/userVerification.js"
import authMiddleware from "../middleware/auth.middleware.js"
import upload from "../middleware/upload.middleware.js";

const authRoutes=express.Router()

authRoutes.post("/signup", userVerification({ mustNotExist: true }), authRegister.signup)
authRoutes.post("/login", userVerification({ mustExist: true }), authRegister.login)
authRoutes.post("/logout",authRegister.logout)
authRoutes.get("/me",authMiddleware,authRegister.getCurrentUser);
authRoutes.put("/profile", upload.single("avatar"), authMiddleware, authRegister.updateProfile);
export default authRoutes;