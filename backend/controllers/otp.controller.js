import { Otp } from "../models/otp.model.js";
import { User } from "../models/user.model.js";

async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;
    const record = await Otp.findOne({ email });

    if (!record)
      return res.status(400).json({ success: false, message: "OTP not found" });
    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    if (record.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    await Otp.deleteOne({ _id: record._id });
    await User.findOneAndUpdate({ email }, { isVerified: true });
    res
      .status(200)
      .json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
}
export { verifyOtp };
