import mongoose, { Schema } from "mongoose";
const UserSchema = new mongoose.Schema({
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
  mobileno: {
    type: Number,
    required: true,
  },
  id: {
    type: Number,
  },
  city: {
    type: String,
    default:" ",
  },
  status:{
    type:Boolean,
    default:true
  },
  verified: {
    type: Boolean,
    default: false,
  },
  wishlist:{
    type : [Schema.Types.ObjectId],
    ref: "Room",
  }
},{ timestamps: true }
);

export default mongoose.model("User", UserSchema)