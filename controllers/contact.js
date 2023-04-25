import Contact from "../models/contact.js"
import { createError } from "../utils/error.js";


export const createContact = async (req,res,next)=>{
    const newContact = new Contact(req.body);
    try{
        await newContact.save();
        res.status(200).json("coupon created successfully");
    }catch(err){
        next(createError(500, "All fields required"))
    }
}


  export const getContact = async (req, res, next) => {
    try {
      const contact = await Contact.find();
      res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  };
