import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import otpRoutes from "./routes/otp.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();
export const app = express();

// database connection
connectDB();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: `${process.env.CLIENT_URL}`, 
  credentials: true, 
}));
app.use(cookieParser());

// test route
app.get("/", (req, res) => {
  res.send("Backend running on Render");
});

// routes
app.use("/api/users", userRoutes);
app.use("/api/otp", otpRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);