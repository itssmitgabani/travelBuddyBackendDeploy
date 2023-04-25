import mongoose, { Schema } from "mongoose";
const FeedbackSchema = new mongoose.Schema(
  {
    u_id: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    feedback: {
      type: String,
      required: true,
    },
    for :{
      type:String,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", FeedbackSchema);
