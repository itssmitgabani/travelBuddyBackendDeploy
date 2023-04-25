import { bookAirline, getAirlineBooking, getAirlineBookingCount, getAirlineBookingCountForSingle, getAirlineBookingForUser, getAirlineBookings, getChartData, getFlightBookingsForSingleUser, getRevenue, getRevenueForSingle, getTotal, VerifyBooking } from "../controllers/airlinebooking.js";
import express from "express";


const router = express.Router();

router.post("/book",bookAirline)

router.get("/find/:id", getAirlineBooking);
router.get("/find/booking/:id", getAirlineBookingForUser);
//GET ALL

router.get("/", getAirlineBookings);
router.get("/:uid", getFlightBookingsForSingleUser);


router.get("/count/all", getAirlineBookingCount);
router.get("/count/:id", getAirlineBookingCountForSingle);


router.get("/total/admin", getTotal);

router.get("/totalRevenue", getRevenue);
router.get("/totalRevenue/:id", getRevenueForSingle);

router.get("/chart/:id", getChartData);

router.put("/verify/:id",VerifyBooking);




export default router;