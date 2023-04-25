import express from "express";
import { addRoom, findRoom, findRoomByCity, findSingleRoom, findWishlistRoom, getRoomNum, getRoomNum1, getTotalRoom, updateRoom, updateRoomAvailability } from "../controllers/room.js";


const router = express.Router();


router.post("/add",addRoom)
router.get("/find/:id",findRoom)
router.get("/f/:id",findSingleRoom)
router.get("/",findRoomByCity)
router.get("/wishlistRoom/:rid",findWishlistRoom)
router.get("/totalRoom/:id",getTotalRoom)
router.get("/roomNum/:id",getRoomNum)
router.get("/roomNum/f/f",getRoomNum1)


router.put("/update/:id",updateRoom)
router.put("/availability/:id", updateRoomAvailability);

export default router;