import express from "express";
import { addToCart, getCart, removeFromCart, updateCartItem } from "../controllers/cartController";
import { authenticateJWT } from "../middleware/auth";

const router = express.Router();

// All cart routes require login
router.post("/", authenticateJWT, addToCart);
router.get("/", authenticateJWT, getCart);
router.delete("/:id", authenticateJWT, removeFromCart);
router.put("/:id", authenticateJWT, updateCartItem);

export default router;
