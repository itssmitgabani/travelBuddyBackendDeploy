import mongoose from "mongoose";
const CouponSchema = new mongoose.Schema(
  {
    couponname: {
      type: String,
      required: true,
      unique: true,
    },
    discount: {
      type: Number,
      required: true,
      min:0,
      max:100,
    },
    expireat: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", CouponSchema);
