import express from "express";
import { hotellogin, hotelregister , adminlogin , adminregister, airlinelogin, airlineregister, userLogin, userregister, hotelVerify, airlineVerify, userVerify, userPassword, userResetPassword, hotelPassword, hotelResetPassword, airlinePassword, airlineResetPassword, adminPassword, adminResetPassword } from "../controllers/auth.js";

const router = express.Router();

router.post("/admin/login", adminlogin)
router.post("/admin/register", adminregister)
router.post("/admin/forgotPassword", adminPassword)
router.post("/admin/resetPassword", adminResetPassword)

router.post("/hotel/login", hotellogin)
router.post("/hotel/register", hotelregister)
router.get("/hotel/verify/:id/:token", hotelVerify)
router.post("/hotel/forgotPassword", hotelPassword)
router.post("/hotel/resetPassword", hotelResetPassword)

router.post("/airline/login", airlinelogin)
router.post("/airline/register", airlineregister)
router.get("/airline/verify/:id/:token", airlineVerify)
router.post("/airline/forgotPassword", airlinePassword)
router.post("/airline/resetPassword", airlineResetPassword)

router.post("/user/login", userLogin)
router.get("/user/verify/:id/:token", userVerify)
router.post("/user/register", userregister)
router.post("/user/forgotPassword", userPassword)
router.post("/user/resetPassword", userResetPassword)

export default router