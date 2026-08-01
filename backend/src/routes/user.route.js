import express from "express";
import userController from "../controller/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/",authMiddleware,userController.getAllUsers);
router.get("/available",authMiddleware,userController.getAvailableUsers);
router.get("/:id",authMiddleware,userController.getUserById);
router.patch("/block",authMiddleware,userController.blockUser);
router.patch("/unblock",authMiddleware,userController.unblockUser);

export default router;