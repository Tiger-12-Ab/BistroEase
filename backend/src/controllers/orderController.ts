import { Response, Request } from "express";
import db from "../config/db";
import { AuthRequest } from "../middleware/auth";
import { sendEmail } from "../utils/sendEmail";

/**
 * USER: Create order
 */
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { first_name, last_name, email, phone, address, items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    for (const item of items) {
      if (!item.dish_id) {
        return res
          .status(400)
          .json({ message: `Dish ID missing for item: ${item.title}` });
      }
    }

    const total = items.reduce(
      (sum: number, it: any) => sum + it.price_each * it.quantity,
      0
    );

    // Insert order
    const [orderResult]: any = await db.query(
      `INSERT INTO orders (user_id, first_name, last_name, email, phone, address, total) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, first_name, last_name, email, phone, address, total]
    );
    const orderId = orderResult.insertId;

    // Insert order items
    const orderItemsValues = items.map((it: any) => [
      orderId,
      it.dish_id,
      it.quantity,
      it.price_each,
    ]);
    await db.query(
      `INSERT INTO order_items (order_id, dish_id, quantity, price_each) VALUES ?`,
      [orderItemsValues]
    );

    // Clear cart
    await db.query("DELETE FROM carts WHERE user_id = ?", [userId]);

    // Send confirmation email
    try {
      await sendEmail(
        email,
        "Order Confirmation",
        `Thank you for your order!
Order ID: ${orderId}
Total: $${total.toFixed(2)}
Status: Pending`
      );
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
    }

    res.status(201).json({ message: "Order placed successfully", orderId });
  } catch (err: any) {
    console.error("Order creation failed:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * USER: Get logged-in user's orders
 */
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const [orders]: any = await db.query(
      `SELECT id, first_name, last_name, email, phone, address, total, status, created_at 
       FROM orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );

    if (orders.length === 0) return res.json([]);

    const orderIds = orders.map((o: any) => o.id);
    const [orderItems]: any = await db.query(
      `SELECT oi.order_id, d.title, oi.quantity, oi.price_each 
       FROM order_items oi 
       JOIN dishes d ON d.id = oi.dish_id 
       WHERE oi.order_id IN (?)`,
      [orderIds]
    );

    const ordersWithItems = orders.map((order: any) => ({
      ...order,
      items: orderItems.filter((item: any) => item.order_id === order.id),
    }));

    res.json(ordersWithItems);
  } catch (err: any) {
    console.error("Fetching user orders failed:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * ADMIN: Get all orders
 */
export const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const [orders]: any = await db.query(
      `SELECT id, first_name, last_name, email, phone, address, total, status, created_at 
       FROM orders 
       ORDER BY created_at DESC`
    );

    if (orders.length === 0) return res.json([]);

    const orderIds = orders.map((o: any) => o.id);
    const [orderItems]: any = await db.query(
      `SELECT oi.order_id, d.title, oi.quantity, oi.price_each 
       FROM order_items oi 
       JOIN dishes d ON d.id = oi.dish_id 
       WHERE oi.order_id IN (?)`,
      [orderIds]
    );

    const ordersWithItems = orders.map((order: any) => ({
      ...order,
      items: orderItems.filter((item: any) => item.order_id === order.id),
    }));

    res.json(ordersWithItems);
  } catch (err: any) {
    console.error("Fetching all orders failed:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * ADMIN: Update order status (with email notify)
 */
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "confirmed", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Update
    await db.query(`UPDATE orders SET status = ? WHERE id = ?`, [status, id]);

    // Get order + email
    const [orderRows]: any = await db.query(
      `SELECT email, first_name, last_name FROM orders WHERE id = ?`,
      [id]
    );
    const order = orderRows[0];

    // Email user
    try {
      await sendEmail(
        order.email,
        "Order Status Update",
        `Hello ${order.first_name} ${order.last_name},
Your order #${id} status has been updated to: ${status}.`
      );
    } catch (emailErr) {
      console.error("Status email sending failed:", emailErr);
    }

    res.json({ message: "Status updated successfully" });
  } catch (err: any) {
    console.error("Updating order status failed:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

/**
 * ADMIN: Delete order
 */
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await db.query(`DELETE FROM order_items WHERE order_id = ?`, [id]);
    await db.query(`DELETE FROM orders WHERE id = ?`, [id]);

    res.json({ message: "Order deleted successfully" });
  } catch (err: any) {
    console.error("Deleting order failed:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
