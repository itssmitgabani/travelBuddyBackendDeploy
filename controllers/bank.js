import bank from "../models/bank.js";
import { createError } from "../utils/error.js";


export const getBankDetailsAirline = async (req,res,next)=>{
    try {
      const Bank = await bank.find(
        {a_id:req.params.id}
      );
      res.status(200).json(Bank);
    } catch (err) {
      next(err);
    }
  }

export const getBankDetailsHotel = async (req,res,next)=>{
    try {
      const Bank = await bank.find(
        {h_id:req.params.id}
      );
      res.status(200).json(Bank);
    } catch (err) {
      next(err);
    }
  }
export const addBankDetailsAirline = async (req,res,next)=>{
    const newBank = new bank(req.body);
    try{
        await newBank.save();
        res.status(200).json("bank added successfully");
    }catch(err){
        next(createError(500, "All fields required"))
    }
  }

export const addBankDetailsHotel = async (req,res,next)=>{
    const newBank = new bank(req.body);
    try{
        await newBank.save();
        res.status(200).json("bank added successfully");
    }catch(err){
        next(createError(500, "All fields required"))
    }
  }

