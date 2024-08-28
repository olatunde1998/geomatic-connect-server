import express from "express";
import {
  forgetPassword,
  getMyProfile,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateMyProfile,
  verifyUser,
} from "../controllers/authController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify", verifyUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/forget-password", forgetPassword);

router.get("/profile/:id", protectedRoute, getMyProfile);
router.put("/update-profile", protectedRoute, updateMyProfile);

router.put("/reset-password", protectedRoute, resetPassword);

export default router;
