import Feedback from "../models/feedback.js"
export const createFeedback = async (req,res,next)=>{
    const newFeedback = new Feedback(req.body);
    try{
        await newFeedback.save();
        res.status(200).json("feedback created successfully");
    }catch(err){
        next(err)
    }
}

export const getFeedback = async (req, res, next) => {
    try {
      const feedback = await Feedback.findById(req.params.id);
      res.status(200).json(feedback);
    } catch (err) {
      next(err);
    }
  };
  export const getFeedbacks = async (req, res, next) => {
    try {
      const feedbacks = await Feedback.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "u_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind:
            {
              path: "$user",
            },
        },
        {
          $addFields:
            
            {
              username: "$user.username",
              img: "$user.img",
            },
        },
        {
          $project:
          {
            feedback:1,
            username:1,
            img:1,
          }
        }
      ]);
      res.status(200).json(feedbacks);
    } catch (err) {
      next(err);
    }
  };
  export const getFeedbacksAdmin = async (req, res, next) => {
    try {
      const feedbacks = await Feedback.aggregate([
        {
          $match:{
            for : "WebSite"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "u_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind:
            {
              path: "$user",
            },
        },
        {
          $addFields:
            
            {
              username: "$user.username",
              img: "$user.img",
            },
        },
        {
          $project:
          {
            feedback:1,
            username:1,
            img:1,
          }
        }
      ]);
      res.status(200).json(feedbacks);
    } catch (err) {
      next(err);
    }
  };
  export const getFeedbacksAirline = async (req, res, next) => {
    try {
      const feedbacks = await Feedback.aggregate([
        {
          $match:{
            for : "Airline"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "u_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind:
            {
              path: "$user",
            },
        },
        {
          $addFields:
            
            {
              username: "$user.username",
              img: "$user.img",
            },
        },
        {
          $project:
          {
            feedback:1,
            username:1,
            img:1,
          }
        }
      ]);
      res.status(200).json(feedbacks);
    } catch (err) {
      next(err);
    }
  };
  export const getFeedbacksHotel = async (req, res, next) => {
    try {
      const feedbacks = await Feedback.aggregate([
        {
          $match:{
            for : "Hotel"
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "u_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind:
            {
              path: "$user",
            },
        },
        {
          $addFields:
            
            {
              username: "$user.username",
              img: "$user.img",
            },
        },
        {
          $project:
          {
            feedback:1,
            username:1,
            img:1,
          }
        }
      ]);
      res.status(200).json(feedbacks);
    } catch (err) {
      next(err);
    }
  };