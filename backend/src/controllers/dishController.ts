// backend/src/controllers/dishController.ts
import { Request, Response } from "express";
import db from "../config/db"; // this is correct now

export const getDishes = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM dishes ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dishes" });
  }
};

export const addDish = async (req: Request, res: Response) => {
  try {
    const { title, short_description, description, category, price } = req.body;
    const image_url = req.file ? `/uploads/dishes/${req.file.filename}` : null;

    const [result] = await db.query(
      "INSERT INTO dishes (title, short_description, description, category, image_url, price) VALUES (?, ?, ?, ?, ?, ?)",
      [title, short_description, description, category, image_url, price]
    );

    res.status(201).json({ id: (result as any).insertId, title, short_description, description, category, image_url, price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding dish" });
  }
};


export const updateDish = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, short_description, description, category, price } = req.body;
    const image_url = req.file ? `/uploads/dishes/${req.file.filename}` : null;

    let query = "UPDATE dishes SET title=?, short_description=?, description=?, category=?, price=?";
    const params: (string | number | null)[] = [title, short_description, description, category, price];

    if (image_url) {
      query += ", image_url=?";
      params.push(image_url);
    }

    query += " WHERE id=?";
    params.push(id);

    await db.query(query, params);
    res.json({ message: "Dish updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating dish" });
  }
};


export const deleteDish = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM dishes WHERE id = ?", [id]);
    res.json({ message: "Dish deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting dish" });
  }
};

export const getDishById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM dishes WHERE id = ?", [id]);
    const dish = (rows as any)[0];
    if (!dish) return res.status(404).json({ message: "Dish not found" });
    res.json(dish);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dish" });
  }
};
