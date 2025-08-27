import express from "express";
const router = express.Router();
import { body } from "express-validator";
import {
  acceptFriendRequest,
  changePassword,
  deleteFriend,
  forgotPassword,
  getAllFriend,
  getAllFriendRequests,
  getAllUsers,
  getUserProfile,
  login,
  logout,
  register,
  rejectFriendRequest,
  resetPassword,
  sendFriendRequest,
  updateAvatar,
  updateProfile,
  uploadAvatar,
  socialLogin,
  getUserProfileById,
  searchUsers
} from "../controllers/user.controller.js";
import { authUser } from "../middlewares/authUser.middleware.js";
import upload from "../utils/multer.js";

router.post(
  "/register",
  body("fullName")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),
  body("email").isEmail().withMessage("Please enter a valid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  register
);

router.post(
  "/login",
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  login
);
router.post("/social-login" , socialLogin);
router.get("/logout", authUser, logout);
router.get("/profile", authUser, getUserProfile);
router.get("/search", authUser, searchUsers);
router.get("/get-profile-by-id/:id", authUser, getUserProfileById);
router.put("/upload-avatar", authUser, upload.single("avatar"), uploadAvatar);
router.put("/update-avatar", authUser, upload.single("avatar"), updateAvatar);
router.put("/update-profile", authUser, updateProfile);
router.post("/forget-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.put("/change-password", authUser, changePassword);
router.get("/send-friend-request/:id", authUser, sendFriendRequest)
router.get("/accept-friend-request/:id", authUser, acceptFriendRequest)
router.get("/reject-friend-request/:id", authUser, rejectFriendRequest)
router.get("/get-friend-requests", authUser, getAllFriendRequests);
router.get("/get-all-friends", authUser, getAllFriend);
router.get("/get-all-users", authUser, getAllUsers);
router.delete("/delete-friend/:id", authUser, deleteFriend);

export default router;
