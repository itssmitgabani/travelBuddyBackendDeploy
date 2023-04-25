import Admin from "../models/admin.js";
import Hotel from "../models/hotel.js"
import Airline from "../models/airline.js"
import User from "../models/user.js"
import Token from "../models/token.js"
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import validator from 'validator';
import crypto from "crypto"
import { sendEmail } from "../utils/email.js";
import payment from "../models/payment.js";


export const adminregister = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newAdmin = new Admin({
      ...req.body,
      password: hash,
      img: req.body.img==="" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOy82yDB7J2umGoJgo03iwxwDmpXTPfjzDyQ9BiiP7puTOh548G20OhHw6dfGc-LaQmrc&usqp=CAU": req.body.img 
    });

    await newAdmin.save();
    res.status(200).send("Admin has been created.");
  } catch (err) {
    next(err);
  }
};


export const adminlogin = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return next(createError(404, "admin not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong email or password!"));

    const token = jwt.sign(
      { id: admin._id},
      process.env.JWT
    );

    const { password, ...otherDetails } = admin._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }});
  } catch (err) {
    next(err);
  }
};

export const adminPassword = async (req, res, next) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return next(createError(404, "user not found!"));
    
    let token = await new Token({
      userId: admin._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const message = `${process.env.ADMIN_URL}/passwordReset?token=${token.token}&id=${admin._id}`;
    await sendEmail(admin.email, "Verify Email", message);
    
    res.status(200).send("link sent to your E-mail.");

  } catch (err) {
    next(err);
  }
};

