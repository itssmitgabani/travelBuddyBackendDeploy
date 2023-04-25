import express from "express";
import { getAdmin, getAdminsCount, UpdateNameAndImg, UpdatePassword } from "../controllers/admin.js";


const router = express.Router();

router.put("/updateNameAndImg/:id",UpdateNameAndImg);
router.put("/updatePassword/:id",UpdatePassword);

router.get("/:id",getAdmin);


router.get("/count/admin", getAdminsCount);


export default router;