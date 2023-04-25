import User from "../models/user.js";

import { createError } from "../utils/error.js";
import bcrypt from "bcryptjs";

export const ActivateStatus = async (req,res,next)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,{$set :{status:true}},{ new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}
export const DeActivateStatus = async (req,res,next)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,{$set :{status:false}},{ new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}


export const getUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
      
    const { password, ...otherDetails } = user._doc;
      res.status(200).json({ details: { ...otherDetails }});
    } catch (err) {
      next(err);
    }
  };
  export const getUsers = async (req, res, next) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };
  export const getActivatedUsers = async (req, res, next) => {
    try {
      const users = await User.find({
        status:true
      });
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };
  export const getDeactivatedUsers = async (req, res, next) => {
    try {
      const users = await User.find({
        status:false
      });
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };

  export const getUsersCount = async (req, res, next) => {
    try {
      const users = await User.countDocuments();
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };
  

  
export const UpdateNameAndImg = async (req,res,next)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,{$set:req.body},{ new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}

export const UpdatePassword = async (req, res, next) => {
  const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
  try {
    const user = await User.findOne({ _id: req.params.id });

    const isPasswordCorrect = await bcrypt.compare(
      req.body.oldpassword,
      user.password
    );
    
    if (!isPasswordCorrect)
      return next(createError(400, `incorrect password!`));
    else{
      if(req.body.newpassword!==req.body.Cpassword){   
        return next(createError(401, "password not matched!"));
      }
      if(req.body.newpassword.length <= 0){   
        return next(createError(401, "password can not empty!"));
      }
      
      if(req.body.newpassword.length < 8){
        return next(createError(401, "Password length must greater than 8 char!"));
      }
      if(!regex.test(req.body.newpassword)){
        return next(createError(401, "Password must contain one letter and one number!"));
      }
        
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.newpassword, salt);
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,{$set:{password:hash}},{ new: true }
        );
        res.status(200).json(updatedUser);
      
    }

  } catch (err) {
    next(err);
  }
};

export const UpdateWish = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    
    
    if(user.wishlist.includes(req.params.rid)){
      await User.updateOne({ _id:  user._id}, { $pull: { wishlist: req.params.rid } })
     
    }
    else{
      await User.updateOne({ _id:  user._id}, { $push: { wishlist: req.params.rid } })
      
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

