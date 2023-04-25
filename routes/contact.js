
import express from "express";
import { createContact, getContact } from "../controllers/contact.js";


const router = express.Router();

router.post("/create",createContact)
router.get("/",getContact)

export default router;