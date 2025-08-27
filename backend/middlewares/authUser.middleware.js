import jwt from "jsonwebtoken";
import { BlacklistToken } from "../models/blacklistToken.model.js";
export async function authUser(req, res, next) {
  try {
    const token =
      req.cookies?.authToken || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }
    // Check if the token is blacklisted
    const blacklistedToken = await BlacklistToken.findOne({ token });
    if (blacklistedToken) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized to access this resource",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      msgError: error.message,
      message: "Unauthorized error",
    });
  }
}
