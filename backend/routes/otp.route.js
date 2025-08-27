import { Router } from "express";
import { verifyOtp } from "../controllers/otp.controller.js";
import rateLimit from "express-rate-limit";
const otpVerifyLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, 
  max: 5, 
  message: {
    message: "Too many OTP attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false, 
});

const router = Router();

router.post("/verify-otp", otpVerifyLimiter, verifyOtp);

export default router;
