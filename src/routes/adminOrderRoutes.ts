import express from "express";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

// ADMIN ROUTES
router.get("/orders", authenticateJWT, getAllOrders);
router.put("/orders/:id/status", authenticateJWT, updateOrderStatus);
router.delete("/orders/:id", authenticateJWT, deleteOrder);

export default router;
