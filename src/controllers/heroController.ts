import { Request, Response } from "express";
import db from "../config/db";


// Fetch active banners
export const getActiveHeroBanners = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM hero_banners WHERE is_active = 1 ORDER BY created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch banners" });
  }
};

// Upload new banner
export const uploadHeroBanner = async (req: Request, res: Response) => {
  try {
    const { title_en, title_bn, tagline_en, tagline_bn } = req.body;
    const imageUrl = req.file ? `/uploads/heroes/${req.file.filename}` : null;

    await db.query(
      `INSERT INTO hero_banners 
      (image_url, title_en, title_bn, tagline_en, tagline_bn, is_active, created_at)
      VALUES (?, ?, ?, ?, ?, 1, NOW())`,
      [imageUrl, title_en, title_bn, tagline_en, tagline_bn]
    );

    res.json({ success: true, message: "Banner uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload banner" });
  }
};

// Update existing banner
export const updateHeroBanner = async (req: Request, res: Response) => {
  try {
    const { id, title_en, title_bn, tagline_en, tagline_bn } = req.body;
    const imageUrl = req.file ? `/uploads/heroes/${req.file.filename}` : undefined;

    const queryParts: string[] = [];
    const values: any[] = [];

    if (imageUrl) {
      queryParts.push("image_url = ?");
      values.push(imageUrl);
    }
    if (title_en) {
      queryParts.push("title_en = ?");
      values.push(title_en);
    }
    if (title_bn) {
      queryParts.push("title_bn = ?");
      values.push(title_bn);
    }
    if (tagline_en) {
      queryParts.push("tagline_en = ?");
      values.push(tagline_en);
    }
    if (tagline_bn) {
      queryParts.push("tagline_bn = ?");
      values.push(tagline_bn);
    }

    if (queryParts.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(id);

    const sql = `UPDATE hero_banners SET ${queryParts.join(", ")} WHERE id = ?`;
    await db.query(sql, values);

    res.json({ success: true, message: "Banner updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update banner" });
  }
};
