import express from "express";
import { addBankDetailsAirline, addBankDetailsHotel, getBankDetailsAirline, getBankDetailsHotel } from "../controllers/bank.js";

const router = express.Router();

router.get("/airline/:id",getBankDetailsAirline)
router.get("/hotel/:id",getBankDetailsHotel)

router.post("/airline/add/",addBankDetailsAirline)
router.post("/hotel/add/",addBankDetailsHotel)



export default router;