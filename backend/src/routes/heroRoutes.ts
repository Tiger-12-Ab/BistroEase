// src/routes/heroRoutes.ts
import express from "express";
import { uploadHeroBanner, getActiveHeroBanners, updateHeroBanner } from "../controllers/heroController";
import { createUploader } from "../middleware/upload";

const router = express.Router();
const heroUpload = createUploader("heroes"); // store in uploads/heroes/

router.post("/upload", heroUpload.single("image"), uploadHeroBanner);
router.put("/update", heroUpload.single("image"), updateHeroBanner);
router.get("/", getActiveHeroBanners);

export default router;
