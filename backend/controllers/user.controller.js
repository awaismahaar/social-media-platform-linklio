import { validationResult } from "express-validator";
import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import jwt from "jsonwebtoken";
import { Otp } from "../models/otp.model.js";
import { sendEmail, sendResetEmail, transporter } from "../utils/nodemailer.js";
import { BlacklistToken } from "../models/blacklistToken.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto";
import ejs from "ejs";
import path from "path";
import { PasswordResetToken } from "../models/PasswordResetToken.model.js";

async function createUsername(fullName) {
  let username = fullName.toLowerCase().split(" ").join("");
  let isExist = await User.find({ username });
  while (isExist.length > 0) {
    username = username + Math.floor(Math.random() * 10);
    isExist = await User.find({ username });
  }
  return username;
}

function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
function generateToken(user) {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
}

async function register(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { fullName, email, password } = req.body;
    const isExist = await User.findOne({ email });
    if (isExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    console.log("username");
    const username = await createUsername(fullName);
    console.log(username);
    let user = await User.create({
      fullName,
      username,
      email,
      password,
    });

    // Generate and store OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    // Delete previous OTPs
    await Otp.deleteMany({ email });

    // Save new OTP
    const newOtp = new Otp({ email, otp, expiresAt });
    await newOtp.save();

    const mailOptions = sendEmail(email, "Your OTP Code", otp);
    await transporter.sendMail(mailOptions);
    user = await User.findById(user._id).select("-password");
    res.status(201).json({
      success: true,
      message: "Registered successfully. OTP sent to email.",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    console.log(email);
    let user = await User.findOne({ email }).select("password");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = generateToken(user);
    user = await User.findById(user._id).select("-password");
    res
      .cookie("authToken", token, {
        httpOnly: true,
        secure: false, // set to true in production (HTTPS)
        sameSite: 'lax', // or 'none' with HTTPS
        maxAge: 24 * 60 * 60 * 7000,
      })
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        user,
        token,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message + error.stack,
    });
  }
}

async function socialLogin(req, res) {
  try {
    const { email, fullName, avatar, provider } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      const username = await createUsername(fullName);
      user = await User.create({
        fullName,
        username,
        email,
        provider,
        avatar,
        isVerified: true,
      });
    }
    const token = generateToken(user);
    user = await User.findById(user._id).select("-password");
    res
      .cookie("authToken", token, {
        httpOnly: true,
        secure: false, // set to true in production (HTTPS)
        sameSite: 'lax', // or 'none' with HTTPS
        maxAge: 24 * 60 * 60 * 7000,
      })
      .status(200)
      .json({
        success: true,
        message: "Social login successful",
        user,
        token,
      });
  }

  catch (error) {
    console.error("Social login failed:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}
async function logout(req, res) {
  try {
    const token = req.cookies.authToken || req.headers.authorization?.split(" ")[1];
    await BlacklistToken.create({ token });
    res.clearCookie("authToken").status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}

async function getUserProfile(req, res) {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}

async function searchUsers(req, res) {
  try {
    const users = await User.find({
      $or: [
        { fullName: { $regex: req.query.search, $options: "i" } },
        { username: { $regex: req.query.search, $options: "i" } },
      ]
    }).select("_id fullName username avatar isVerified");
    res.status(200).json({
      success: true,
      users,
      message: "Users found successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}
async function getUserProfileById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password -friendRequests");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}

async function uploadAvatar(req, res) {
  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars", // Cloudinary folder
      use_filename: true,
      unique_filename: false,
      transformation: [
        { width: 300, height: 300, crop: "thumb", gravity: "face" },
      ],
    });
    // Remove file from server
    fs.unlinkSync(req.file.path);
    // Update user profile image
    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      { avatar: { publicId: result.public_id, url: result.secure_url } },
      { new: true }
    ).select("-password");
    res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}

async function updateAvatar(req, res) {
  try {
    let user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }

    // remove old avatar from Cloudinary
    const { publicId } = user.avatar;
    await cloudinary.uploader.destroy(publicId);

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars", // Cloudinary folder
      use_filename: true,
      unique_filename: false,
      transformation: [
        { width: 300, height: 300, crop: "thumb", gravity: "face" },
      ],
    });
    // Remove file from server
    fs.unlinkSync(req.file.path);
    // Update user profile image
    user = await User.findByIdAndUpdate(
      req.user?.userId,
      { avatar: { publicId: result.public_id, url: result.secure_url } },
      { new: true }
    ).select("-password");
    res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}

async function updateProfile(req, res) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
    }
    const { fullName, bio } = req.body;
    user.fullName = fullName;
    user.bio = bio;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}

