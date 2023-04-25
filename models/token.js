import mongoose, { Schema } from "mongoose";
const TokenSchema = new mongoose.Schema(
  {
    userId: {
        type: Schema.Types.ObjectId,
        ref: "Hotel",
        required: true,
      },
      token: {
        type: String,
        required: true,
      },
  },
  { timestamps: true }
);

export default mongoose.model("Token", TokenSchema);
