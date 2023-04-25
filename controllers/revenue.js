import AirlineBooking from "../models/airlinebooking.js";
import HotelBooking from "../models/hotelbooking.js";

  export const getRevenue = async (req, res, next) => {
    try {

      const hotelbookings = await HotelBooking.aggregate([
        {
        $project:{
          totalAmt:1,
          discountAmt:1,
          _id:0,
          id:"hii"
        }
        },
        
        {
        $group:
        {
          _id: "$id",
          total: {
            $sum: "$totalAmt"
          },
            totalDiscount: {
            $sum: "$discountAmt"
          },
        }
      }
    
  ]);
  const airlinebookings = await AirlineBooking.aggregate([
    {
    $project:{
      totalAmt:1,
      discountAmt:1,
      _id:0,
      id:"hii"
    }
    },
    
    {
    $group:
    {
      _id: "$id",
      total: {
        $sum: "$totalAmt"
      },
        totalDiscount: {
        $sum: "$discountAmt"
      },
    }
  }

  
]);
    const totalR = airlinebookings[0].total + hotelbookings[0].total;
    const totalD = airlinebookings[0].totalDiscount + hotelbookings[0].totalDiscount;
    const inc = totalR * 10 / 100 - totalD
const revenue = {
    total:totalR,
    totalDiscount:totalD,
    income:inc
  }
      res.status(200).json(revenue);
    } catch (err) {
      next(err);
    }
  };
  