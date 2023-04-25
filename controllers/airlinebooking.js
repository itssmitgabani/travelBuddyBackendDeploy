import mongoose from "mongoose";
import AirlineBooking from "../models/airlinebooking.js";
import Stripe from 'stripe';
import {v4 as uuidv4} from 'uuid';
const stripe = new Stripe('sk_test_51MnfjYHtJIZ5x7GiPTY4R025StwA4P73MHem8JqJGBmBMgEm30GF2oNu1SXwQ8Fr1xYtSujrJW2wUq2Ifw3Blpeu00zMcf02qT');



export const bookAirline = async (req,res,next)=>{
    const airlineBook = new AirlineBooking(req.body);
    try{

      const payment = await stripe.charges.create({
        amount : req.body.totalAmt * 100 ,
        source:req.body.token.id,
        currency:'INR'
      })
      /*const customer = await stripe.customers.create({
        email: req.body.token.email,
        source: req.body.token.id
      });
      const paymentMethod = await stripe.paymentMethods.create({
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
        payment_method : paymentMethod.id,
        confirm:true,
        receipt_email:req.body.token.email,
        automatic_payment_methods:{
          enabled:true,
        }
        
      },{
        idempotencyKey:uuidv4()
      });
      const paymentIntentC = await stripe.paymentIntents.confirm(
        paymentIntent.id,
        {payment_method: paymentMethod.id}
      );
      */
      if(payment){
        
        const savedBookAirline = await airlineBook.save();
      }
        res.status(200).json("airline booked successfully");
    }catch(err){
        next(err)
    }
}

export const getAirlineBooking = async (req, res, next) => {
    try {
      const airlinebooking = await AirlineBooking.findById(req.params.id);
      res.status(200).json(airlinebooking);
    } catch (err) {
      next(err);
    }
  };
  export const getAirlineBookings = async (req, res, next) => {
    try {
      const airlinebookings = await AirlineBooking.aggregate([
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
                img: "$user.img",
                seats: 1,
                totalAmt: 1,
                discountAmt: 1,
                bookingdate: 1,
                airlinename: "$airline.airlinename"
            
          },
        },
      ]);
      res.status(200).json(airlinebookings);
    } catch (err) {
      next(err);
    }
  };
  export const getFlightBookingsForSingleUser = async (req, res, next) => {
    try {
      const airlinebookings = await AirlineBooking.aggregate([
        {
          $match:
            {
              u_id: new mongoose.Types.ObjectId(req.params.uid),
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
          $lookup:
            {
              from: "flights",
              localField: "f_id",
              foreignField: "_id",
              as: "flight",
            },
        },
        {
          $unwind:
            {
              path: "$flight",
            },
        },
        {
        
            $project:
              {
                _id: 1,
                airlinename: "$airline.airlinename",
                img: "$airline.img",
                seats: 1,
                totalAmt: 1,
                discountAmt: 1,
                sourcecity: "$flight.sourcecity" ,
                destinationcity: "$flight.destinationcity",
                createdAt:1
            
          },
        },
      ]);
      res.status(200).json(airlinebookings);
    } catch (err) {
      next(err);
    }
  };
  export const getAirlineBookingCount = async (req, res, next) => {
    try {
      const airlinebookings = await AirlineBooking.countDocuments();
      res.status(200).json(airlinebookings);
    } catch (err) {
      next(err);
    }
  };
  export const getAirlineBookingCountForSingle = async (req, res, next) => {
    try {
      const airlinebookings = await AirlineBooking.countDocuments({a_id: new mongoose.Types.ObjectId(req.params.id)});
      res.status(200).json(airlinebookings);
    } catch (err) {
      next(err);
    }
  };


  export const getTotal = async (req, res, next) => {
    try {

      const airlinebookings = await AirlineBooking.aggregate([
        {
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
      res.status(200).json(airlinebookings);
    } catch (err) {
      next(err);
    }
  };

  export const getRevenue = async (req, res, next) => {
    try {

      const airlinebookings = await AirlineBooking.aggregate([
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
      res.status(200).json(airlinebookings);
    } catch (err) {
      next(err);
    }
  };
  
  export const getRevenueForSingle = async (req, res, next) => {
    try {

      const airlinebookings = await AirlineBooking.aggregate([
        {
          $group:
            {
              _id: "$a_id",
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
      res.status(200).json(airlinebookings[0]);
    } catch (err) {
      next(err);
    }
  };
  
  export const VerifyBooking = async (req,res,next)=>{
    try {
      const updatedAirlineBooking = await AirlineBooking.findByIdAndUpdate(
        req.params.id,{$set :{verified:true}},{ new: true }
      );
      res.status(200).json(updatedAirlineBooking);
    } catch (err) {
      next(err);
    }
  }

  export const getChartData = async (req, res, next) => {

    try {

      const airlinebookings = await AirlineBooking.aggregate([
        {
          $match:
            {
              a_id: new mongoose.Types.ObjectId(
                req.params.id
              ),
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
      res.status(200).json(airlinebookings);
    } catch (err) {
      next(err);
    }
  };

  
export const getAirlineBookingForUser = async (req, res, next) => {
  try {
    const airlinebooking = await AirlineBooking.aggregate([
      {
        $match:
          {
            _id: new mongoose.Types.ObjectId(req.params.id),
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
        $lookup:
          {
            from: "flights",
            localField: "f_id",
            foreignField: "_id",
            as: "flight",
          },
      },
      {
        $unwind:
          {
            path: "$flight",
          },
      },
    {
      $project:
      {
        _id:1,
        airlinename:"$airline.airlinename",
        seats:1,
        totalAmt:1,
        discountAmt:1,
        verified:1,
        roomNumber:1,
        img:"$airline.img",
        checkin:"$flight.checkin",
        cabin:"$flight.cabin",
        sourcecity:"$flight.sourcecity",
        destinationcity:"$flight.destinationcity",
        departure:"$flight.departure",
        arrival:"$flight.arrival",
      }
    }
    ]);
    res.status(200).json(airlinebooking);
  } catch (err) {
    next(err);
  }
};