import { ActivateStatus, DeActivateStatus, getActivatedAirlines, getDeactivatedAirlines, getAirline, getAirlines, getAirlinesCount, Update, UpdateImg, UpdatePassword, getBookingsForAirline, getBookingDetail } from "../controllers/airline.js";
import express from "express";


const router = express.Router();

router.get("/find/:id", getAirline);
//GET ALL

router.get("/", getAirlines);
router.get("/Activated", getActivatedAirlines);
router.get("/DeActivated", getDeactivatedAirlines);
router.get("/getBookings/:id", getBookingsForAirline);
router.get("/getBookingDetails/:id", getBookingDetail);

router.put("/Activate/:id",ActivateStatus);
router.put("/DeActivate/:id",DeActivateStatus);


router.put("/update/:id",Update);
router.put("/updateImg/:id",UpdateImg);
router.put("/updatePassword/:id",UpdatePassword);

router.get("/count", getAirlinesCount);

export default router;