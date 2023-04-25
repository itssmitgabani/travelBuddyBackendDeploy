import Coupon from "../models/coupon.js"
import { createError } from "../utils/error.js";
export const createCoupon = async (req,res,next)=>{
    const newCoupon = new Coupon(req.body);
    try{

      const coupon = await Coupon.find({couponname: newCoupon.couponname});
      const len = coupon.length
      if(len>=1){
        next(createError(500, "Coupon already created"))
      }
        await newCoupon.save();
        res.status(200).json("coupon created successfully");
    }catch(err){
        next(createError(500, "All fields required"))
    }
}

export const getCoupon = async (req, res, next) => {
    try {
      const coupon = await Coupon.findById(req.params.id);
      res.status(200).json(coupon);
    } catch (err) {
      next(err);
    }
  };
  export const getCoupons = async (req, res, next) => {
    try {
      const coupons = await Coupon.find();
      res.status(200).json(coupons);
    } catch (err) {
      next(err);
    }
  };
  export const getActiveCoupons = async (req, res, next) => {
    try {
      const coupons = await Coupon.find({expireat:{"$gt":new Date().toISOString()}});
      res.status(200).json(coupons);
    } catch (err) {
      next(err);
    }
  };
