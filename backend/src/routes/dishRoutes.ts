import express from "express";
import multer from "multer";
import { getDishes, addDish, updateDish, deleteDish, getDishById } from "../controllers/dishController";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: "uploads/dishes/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.get("/", getDishes);           // GET /api/dishes
router.get("/:id", getDishById);      // GET /api/dishes/:id
router.post("/", upload.single("image"), addDish);   // POST /api/dishes
router.put("/:id", upload.single("image"), updateDish); // PUT /api/dishes/:id
router.delete("/:id", deleteDish);    // DELETE /api/dishes/:id

export default router;
