import mongoose, { Schema } from "mongoose";
const FlightSchema = new mongoose.Schema(
  {
    a_id: {
      type: Schema.Types.ObjectId,
      ref: "Airline",
    },
    rate: {
      type: Number,
      required: true,
    },
    seats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    checkin: {
      type: Number,
      required: true,
    },
    cabin: {
      type: Number,
      required: true,
    },
    planename:{
        type:String,
        required:true,
    },
    sourcecity:{
        type:String,
        required:true,
    },
    destinationcity:{
        type:String,
        required:true,
    },
    departure:{
        type:Date,
        required:true,
    },
    arrival:{
        type: Date,
        required:true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Flight", FlightSchema);
