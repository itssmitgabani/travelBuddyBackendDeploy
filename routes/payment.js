import express from "express";
import {  addPaymentAirline, addPaymentHotel, approvePaymentAirline, approvePaymentHotel, getAllRequestedPaymentDetailsAirline, getAllRequestedPaymentDetailsHotel, getPaymentDetailsAirline, getPaymentDetailsHotel, requestPaymentAirline, requestPaymentHotel } from "../controllers/payment.js";


const router = express.Router();

router.get("/airline/:id",getPaymentDetailsAirline)
router.get("/hotel/:id",getPaymentDetailsHotel)

router.put("/airline/request/:id",requestPaymentAirline)
router.put("/hotel/request/:id",requestPaymentHotel)

router.get("/airline/all/payment",getAllRequestedPaymentDetailsAirline)
router.get("/hotel/all/payment",getAllRequestedPaymentDetailsHotel)

router.put("/airline/approve/:id",approvePaymentAirline)
router.put("/hotel/approve/:id",approvePaymentHotel)

router.put("/airline/add/:id",addPaymentAirline)
router.put("/hotel/add/:id",addPaymentHotel)


export default router;