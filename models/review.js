import mongoose, { Schema } from "mongoose";
const ReviewSchema = new mongoose.Schema(
  {
    r_id: {
        type: Schema.Types.ObjectId,
        ref: "Room"
    },
    reviews: {
        type: [
            {
            u_id:Schema.Types.ObjectId,
            rating:Number,
            review:String
        }
        ],
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Review", ReviewSchema);
