import express from "express";
import otpController from "../controller/otp.controller.js";

const router = express.Router();

router.post("/send-otp", otpController.sendOTP);

router.post("/verify-otp", otpController.verifyOTP);

export default router;