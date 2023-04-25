import Airline from "../models/airline.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import airlinebooking from "../models/airlinebooking.js"
import mongoose from "mongoose";


export const ActivateStatus = async (req,res,next)=>{
  try {
    const updatedAirline = await Airline.findByIdAndUpdate(
      req.params.id,{$set :{status:true}},{ new: true }
    );
    res.status(200).json(updatedAirline);
  } catch (err) {
    next(err);
  }
}
export const DeActivateStatus = async (req,res,next)=>{
  try {
    const updatedAirline = await Airline.findByIdAndUpdate(
      req.params.id,{$set :{status:false}},{ new: true }
    );
    res.status(200).json(updatedAirline);
  } catch (err) {
    next(err);
  }
}


export const getAirline = async (req, res, next) => {
    try {
      const airline = await Airline.findById(req.params.id);
      res.status(200).json(airline);
    } catch (err) {
      next(err);
    }
  };
  export const getAirlines = async (req, res, next) => {
    try {
      const airlies = await Airline.find();
      res.status(200).json(airlies);
    } catch (err) {
      next(err);
    }
  };
  export const getActivatedAirlines = async (req, res, next) => {
    try {
      const airlines = await Airline.find({
        status:true
      });
      res.status(200).json(airlines);
    } catch (err) {
      next(err);
    }
  };
  export const getDeactivatedAirlines = async (req, res, next) => {
    try {
      const airlines = await Airline.find({
        status:false
      });
      res.status(200).json(airlines);
    } catch (err) {
      next(err);
    }
  };

  export const getBookingsForAirline = async (req, res, next) => {
    try {
      const airlinebookings = await airlinebooking.aggregate([
        {
          $lookup:
            {
              from: "users",
              localField: "u_id",
              foreignField: "_id",
              as: "user",
            },
        },
        {
          $unwind:
            {
              path: "$user",
            },
        },
        {
          $lookup:
            {
              from: "airlines",
              localField: "a_id",
              foreignField: "_id",
              as: "airline",
            },
        },
        {
          $unwind:
            {
              path: "$airline",
            },
        },
        {
          $match:
            {
             a_id: new mongoose.Types.ObjectId(req.params.id),
            },
        },
        {
        
            $project:
              {
                _id: 1,
                username: "$user.username",
                img: "$user.img",
                seats: 1,
                totalAmt: 1,
                discountAmt: 1,
                createdAt: 1,
            
          },
        },
      ]);
      res.status(200).json(airlinebookings);
    } catch (err) {
      next(err);
    }
  };
  export const getBookingDetail = async (req, res, next) => {
    try {
      const airlinebookings = await airlinebooking.aggregate([
        {
          $match:
            {
             _id: new mongoose.Types.ObjectId(req.params.id),
            },
        },
        {
          $lookup:
            {
              from: "users",
              localField: "u_id",
              foreignField: "_id",
              as: "user",
            },
        },
        {
          $unwind:
            {
              path: "$user",
            },
        },
        {
          $lookup:
            {
              from: "airlines",
              localField: "a_id",
              foreignField: "_id",
              as: "airline",
            },
        },
        {
          $unwind:
            {
              path: "$airline",
            },
        },
        {
        
            $project:
              {
                _id: 1,
                username: "$user.username",
                email: "$user.email",
                mobileno: "$user.mobileno",
                seats: 1,
                totalAmt: 1,
                discountAmt: 1,
                createdAt: 1,
                verified:1,
            
          },
        },
      ]);
      res.status(200).json(airlinebookings[0]);
    } catch (err) {
      next(err);
    }
  };
  
  export const getAirlinesCount = async (req, res, next) => {
    try {
      const airlines = await Airline.countDocuments();
      res.status(200).json(airlines);
    } catch (err) {
      next(err);
    }
  };
  
  export const Update = async (req,res,next)=>{
    try {
      const updatedAirline = await Airline.findByIdAndUpdate(
        req.params.id,{$set:req.body},{ new: true }
      );
      res.status(200).json(updatedAirline);
    } catch (err) {
      next(err);
    }
  }
  
  export const UpdateImg = async (req,res,next)=>{
    try {
      const updatedAirline = await Airline.findByIdAndUpdate(
        req.params.id,{$set:{img:req.body.img}},{ new: true }
      );
      res.status(200).json(updatedAirline);
    } catch (err) {
      next(err);
    }
  }
  
  export const UpdatePassword = async (req, res, next) => {
    const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
    try {
      const airline = await Airline.findOne({ _id: req.params.id });
  
      const isPasswordCorrect = await bcrypt.compare(
        req.body.oldpassword,
        airline.password
      );
      
      if (!isPasswordCorrect)
        return next(createError(400, `incorrect password!`));
      else{
        if(req.body.newpassword!==req.body.Cpassword){   
          return next(createError(401, "password not matched!"));
        }
        if(req.body.newpassword.length <= 0){   
          return next(createError(401, "password can not empty!"));
        }
        if(req.body.newpassword.length < 8){
          return next(createError(401, "Password length must greater than 8 char!"));
        }
        if(!regex.test(req.body.newpassword)){
          return next(createError(401, "Password must contain one letter and one number!"));
        }
          
          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(req.body.newpassword, salt);
          const updatedAirline = await Airline.findByIdAndUpdate(
            req.params.id,{$set:{password:hash}},{ new: true }
          );
          res.status(200).json(updatedAirline);
        
      }
  
    } catch (err) {
      next(err);
    }
  };