// controllers/cartController.ts
import { Response } from "express";
import db from "../config/db"; // MySQL pool
import { AuthRequest } from "../middleware/auth";
import { RowDataPacket, OkPacket } from "mysql2/promise";

// Add dish to cart
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { dishId, quantity } = req.body;

    if (!dishId || !quantity || !userId) {
      return res
        .status(400)
        .json({ message: "Dish ID, quantity, and user required" });
    }

    // Fetch current price of the dish
    const [dishRows] = await db.query<RowDataPacket[]>(
      "SELECT price FROM dishes WHERE id = ?",
      [dishId]
    );

    if (!dishRows || dishRows.length === 0) {
      return res.status(404).json({ message: "Dish not found" });
    }

    const priceEach = dishRows[0].price;

    // Insert into cart including price_each
    await db.query<OkPacket>(
      `INSERT INTO carts (user_id, dish_id, quantity, price_each) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [userId, dishId, quantity, priceEach]
    );

    res.status(201).json({ message: "Item added to cart" });
  } catch (err) {
    console.error("Error adding to cart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all items in cart
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const [rows] = await db.query<
      RowDataPacket[]
    >(
      `SELECT 
         c.id AS cart_id, 
         c.dish_id, 
         d.title, 
         c.price_each, 
         c.quantity, 
         d.short_description,
         d.image_url
       FROM carts c
       JOIN dishes d ON c.dish_id = d.id
       WHERE c.user_id = ?`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove item from cart
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const cartId = req.params.id;

    await db.query<OkPacket>(
      "DELETE FROM carts WHERE id = ? AND user_id = ?",
      [cartId, userId]
    );

    res.json({ message: "Item removed from cart" });
  } catch (err) {
    console.error("Error removing cart item:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update cart item
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const cartId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res
        .status(400)
        .json({ message: "Quantity must be at least 1" });
    }

    await db.query<OkPacket>(
      "UPDATE carts SET quantity = ? WHERE id = ? AND user_id = ?",
      [quantity, cartId, userId]
    );

    res.json({ message: "Cart updated successfully" });
  } catch (err) {
    console.error("Error updating cart item:", err);
    res.status(500).json({ message: "Server error" });
  }
};
