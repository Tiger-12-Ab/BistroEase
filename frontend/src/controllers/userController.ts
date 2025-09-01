import { Request, Response } from "express";
import db from "../config/db"; // MySQL connection
import { AuthRequest } from "../middleware/isAdmin";

// Get all users
export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    const [rows] = await db.query("SELECT id, first_name, last_name, email, phone, address, role, is_verified, created_at FROM users");
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a user by id
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "User deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Change user role (admin/user)
export const changeUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    await db.query("UPDATE users SET role = ? WHERE id = ?", [role, id]);
    res.json({ message: `User role updated to ${role}` });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/userController.ts
export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id; // get from JWT
    const [rows]: any = await db.query(
      "SELECT id, first_name, last_name, email, phone, address FROM users WHERE id = ?",
      [userId]
    );
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
// Update user profile
export const updateUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { first_name, last_name, email, phone, address } = req.body;

    if (!first_name || !last_name || !email || !phone || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    await db.query(
      "UPDATE users SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ? WHERE id = ?",
      [first_name, last_name, email, phone, address, userId]
    );

    const [updatedRows]: any = await db.query(
      "SELECT id, first_name, last_name, email, phone, address FROM users WHERE id = ?",
      [userId]
    );

    res.json({ message: "Profile updated successfully", user: updatedRows[0] });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
