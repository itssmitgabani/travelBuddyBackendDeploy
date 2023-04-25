import {createCoupon, getActiveCoupons, getCoupon, getCoupons } from "../controllers/coupon.js";
import express from "express";


const router = express.Router();

router.post("/create",createCoupon)
router.get("/find/:id",getCoupon)
router.get("/",getCoupons)
router.get("/active",getActiveCoupons)

export default router;