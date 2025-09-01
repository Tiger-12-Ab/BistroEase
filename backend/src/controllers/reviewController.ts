import { Request, Response } from "express";
import db from "../config/db";

// GET all reviews
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const [rows]: any = await db.execute(
      `SELECT r.id, u.first_name AS user, d.title AS dish, r.rating, r.review_text, r.featured, r.created_at
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       JOIN dishes d ON r.dish_id = d.id
       ORDER BY r.created_at DESC`
    );

    // Ensure rows is always an array
    if (!Array.isArray(rows)) {
      return res.json([]);
    }

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reviews", error });
  }
};

// DELETE review
export const deleteReview = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await db.execute(`DELETE FROM reviews WHERE id = ?`, [id]);
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete review", error });
    }
};

// FEATURE/UNFEATURE review
export const featureReview = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [rows]: any = await db.execute(`SELECT featured FROM reviews WHERE id = ?`, [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Review not found" });

        const newFeatured = !rows[0].featured;
        await db.execute(`UPDATE reviews SET featured = ? WHERE id = ?`, [newFeatured, id]);
        res.json({ message: `Review ${newFeatured ? "featured" : "unfeatured"} successfully`, featured: newFeatured });
    } catch (error) {
        res.status(500).json({ message: "Failed to update review", error });
    }
};
