import mongoose from "mongoose";
import Hotel from "../models/hotel.js";
import Flight from "../models/flight.js";
import { createError } from "../utils/error.js";
import airline from "../models/airline.js";
export const addFlight = async (req,res,next)=>{
    const newFlight = new Flight(req.body);
    try{
        const flight = await newFlight.save();
        await airline.findByIdAndUpdate(
            flight.a_id,{$push:{"flights":flight._id}},{ new: true }
          );
        res.status(200).json("flight created successfully");
    }catch(err){
        next(createError(500, "All fields required"))
        console.log(err)
    }
}
export const findFlight = async (req,res,next)=>{
    try{
        const flight = await Flight.findById(req.params.id
          );
        res.status(200).json(flight);
    }catch(err){
        next(createError(500, "All fields required"))
    }
}
export const findFlightForSingle = async (req,res,next)=>{
    try{
        const flights = await Flight.aggregate([
            {
              $match:
                {
                  a_id: new mongoose.Types.ObjectId(req.params.id)  
                },
            },]);
        res.status(200).json(flights);
    }catch(err){
        next(createError(500, "All fields required"))
    }
}
export const updateFlight = async (req,res,next)=>{
    try{
        const flight = await Flight.findByIdAndUpdate(req.params.id,{$set:req.body},{ new: true }
          );
        res.status(200).json(flight);
    }catch(err){
        next(createError(500, "All fields required"))
    }
}

export const updateAvailableSeats = async (req,res,next)=>{
    try{
        const flight = await Flight.findByIdAndUpdate(req.params.id,{$inc: {availableSeats: -req.body.seats}},{ new: true }
          );
        res.status(200).json(flight);
    }catch(err){
        next(createError(500, "All fields required"))
    }
}
export const getTotalFlight = async (req,res,next)=>{
    try{
        
      const totalRoom = await Flight.aggregate([
        {
          $match:
            {
              a_id: new mongoose.Types.ObjectId(req.params.id)  
            },
        },
        {
          $count: "total",
            
        },
      ]);
      res.status(200).json(totalRoom[0]);
    }catch(err){
        next(createError(500, "All fields required"))
        console.log(err)
    }
}

export const findFlightByDate = async (req, res, next) => {
  const { min, max, from , date , to ,sort} = req.query;
  const a = parseInt(min)
  const b = parseInt(max)
  const s = parseInt(sort)
  var regexFrom = new RegExp(["^", from, "$"].join(""), "i");
  var regexTo = new RegExp(["^", to, "$"].join(""), "i");
  
  
  let newDate = new Date(date)
let day = newDate.getDate();

let month = newDate.getMonth();
month+=1;
let year = newDate.getFullYear();
if (day < 10) {
  day = '0' + day;
}

if (month < 10) {
  month = `0${month}`;
}
let format4 = year + "-" + month + "-" + day;
  console.log(format4)
  try {
    const flights = await Flight.aggregate(
      [
       { $addFields: { "ddate":  {$dateToString:{format: "%Y-%m-%d", date: "$departure"}}}},
        {
          $match:
            {
              sourcecity : regexFrom,
              destinationcity : regexTo,
              ddate:format4,
              rate: { $gte: a , $lte : b}
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
          $project: {
            airlinename: "$airline.airlinename",
            a_id: 1,
            rate: 1,
            sourcecity: 1,
            destinationcity: 1,
            departure: 1,
            arrival: 1,
            category:1,
          },
        },
        {
          $sort:
            {
              rate: s,
            },
        },
      ]
    );
    res.status(200).json(flights);
  } catch (err) {
    next(err);
  }
};


export const findSingleFlight = async (req,res,next)=>{
  try{
      const flight = await Flight.aggregate([
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
  
]);
      res.status(200).json(flight);
  }catch(err){
      next(createError(500, "All fields required"))
  }
}