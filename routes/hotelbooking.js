import { bookHotel, getChartData, getHotelBooking, getHotelBookingCount, getHotelBookingCountForSingle, getHotelBookingForUser, getHotelBookings, getHotelBookingsForSingleUser, getRevenue, getRevenueForSingle, getTotal, updateReviewed, VerifyBooking } from "../controllers/hotelbooking.js";
import express from "express";


const router = express.Router();

router.post("/book",bookHotel)

router.get("/find/:id", getHotelBooking);
router.get("/find/booking/:id", getHotelBookingForUser);
//GET ALL

router.get("/", getHotelBookings);
router.get("/f/:uid", getHotelBookingsForSingleUser);

router.get("/count/all", getHotelBookingCount);
router.get("/count/:id", getHotelBookingCountForSingle);


router.get("/total", getTotal);

router.get("/totalRevenue", getRevenue);
router.get("/totalRevenue/:id", getRevenueForSingle);

router.get("/chart/:id", getChartData);

router.put("/verify/:id",VerifyBooking);
router.put("/reviewed/:id",updateReviewed);

export default router;