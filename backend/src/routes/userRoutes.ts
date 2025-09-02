import express from "express";
import { getAllUsers, deleteUser, changeUserRole, getUserProfile, updateUserProfile } from "../controllers/userController";
import { isAdmin } from "../middleware/isAdmin";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

router.get("/users", isAdmin, getAllUsers);
router.delete("/users/:id", isAdmin, deleteUser);
router.put("/users/:id/role", isAdmin, changeUserRole);

// Add JWT middleware here
router.get("/user/profile", authenticateJWT, getUserProfile);
router.put("/user/profile", authenticateJWT, updateUserProfile);

export default router;
