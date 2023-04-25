import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import hotelRoute from "./routes/hotel.js";
import airlineRoute from "./routes/airline.js";
import userRoute from "./routes/user.js";
import hotelBookRoute from "./routes/hotelbooking.js";
import airlineBookRoute from "./routes/airlinebooking.js";
import couponRoute from "./routes/coupon.js";
import feedbackRoute from "./routes/feedback.js";
import adminRoute from "./routes/admin.js";
import revenueRoute from "./routes/revenue.js";
import roomRoute from "./routes/room.js";
import flightRoute from "./routes/flight.js";
import contactRoute from "./routes/contact.js";
import reviewRoute from "./routes/review.js";
import paymentRoute from "./routes/payment.js";
import bankRoute from "./routes/bank.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};
mongoose.set('strictQuery', true)
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares
app.use(cors())
app.use(cookieParser())
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/hotels", hotelRoute);
app.use("/api/airlines", airlineRoute);
app.use("/api/users", userRoute);
app.use("/api/bookHotel", hotelBookRoute);
app.use("/api/bookAirline", airlineBookRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/feedback", feedbackRoute);
app.use("/api/admin", adminRoute);
app.use("/api/revenue", revenueRoute);
app.use("/api/room", roomRoute);
app.use("/api/flight", flightRoute);
app.use("/api/contact", contactRoute);
app.use("/api/review", reviewRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/bank", bankRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

app.listen(8800, () => {
  connect();
  console.log("Connected to backend.");
});
