import mongoose, { Schema } from "mongoose";
const HotelBookingSchema = new mongoose.Schema({
  u_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  h_id: {
    type: Schema.Types.ObjectId,
    ref: "Hotel"
  },
  r_id: {
    type: Schema.Types.ObjectId,
    ref: "Room"
  },
  adult: {
    type: Number,
    required: true,
    min: 1,
  },
  children: {
    type: Number,
    required: true,
    min: 0,
  },
  rooms: {
    type: Number,
    required: true,
    min: 0,
  },
  totalAmt: {
    type: Number,
    required: true,
    min: 1,
  },
  discountAmt: {
    type: Number,
    required: true,
    min: 0,    
  },
  bookingdate:{
    type:Date,
    required:true,
  },
  todate:{
    type:Date,
    required:true,
  },
  roomNumber:{
    type:[Schema.Types.ObjectId],
    ref:"RoomNumbers"
  },
  roomNumberNo:{
    type:[String],
    ref:"RoomNumbers"
  },
  verified: {
    type: Boolean,
    default: false,
  },
  reviewed: {
    type: Boolean,
    default: false,
  },
},{ timestamps: true }
);

export default mongoose.model("HotelBooking", HotelBookingSchema)