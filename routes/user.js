import { ActivateStatus, DeActivateStatus, getActivatedUsers, getDeactivatedUsers, getUser, getUsers, getUsersCount, getWishlist, UpdateNameAndImg, UpdatePassword, UpdateWish} from "../controllers/user.js";
import express from "express";


const router = express.Router();

router.get("/find/:id", getUser);
//GET ALL

router.get("/", getUsers);
router.get("/Activated", getActivatedUsers);
router.get("/DeActivated", getDeactivatedUsers);

router.put("/Activate/:id",ActivateStatus);
router.put("/DeActivate/:id",DeActivateStatus);


router.get("/count", getUsersCount);
router.get("/wishlist", getWishlist);


router.put("/updateNameAndImg/:id",UpdateNameAndImg);
router.put("/updatePassword/:id",UpdatePassword);
router.put("/updateWish/:id/:rid",UpdateWish);


export default router;