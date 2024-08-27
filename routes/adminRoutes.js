import express from "express";
import { isAdminRoute, protectedRoute } from "../middlewares/authMiddleware.js";
import {
  activateUserProfile,
  deleteUserProfile,
  getUser,
  getUserList,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/getUsers", protectedRoute, isAdminRoute, getUserList);
router.get("/:id", protectedRoute, isAdminRoute, getUser);

router
  .route("/:id")
  .put(protectedRoute, isAdminRoute, activateUserProfile)
  .delete(protectedRoute, isAdminRoute, deleteUserProfile);

export default router;