export const adminResetPassword = async (req, res, next) => {
  const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
  try {
    
    const admin = await Admin.findOne({ _id: req.body.id });
    if (!admin) return next(createError(400, "invalid link!"));
    
    const token = await Token.findOne({
      userId: admin._id,
      token: req.body.token,
    });
    if (!token) return next(createError(400, "invalid link!"));
    if(req.body.password.length < 8){
      return next(createError(401, "Password length must greater than 8 char!"));
    }
    if(!regex.test(req.body.password)){
      return next(createError(401, "Password must contain one letter and one number!"));
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    
    await Admin.updateOne(
      { _id: admin._id },
      { $set: { password: hash } },
      { new: true }
    );

    await sendEmail(admin.email, "Success", "password changed successfully!");

    await token.deleteOne();
    res.status(200).send("password changed successfully!");

  } catch (err) {
    next(err);
  }
};



export const airlineregister = async (req, res, next) => {
  const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
  try {
    if(!validator.isEmail(req.body.email)){
      return next(createError(401, "enter valid email!"));
    }
    if(!req.body.email || !req.body.password || !req.body.username){
      return next(createError(401, "All Fields Required!"));
    }
    if(req.body.password.length < 8){
      return next(createError(401, "Password length must greater than 8 char!"));
    }
    if(!req.body.password.match(regex)){
      return next(createError(401, "Password must contain one letter and one number!"));
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newAirline = new Airline({
      ...req.body,
      password: hash,
      img: req.body.img==="" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOy82yDB7J2umGoJgo03iwxwDmpXTPfjzDyQ9BiiP7puTOh548G20OhHw6dfGc-LaQmrc&usqp=CAU": req.body.img ,
    });

    await newAirline.save();

    const newPayment = new payment({
      a_id:newAirline._id
    })

    await newPayment.save();
    
    let token = await new Token({
      userId: newAirline._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    
    const message = `${process.env.BASE_URL}/auth/airline/verify/${newAirline.id}/${token.token}`;
    await sendEmail(newAirline.email, "Verify Email", message);

    res.status(200).send("Airline has been created.");
  } catch (err) {
    next(createError(401, "Email Already Exist!"));
  }
};

export const airlineVerify = async (req, res, next) => {
  try {
    const airline = await Airline.findOne({ _id: req.params.id });
    if (!airline) return next(createError(400, "invalid link!"));

    const token = await Token.findOne({
      userId: airline._id,
      token: req.params.token,
    });
    if (!token) return next(createError(400, "invalid link!"));

    await Airline.updateOne({ _id: airline._id},{ verified: true });
    await Token.findByIdAndRemove(token._id);

    res.send("email verified sucessfully... \n now you can login");
  } catch (error) {
    next(error)
  }
};

export const airlinelogin = async (req, res, next) => {
  try {
    const airline = await Airline.findOne({ email: req.body.email });
    if (!airline) return next(createError(404, "airline not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      airline.password
    );
    
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong email or password!"));

      if(!airline.verified){
        return next(createError(400, "please check your email and verify your account"));
      }
      if(!airline.status){
        return next(createError(400, "Aorry your account is De-Activated pleae contact admin!"));
      }
    const token = jwt.sign(
      { id: airline._id},
      process.env.JWT
    );

    const { password, ...otherDetails } = airline._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }});
  } catch (err) {
    next(err);
  }
};

export const airlinePassword = async (req, res, next) => {
  try {
    const airline = await Airline.findOne({ email: req.body.email });
    if (!airline) return next(createError(404, "user not found!"));
    
    let token = await new Token({
      userId: airline._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const message = `${process.env.AIRLINE_URL}/passwordReset?token=${token.token}&id=${airline._id}`;
    await sendEmail(airline.email, "Verify Email", message);
    
    res.status(200).send("link sent to your E-mail.");

  } catch (err) {
    next(err);
  }
};

export const airlineResetPassword = async (req, res, next) => {
  const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
  try {
    
    const airline = await Airline.findOne({ _id: req.body.id });
    if (!airline) return next(createError(400, "invalid link!"));
    
    const token = await Token.findOne({
      userId: airline._id,
      token: req.body.token,
    });
    if (!token) return next(createError(400, "invalid link!"));
    if(req.body.password.length < 8){
      return next(createError(401, "Password length must greater than 8 char!"));
    }
    if(!regex.test(req.body.password)){
      return next(createError(401, "Password must contain one letter and one number!"));
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    
    await Airline.updateOne(
      { _id: airline._id },
      { $set: { password: hash } },
      { new: true }
    );

    await sendEmail(airline.email, "Success", "password changed successfully!");

    await token.deleteOne();
    res.status(200).send("password changed successfully!");

  } catch (err) {
    next(err);
  }
};

export const hotelregister = async (req, res, next) => {
  const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
  try {
    if(!req.body.email || !req.body.password || !req.body.username){
      return next(createError(401, "All Fields Required!"));
    }
    if(!validator.isEmail(req.body.email)){
      return next(createError(401, "enter valid email!"));
    }
    
    if(req.body.password.length < 8){
      return next(createError(401, "Password length must greater than 8 char!"));
    }
    if(!req.body.password.match(regex)){
      return next(createError(401, "Password must contain one letter and one number!"));
    }
    const hotel = await Hotel.findOne({ email: req.body.email });
    if (hotel) return next(createError(404, "email already exist!"));

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newHotel = new Hotel({
      ...req.body,
      password: hash,
      img: req.body.img==="" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOy82yDB7J2umGoJgo03iwxwDmpXTPfjzDyQ9BiiP7puTOh548G20OhHw6dfGc-LaQmrc&usqp=CAU": req.body.img ,
    });

    await newHotel.save();

    const newPayment = new payment({
      h_id:newHotel._id
    })

    await newPayment.save();
    
    let token = await new Token({
      userId: newHotel._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    
    const message = `${process.env.BASE_URL}/auth/hotel/verify/${newHotel.id}/${token.token}`;
    await sendEmail(newHotel.email, "Verify Email", message);

    res.status(200).send("Hotel has been created.");
  } catch (err) {
    next(err)
  }
};


export const hotelVerify = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({ _id: req.params.id });
    if (!hotel) return next(createError(400, "invalid link!"));

    const token = await Token.findOne({
      userId: hotel._id,
      token: req.params.token,
    });
    if (!token) return next(createError(400, "invalid link!"));

    await Hotel.updateOne({ _id: hotel._id},{ verified: true });
    await Token.findByIdAndRemove(token._id);

    res.send("email verified sucessfully... \n now you can login");
  } catch (error) {
    next(error)
  }
};


export const hotellogin = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({ email: req.body.email });
    if (!hotel) return next(createError(404, "hotel not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      hotel.password
    );
    
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong email or password!"));

      if(!hotel.verified){
        return next(createError(400, "please check your email and verify your account"));
      }
      if(!hotel.status){
        return next(createError(400, "Aorry your account is De-Activated pleae contact admin!"));
      }
    const token = jwt.sign(
      { id: hotel._id},
      process.env.JWT
    );

    const { password, ...otherDetails } = hotel._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }});
  } catch (err) {
    next(err);
  }
};


export const hotelPassword = async (req, res, next) => {
  try {
    const hotel = await Hotel.findOne({ email: req.body.email });
    if (!hotel) return next(createError(404, "user not found!"));
    
    let token = await new Token({
      userId: hotel._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const message = `${process.env.HOTEL_URL}/passwordReset?token=${token.token}&id=${hotel._id}`;
    await sendEmail(hotel.email, "Verify Email", message);
    
    res.status(200).send("link sent to your E-mail.");

  } catch (err) {
    next(err);
  }
};

export const hotelResetPassword = async (req, res, next) => {
  const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
  try {
    
    const hotel = await Hotel.findOne({ _id: req.body.id });
    if (!hotel) return next(createError(400, "invalid link!"));
    
    const token = await Token.findOne({
      userId: hotel._id,
      token: req.body.token,
    });
    if (!token) return next(createError(400, "invalid link!"));
    if(req.body.password.length < 8){
      return next(createError(401, "Password length must greater than 8 char!"));
    }
    if(!regex.test(req.body.password)){
      return next(createError(401, "Password must contain one letter and one number!"));
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    
    await Hotel.updateOne(
      { _id: hotel._id },
      { $set: { password: hash } },
      { new: true }
    );

    await sendEmail(hotel.email, "Success", "password changed successfully!");

    await token.deleteOne();
    res.status(200).send("password changed successfully!");

  } catch (err) {
    next(err);
  }
};

export const userregister = async (req, res, next) => {
  const regex = new RegExp("(0|91)?[6-9][0-9]{9}");
  const regex1 = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
  try {
    if(!req.body.email || !req.body.password || !req.body.username || !req.body.mobileno){
      return next(createError(401, "All Fields Required!"));
    }
    if(!validator.isEmail(req.body.email)){
      return next(createError(401, "enter valid email!"));
    }
    if(!regex.test(req.body.mobileno))
  {
    return next(createError(401, "enter valid mobile no!"));
  }

  
  if(req.body.password.length < 8){
    return next(createError(401, "Password length must greater than 8 char!"));
  }
  if(!req.body.password.match(regex1)){
    return next(createError(401, "Password must contain one letter and one number!"));
  }
  const user = await User.findOne({ email: req.body.email });
  if (user) return next(createError(404, "email already exist!"));


    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      ...req.body,
      password: hash,
      img: req.body.img==="" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOy82yDB7J2umGoJgo03iwxwDmpXTPfjzDyQ9BiiP7puTOh548G20OhHw6dfGc-LaQmrc&usqp=CAU": req.body.img ,
    });

    await newUser.save();

    let token = await new Token({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    
    const message = `${process.env.BASE_URL}/auth/user/verify/${newUser._id}/${token.token}`;
    await sendEmail(newUser.email, "Verify Email", message);


    res.status(200).send("User has been created.");
  } catch (err) {
    console.log(err)
    next(err);
  }
};


export const userVerify = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return next(createError(400, "invalid link!"));

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return next(createError(400, "invalid link!"));

    await User.updateOne({ _id: user._id},{ verified: true });
    await Token.findByIdAndRemove(token._id);

    res.send("email verified sucessfully... \n now you can login");
  } catch (error) {
    next(error)
  }
};


export const userLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "user not found!"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong email or password!"));

      if(!user.verified){
        return next(createError(400, "please check your email and verify your account"));
      }
      if(!user.status){
        return next(createError(400, "Sorry your account is De-Activated pleae contact admin!"));
      }
    const token = jwt.sign(
      { id: user._id},
      process.env.JWT
    );

    const { password, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }});
  } catch (err) {
    next(err);
  }
};

export const userPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "user not found!"));
    
    let token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const message = `${process.env.CLIENT_URL}/passwordReset?token=${token.token}&id=${user._id}`;
    await sendEmail(user.email, "Verify Email", message);
    
    res.status(200).send("link sent to your E-mail.");

  } catch (err) {
    next(err);
  }
};

export const userResetPassword = async (req, res, next) => {
  const regex = /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/
  try {
    
    const user = await User.findOne({ _id: req.body.id });
    if (!user) return next(createError(400, "invalid link!"));
    
    const token = await Token.findOne({
      userId: user._id,
      token: req.body.token,
    });
    if (!token) return next(createError(400, "invalid link!"));
    if(req.body.password.length < 8){
      return next(createError(401, "Password length must greater than 8 char!"));
    }
    if(!regex.test(req.body.password)){
      return next(createError(401, "Password must contain one letter and one number!"));
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    
    await User.updateOne(
      { _id: user._id },
      { $set: { password: hash } },
      { new: true }
    );

    await sendEmail(user.email, "Success", "password changed successfully!");

    await token.deleteOne();
    res.status(200).send("password changed successfully!");

  } catch (err) {
    next(err);
  }
};
