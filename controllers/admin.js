import Admin from "../models/admin.js";

import { createError } from "../utils/error.js";
import bcrypt from "bcryptjs";

export const UpdateNameAndImg = async (req,res,next)=>{
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,{$set:req.body},{ new: true }
    );
    res.status(200).json(updatedAdmin);
  } catch (err) {
    next(err);
  }
}

export const UpdatePassword = async (req, res, next) => {
  const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
  try {
    const admin = await Admin.findOne({ _id: req.params.id });

    const isPasswordCorrect = await bcrypt.compare(
      req.body.oldpassword,
      admin.password
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
        const updatedAdmin = await Admin.findByIdAndUpdate(
          req.params.id,{$set:{password:hash}},{ new: true }
        );
        res.status(200).json(updatedAdmin);
      
    }

  } catch (err) {
    next(err);
  }
};


export const getAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ _id: req.params.id });


    const { password, ...otherDetails } = admin._doc;
    res
      .status(200)
      .json({ details: { ...otherDetails }});
  } catch (err) {
    next(err);
  }
};

export const getAdminsCount = async (req, res, next) => {
  try {
    const admins = await Admin.countDocuments();
    res.status(200).json(admins);
  } catch (err) {
    next(err);
  }
};
