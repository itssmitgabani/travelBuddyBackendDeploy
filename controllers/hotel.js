import Hotel from "../models/hotel.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import hotelbooking from "../models/hotelbooking.js";
import mongoose from "mongoose";


export const ActivateStatus = async (req,res,next)=>{
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,{$set :{status:true}},{ new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
}
export const DeActivateStatus = async (req,res,next)=>{
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,{$set :{status:false}},{ new: true }
    );
    res.status(200).json(updatedHotel);
  } catch (err) {
    next(err);
  }
}


export const getHotel = async (req, res, next) => {
    try {
      const hotel = await Hotel.findById(req.params.id);
      res.status(200).json(hotel);
    } catch (err) {
      next(err);
    }
  };
  export const getHotels = async (req, res, next) => {
    const { min, max, ...others } = req.query;
    try {
      const hotels = await Hotel.find();
      res.status(200).json(hotels);
    } catch (err) {
      next(err);
    }
  };
  export const getActivatedHotels = async (req, res, next) => {
    const { min, max, ...others } = req.query;
    try {
      const hotels = await Hotel.find({
        status:true
      });
      res.status(200).json(hotels);
    } catch (err) {
      next(err);
    }
  };
  export const getDeactivatedHotels = async (req, res, next) => {
    const { min, max, ...others } = req.query;
    try {
      const hotels = await Hotel.find({
        status:false
      });
      res.status(200).json(hotels);
    } catch (err) {
      next(err);
    }
  };

  export const getBookingsForHotel = async (req, res, next) => {
    try {
      const hotelBookings = await hotelbooking.aggregate([
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
              from: "hotels",
              localField: "h_id",
              foreignField: "_id",
              as: "hotel",
            },
        },
        {
          $unwind:
            {
              path: "$hotel",
            },
        },
        {
          $match:
            {
             h_id: new mongoose.Types.ObjectId(req.params.id),
            },
        },
        {
        
            $project:
              {
                _id: 1,
                username: "$user.username",
                img: "$user.img",
                rooms: 1,
                children: 1,
                adult: 1,
                totalAmt: 1,
                discountAmt: 1,
                bookingdate: 1,
            
          },
        },
      ]);
      res.status(200).json(hotelBookings);
    } catch (err) {
      next(err);
    }
  };
  export const getBookingDetail = async (req, res, next) => {
    try {
      const hotelBookings = await hotelbooking.aggregate([
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
              from: "hotels",
              localField: "h_id",
              foreignField: "_id",
              as: "hotel",
            },
        },
        {
          $unwind:
            {
              path: "$hotel",
            },
        },
        {
        
            $project:
              {
                _id: 1,
                username: "$user.username",
                email: "$user.email",
                mobileno: "$user.mobileno",
                rooms: 1,
                children: 1,
                adult: 1,
                totalAmt: 1,
                discountAmt: 1,
                bookingdate: 1,
                verified:1,
            
          },
        },
      ]);
      res.status(200).json(hotelBookings[0]);
    } catch (err) {
      next(err);
    }
  };
  
  export const getHotelsCount = async (req, res, next) => {
    try {
      const hotels = await Hotel.countDocuments();
      res.status(200).json(hotels);
    } catch (err) {
      next(err);
    }
  };

  export const Update = async (req,res,next)=>{
    try {
      const updatedHotel = await Hotel.findByIdAndUpdate(
        req.params.id,{$set:req.body},{ new: true }
      );
      res.status(200).json(updatedHotel);
    } catch (err) {
      next(err);
    }
  }
  
  export const UpdateImg = async (req,res,next)=>{
    try {
      const updatedHotel = await Hotel.findByIdAndUpdate(
        req.params.id,{$set:{img:req.body.img}},{ new: true }
      );
      res.status(200).json(updatedHotel);
    } catch (err) {
      next(err);
    }
  }

  
export const UpdatePassword = async (req, res, next) => {
  const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
  try {
    const hotel = await Hotel.findOne({ _id: req.params.id });

    const isPasswordCorrect = await bcrypt.compare(
      req.body.oldpassword,
      hotel.password
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
        const updatedHotel = await Hotel.findByIdAndUpdate(
          req.params.id,{$set:{password:hash}},{ new: true }
        );
        res.status(200).json(updatedHotel);
      
    }

  } catch (err) {
    next(err);
  }
};
  