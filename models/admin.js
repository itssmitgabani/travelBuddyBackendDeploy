import mongoose from "mongoose";
const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOy82yDB7J2umGoJgo03iwxwDmpXTPfjzDyQ9BiiP7puTOh548G20OhHw6dfGc-LaQmrc&usqp=CAU"
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admin", AdminSchema);
