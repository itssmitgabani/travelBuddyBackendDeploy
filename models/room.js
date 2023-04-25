import mongoose, { Schema } from "mongoose";
const RoomSchema = new mongoose.Schema(
  {
    h_id: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxadults: {
      type: Number,
      required: true,
    },
    maxchildren: {
      type: Number,
      required: true,
    },
    roomnumbers: [{ number: Number, unavailableDates: { type: [Date] } }],
    img: {
      type: [String],
    },
    amenities: {
      type: [String],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);
