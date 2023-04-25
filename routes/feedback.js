import { createFeedback, getFeedback, getFeedbacks, getFeedbacksAdmin, getFeedbacksAirline, getFeedbacksHotel } from "../controllers/feedback.js";
import express from "express";


const router = express.Router();

router.post("/create",createFeedback)
router.get("/find/:id",getFeedback)
router.get("/admin",getFeedbacksAdmin)
router.get("/hotel",getFeedbacksHotel)
router.get("/airline",getFeedbacksAirline)
router.get("/",getFeedbacks)

export default router;