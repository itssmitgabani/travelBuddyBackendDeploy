import { ActivateStatus, DeActivateStatus, getActivatedHotels, getBookingDetail, getBookingsForHotel, getDeactivatedHotels, getHotel, getHotels, getHotelsCount, Update, UpdateImg, UpdatePassword } from "../controllers/hotel.js";
import express from "express";


const router = express.Router();

router.get("/find/:id", getHotel);
//GET ALL

router.get("/", getHotels);
router.get("/Activated", getActivatedHotels);
router.get("/DeActivated", getDeactivatedHotels);
router.get("/getBookings/:id", getBookingsForHotel);
router.get("/getBookingDetails/:id", getBookingDetail);

router.put("/Activate/:id",ActivateStatus);
router.put("/DeActivate/:id",DeActivateStatus);

router.put("/update/:id",Update);
router.put("/updateImg/:id",UpdateImg);
router.put("/updatePassword/:id",UpdatePassword);


router.get("/count", getHotelsCount);

export default router;