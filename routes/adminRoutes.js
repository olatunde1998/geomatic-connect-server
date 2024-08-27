import express from "express";
import { getUserList } from "../controllers/userController.js";
import { isAdminRoute, protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/getUsers", protectedRoute, isAdminRoute, getUserList);

export default router;
