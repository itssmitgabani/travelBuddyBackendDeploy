import mongoose, { Schema } from "mongoose";
const HotelSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: true,
    default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOy82yDB7J2umGoJgo03iwxwDmpXTPfjzDyQ9BiiP7puTOh548G20OhHw6dfGc-LaQmrc&usqp=CAU"
  },
  hotelname: {
    type: String,
    required: true,
    default:" ",
  },
  city: {
    type: String,
    default:" ",
  },
  locationlink: {
    type: String,
    required: true,
    default:" ",
  },
  address: {
    type: String,
    required: true,
    default:" ",
  },
  category: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
    default:1,
  },
  description: {
    type: String,
    required: true,
    default:" ",
  },
  checkin: {
    type: String,
  },
  checkout: {
    type: String,
  },
  status:{
    type:Boolean,
    default:true
  },
  verified: {
    type: Boolean,
    default: false,
  },
  rooms:{
    type:[Schema.Types.ObjectId],
    ref:"Room"
  }
},{ timestamps: true }
);

export default mongoose.model("Hotel", HotelSchema)