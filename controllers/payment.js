import payment from "../models/payment.js"

export const getPaymentDetailsAirline = async (req,res,next)=>{
    try {
      const Payment = await payment.find(
        {a_id:req.params.id}
      );
      res.status(200).json(Payment);
    } catch (err) {
      next(err);
    }
  }

export const getPaymentDetailsHotel = async (req,res,next)=>{
    try {
      const Payment = await payment.find(
        {h_id:req.params.id}
      );
      res.status(200).json(Payment);
    } catch (err) {
      next(err);
    }
  }

export const requestPaymentAirline = async (req,res,next)=>{
    try {
      const Payment = await payment.findByIdAndUpdate(
        req.params.id,{requested:true},{new:true}
      );
      res.status(200).json(Payment);
    } catch (err) {
      next(err);
    }
  }

export const requestPaymentHotel = async (req,res,next)=>{
    try {
        const Payment = await payment.findByIdAndUpdate(
            req.params.id,{requested:true},{new:true}
          );
      res.status(200).json(Payment);
    } catch (err) {
      next(err);
    }
  }

  export const getAllRequestedPaymentDetailsAirline = async (req,res,next)=>{
    try {
      const Payment = await payment.aggregate([{
        $lookup:{
            from : 'airlines',
            localField:'a_id',
            foreignField:'_id',
            as:'airline'
        }
      },
    
    {
        $unwind:{
            path:"$airline"
        }
    },
{
    $match:{
        requested:true
    }
}]
        
      );
      res.status(200).json(Payment);
    } catch (err) {
      next(err);
    }
  }

export const getAllRequestedPaymentDetailsHotel = async (req,res,next)=>{
    try {
      const Payment = await payment.aggregate([{
        $lookup:{
            from : 'hotels',
            localField:'h_id',
            foreignField:'_id',
            as:'hotel'
        }
      },
    
    {
        $unwind:{
            path:"$hotel"
        }
    },
{
    $match:{
        requested:true
    }
}]
        
      );
      res.status(200).json(Payment);
    } catch (err) {
      next(err);
    }
  }

  export const approvePaymentAirline = async (req,res,next)=>{
    try {
      const data = await payment.findById(req.params.id)
      const newTotalPaid = data.totalOutstandingAmt + data.totalPaidAmt 
      const Payment = await payment.findByIdAndUpdate(
        req.params.id,{totalPaidAmt: newTotalPaid , totalOutstandingAmt: 0, requested:false},{new:true}
      );
      res.status(200).json(Payment);
    } catch (err) {
      next(err);
    }
  }

export const approvePaymentHotel = async (req,res,next)=>{
    try {
        const data = await payment.findById(req.params.id)
      const newTotalPaid = data.totalOutstandingAmt + data.totalPaidAmt  
      const Payment = await payment.findByIdAndUpdate(
        req.params.id,{totalPaidAmt:newTotalPaid , totalOutstandingAmt: 0, requested:false},{new:true}
      );
      res.status(200).json(Payment);
    } catch (err) {
      next(err);
    }
  }
  export const addPaymentAirline = async (req,res,next)=>{
    try {
      const data = await payment.find({a_id:req.params.id})
      const newTotalOutstanding = data[0].totalOutstandingAmt + req.body.amount 
      
      const Payment = await payment.findByIdAndUpdate(
        data[0]._id,{totalOutstandingAmt: newTotalOutstanding},{new:true}
      );
      res.status(200).json(Payment);
    } catch (err) {
      next(err);
    }
  }

export const addPaymentHotel = async (req,res,next)=>{
    try {
        const data = await payment.find({h_id:req.params.id})
      const newTotalOutstanding = data[0].totalOutstandingAmt + req.body.amount    
      const Payment = await payment.findByIdAndUpdate(
     data[0]._id,{totalOutstandingAmt: newTotalOutstanding},{new:true}
      );
      res.status(200).json(Payment);
    } catch (err) {
      next(err);
    }
  }
