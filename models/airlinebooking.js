import mongoose, { Schema } from "mongoose";
const AirlineBookingSchema = new mongoose.Schema({
  u_id: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  a_id: {
    type: Schema.Types.ObjectId,
    ref: "Airline"
  },
  f_id: {
    type: Schema.Types.ObjectId,
    ref: "Flight"
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
  seats: {
    type: Number,
    required: true,
    min: 1,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  
},{ timestamps: true }
);

export default mongoose.model("AirlineBooking", AirlineBookingSchema)