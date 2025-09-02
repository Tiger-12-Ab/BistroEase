import express from "express";
import { getAllReviews, deleteReview, featureReview } from "../controllers/reviewController";

const router = express.Router();

router.get("/", getAllReviews);
router.delete("/:id", deleteReview);
router.put("/:id/feature", featureReview);

export default router;