async function forgotPassword(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    // Delete old reset tokens for this user
    await PasswordResetToken.deleteMany({ userId: user._id });
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    // create reset token for this user
    await PasswordResetToken.create({
      userId: user._id,
      token: hashedToken,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
    });

    // Render EJS template to HTML
    let templateData = {
      fullName: user.fullName,
      resetLink: `${process.env.CLIENT_URL}/auth/reset-password/${hashedToken}`,
    };
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/resetPasswordEmail.ejs"),
      templateData
    );
    const mailOptions = sendResetEmail(user.email, "Password Reset", html);
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}

async function resetPassword(req, res) {
  try {
    const token = req.params.token;
    console.log(token);
    const passwordResetToken = await PasswordResetToken.findOne({
      token,
    });
    if (!passwordResetToken) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }
    const user = await User.findById(passwordResetToken.userId).select(
      "_id password"
    );
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
      const newPassword = req.body.password;
      if (!newPassword || newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    await PasswordResetToken.deleteMany({ userId: user._id });
    user.password = newPassword;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}

async function changePassword(req, res) {
  try {
    const user = await User.findById(req.user.userId).select("_id password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const { oldPassword, newPassword } = req.body;
    const isPasswordMatch = await user.comparePassword(oldPassword);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Old password is incorrect" });
    }
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }
    user.password = newPassword;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}

async function sendFriendRequest(req, res) {
  try {
    const sender = await User.findById(req.user.userId);
    const receiver = await User.findById(req.params.id);
    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: "Sender or receiver not found",
      });
    }
    if (sender._id.toString() === receiver._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a friend request to yourself",
      });
    }
    const isExistingFriendRequest = receiver.friendRequests.includes(sender._id);
    if (isExistingFriendRequest) {
      return res.status(400).json({
        success: false,
        message: "Friend request already sent",
      });
    }
    // Add sender to receiver's friend requests
    receiver.friendRequests.push(sender._id);
    await receiver.save();
    res.status(200).json({
      success: true,
      message: "Friend request sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}

async function acceptFriendRequest(req, res) {
  try {
    const sender = await User.findById(req.user.userId);
    const receiver = await User.findById(req.params.id);
    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: "Sender or receiver not found",
      });
    }
    if (sender.friendRequests.includes(receiver._id)) {
      sender.friendRequests.pull(receiver._id);
      sender.friends.push(receiver._id);
      receiver.friends.push(sender._id);
      // Save both users after updating their friend lists
      await receiver.save();
      await sender.save();
      return res.status(200).json({
        success: true,
        message: "Friend request accepted",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "No friend request found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}

async function rejectFriendRequest(req, res) {
  try {
    const sender = await User.findById(req.user.userId);
    const receiver = await User.findById(req.params.id);
    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: "Sender or receiver not found",
      });
    }
    if (sender.friendRequests.includes(receiver._id)) {
      sender.friendRequests.pull(receiver._id);
      await sender.save();
      return res.status(200).json({
        success: true,
        message: "Friend request rejected",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "No friend request found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}

async function getAllFriendRequests(req, res) {
  try {
    const user = await User.findById(req.user.userId).populate("friendRequests", "-password -friendRequests -friends");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      friendRequests: user.friendRequests,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}

async function getAllFriend(req, res) {
  try {
    const user = await User.findById(req.user.userId).populate("friends", "-password -friendRequests -friends");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      friends: user.friends,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });

  }
}

async function deleteFriend(req, res) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const friendId = req.params.id;
    if (!user.friends.includes(friendId)) {
      return res.status(400).json({
        success: false,
        message: "You are not friends with this user",
      });
    }
    user.friends.pull(friendId);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Friend deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find({ _id: { $ne: req.user.userId } })
      .select("-password -friendRequests")
      .sort({ createdAt: -1 });
      // Get posts count for each user
      // users.forEach(async (user) => {
      //     user.posts = 0;
      //     const counts = await Post.find({ author : user._id }).countDocuments();
      //     console.log(counts);
      //     user.posts = counts;
      // });
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      msgError: error.message,
    });
  }
}
export {
  register,
  login,
  logout,
  getUserProfile,
  uploadAvatar,
  updateAvatar,
  updateProfile,
  forgotPassword,
  resetPassword,
  changePassword,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getAllFriendRequests,
  getAllFriend,
  deleteFriend,
  getAllUsers,
  socialLogin,
  getUserProfileById,
  searchUsers
};
