import express from "express";
import { addReview, getAvg, getReviews } from "../controllers/review.js";

const router = express.Router();

router.post("/add",addReview)
router.get("/avg/:id",getAvg)
router.get("/review/:id",getReviews)

export default router;