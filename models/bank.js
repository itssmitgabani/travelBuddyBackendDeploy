import mongoose, { Schema } from "mongoose";
const BankSchema = new mongoose.Schema(
  {
    a_id:{
        type: Schema.Types.ObjectId,
        ref: "Airline"
    },
    h_id:{
        type: Schema.Types.ObjectId,
        ref: "Hotel"
    },
    accountNo: {
      type: Number,
      required:true,
    },
    ifscCode: {
      type: String,
      required:true,
    },
    name: {
      type: String,
      required:true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("bank", BankSchema);
