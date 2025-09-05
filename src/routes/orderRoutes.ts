import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

// uSER ROUTES
router.post("/", authenticateJWT, createOrder);
router.get("/user", authenticateJWT, getUserOrders);

export default router;
