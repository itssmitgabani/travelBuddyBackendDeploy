import mongoose from "mongoose";
import HotelBooking from "../models/hotelbooking.js";
import Stripe from 'stripe';
import {v4 as uuidv4} from 'uuid';
const stripe = new Stripe('sk_test_51MnfjYHtJIZ5x7GiPTY4R025StwA4P73MHem8JqJGBmBMgEm30GF2oNu1SXwQ8Fr1xYtSujrJW2wUq2Ifw3Blpeu00zMcf02qT');



export const bookHotel = async (req,res,next)=>{
    const hotelBook = new HotelBooking(req.body);
    try{

      /*const customer = await stripe.customers.create({
        email: req.body.token.email,
        source: req.body.token.id
      });*/

      const payment = await stripe.charges.create({
        amount : req.body.totalAmt * 100 ,
        source:req.body.token.id,
        currency:'INR'
      })

      /*const paymentMethod = await stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: '4242424242424242',
          exp_month: 8,
          exp_year: 2023,
          cvc: '314',
        },
      });
      const paymentIntent = await stripe.paymentIntents.create({
        amount:  req.body.totalAmt * 100 ,
        currency: 'inr',
        description: 'Software development services',
        customer : customer.id,
        payment_method_types: ['card'],
        payment_method : paymentMethod.id,
        confirm:true,
        
      });
      const paymentIntentC = await stripe.paymentIntents.confirm(
        paymentIntent.id,
        {payment_method: paymentMethod.id}
      );*/
     

      if(payment){
        const savedBookHotel = await hotelBook.save();
      }
        
        res.status(200).json("hotel booked successfully");
    }catch(err){
        next(err)
    }
}

export const getHotelBooking = async (req, res, next) => {
    try {
      const hotelbooking = await HotelBooking.findById(req.params.id);
      res.status(200).json(hotelbooking);
    } catch (err) {
      next(err);
    }
  };

export const getHotelBookingForUser = async (req, res, next) => {
    try {
      const hotelbooking = await HotelBooking.aggregate([
        {
          $match:
            {
              _id: new mongoose.Types.ObjectId(req.params.id),
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
          _id:1,
          hotelname:"$hotel.hotelname",
          address:"$hotel.address",
          locationlink:"$hotel.locationlink",
          rooms:1,
          adult:1,
          children:1,
          totalAmt:1,
          discountAmt:1,
          bookingdate:1,
          todate:1,
          verified:1,
          roomNumber:1,
          checkin:"$hotel.checkin",
          checkout:"$hotel.checkout",
          img:"$hotel.img",
          roomNumberNo:1,
          r_id:1,
          reviewed:1
        }
      }
      ]);
      res.status(200).json(hotelbooking);
    } catch (err) {
      next(err);
    }
  };
  export const getHotelBookings = async (req, res, next) => {
    try {
      const hotelbookings = await HotelBooking.aggregate([
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
                img: "$user.img",
                rooms: 1,
                children: 1,
                adult: 1,
                totalAmt: 1,
                discountAmt: 1,
                bookingdate: 1,
                hotelname: "$hotel.hotelname"
            
          },
        },
      ]);
      res.status(200).json(hotelbookings);
    } catch (err) {
      next(err);
    }
  };
  export const getHotelBookingsForSingleUser = async (req, res, next) => {
    try {
      const hotelbookings = await HotelBooking.aggregate([
        {
          $match:
            {
              u_id: new mongoose.Types.ObjectId(req.params.uid),
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
                hotelname: "$hotel.hotelname",
                img: "$hotel.img",
                rooms: 1,
                children: 1,
                adult: 1,
                totalAmt: 1,
                discountAmt: 1,
                bookingdate: 1,
                todate:1,
            
          },
        },
      ]);
      res.status(200).json(hotelbookings);
    } catch (err) {
      next(err);
    }
  };

  export const getHotelBookingCount = async (req, res, next) => {
    try {
      console.log("hii")
      const hotelbookings = await HotelBooking.countDocuments();
      
      
      res.status(200).json(hotelbookings);
    } catch (err) {
      next(err);
      console.log(err)
    }
  };
  export const getHotelBookingCountForSingle = async (req, res, next) => {
    try {
      const hotelbookings = await HotelBooking.countDocuments({h_id: new mongoose.Types.ObjectId(req.params.id)});
      res.status(200).json(hotelbookings);
    } catch (err) {
      next(err);
    }
  };
  
  export const getTotal = async (req, res, next) => {
    try {

      const hotelbookings = await HotelBooking.aggregate([{
        $match:
          {
            createdAt: {
              $gt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
            },
          },
      },
      {
      $group:
      {
      _id: {
        month: {
          $month: "$createdAt",
        },
        year :{
          $year:"$createdAt",
        }
      },
      total: {
        $sum: "$totalAmt"
      }
    }
  },{
    $sort:{
      "_id.year":1,
      "_id.month":1
    }
  }
  ]);
      res.status(200).json(hotelbookings);
    } catch (err) {
      next(err);
    }
  };

  export const getRevenue = async (req, res, next) => {
    try {

      const hotelbookings = await HotelBooking.aggregate([
        {
        $project:{
          totalAmt:1,
          discountAmt:1,
          _id:0,
          id:"hii"
        }
        },
        
        {
        $group:
        {
          _id: "$id",
          total: {
            $sum: "$totalAmt"
          },
            totalDiscount: {
            $sum: "$discountAmt"
          },
        }
      }
    
  ]);
      res.status(200).json(hotelbookings);
    } catch (err) {
      next(err);
    }
  };
  export const getRevenueForSingle = async (req, res, next) => {
    try {

      const hotelbookings = await HotelBooking.aggregate([
        {
          $group:
            {
              _id: "$h_id",
              total: {
                $sum: "$totalAmt",
              },
            },
        },
        {
          $match:
            {
              _id: new mongoose.Types.ObjectId(req.params.id),
            },
        },
      ]);
      res.status(200).json(hotelbookings[0]);
    } catch (err) {
      next(err);
    }
  };
  
  export const VerifyBooking = async (req,res,next)=>{
    try {
      const updatedHotelBooking = await HotelBooking.findByIdAndUpdate(
        req.params.id,{$set :{verified:true}},{ new: true }
      );
      res.status(200).json(updatedHotelBooking);
    } catch (err) {
      next(err);
    }
  }
  export const updateReviewed = async (req,res,next)=>{
    try {
      const updatedHotelBooking = await HotelBooking.findByIdAndUpdate(
        req.params.id,{$set :{reviewed:true}},{ new: true }
      );
      res.status(200).json(updatedHotelBooking);
    } catch (err) {
      next(err);
    }
  }

  export const getChartData = async (req, res, next) => {

    try {

      const hotelbookings = await HotelBooking.aggregate([
        {
          $match:
            {
              h_id: new mongoose.Types.ObjectId(
                req.params.id
              ),
              bookingdate: {
                $gt: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
              },
            },
        },
        {
          $group:
            {
              _id: {
                month: {
                  $month: "$bookingdate",
                },
                year :{
                  $year:"$bookingdate",
                }
              },
              revenue: {
                $sum: "$totalAmt",
              },
              booking: {
                $sum: 1,
              },
            },
        },
        {
      $sort:{
        "_id.year":1,
        "_id.month":1
      }
    }
      ]);
      res.status(200).json(hotelbookings);
    } catch (err) {
      next(err);
    }
  };