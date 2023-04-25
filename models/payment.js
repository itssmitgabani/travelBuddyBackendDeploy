import mongoose, { Schema } from "mongoose";
const PaymentSchema = new mongoose.Schema(
  {
    a_id: {
        type: Schema.Types.ObjectId,
        ref: "Airline"
    },
    h_id: {
        type: Schema.Types.ObjectId,
        ref: "Hotel"
    },
    totalPaidAmt: {
      type: Number,
      default:0
    },
    totalOutstandingAmt: {
      type: Number,
      default: 0
    },
    requested: {
      type: Boolean,
      default:false
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Payment", PaymentSchema);
