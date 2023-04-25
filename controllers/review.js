import { mongoose } from "mongoose";
import review from "../models/review.js";
import { createError } from "../utils/error.js";

export const addReview = async (req, res, next) => {
  const newReview = new review(req.body);
  try {
    const room = await review.countDocuments({ r_id: req.body.r_id });

    if (room >= 1) {
      await review.updateOne(
        { r_id: new mongoose.Types.ObjectId(req.body.r_id) },
        {
          $push: {
            reviews: {
              u_id: req.body.reviews.u_id,
              rating: req.body.reviews.rating,
              review: req.body.reviews.review,
            },
          },
        }
      );
    } else {
      await newReview.save();
    }

    res.status(200).json("review created successfully");
  } catch (err) {
    next(createError(500, "All fields required"));
    console.log(err);
  }
};

export const getAvg = async (req, res, next) => {
  try {
    const avg = await review.aggregate([
      {
        $match: {
          r_id: new mongoose.Types.ObjectId(req.params.id),
        },
      },

      {
        $unwind:
          {
            path: "$reviews",
          },
      },
      {
        $group:
          {
            _id: 1,
            count: {
              $avg: "$reviews.rating",
            },
          },
      },
    ]);

    res.status(200).json(avg);
  } catch (err) {
    next(createError(500, "All fields required"));
    console.log(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const avg = await review.aggregate([
      {
        $match: {
          r_id: new mongoose.Types.ObjectId(req.params.id),
        },
      },

      {
        $unwind:
          {
            path: "$reviews",
          },
      },
      {
        $lookup:
        {
          from:'users',
          localField:'reviews.u_id',
          foreignField:'_id',
          as:'user'
        }
      },
      {
        $unwind:
          {
            path: "$user",
          },
      },
      {
        $project:
        { 
          
          rating : "$reviews.rating",
          review : "$reviews.review",
          username : "$user.username",
          img : "$user.img",
        }
      }
    ]);
    res.status(200).json(avg);
  } catch (err) {
    next(createError(500, "All fields required"));
    console.log(err);
  }
};
