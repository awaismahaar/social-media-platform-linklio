import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export function sendEmail(to, subject, otp) {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to,
    subject,
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  };
  return mailOptions;
}

export function sendResetEmail(to, subject, html) {
  const mailOptions = {
    from: process.env.SMTP_MAIL,
    to,
    subject,
    html,
  };
  return mailOptions;
}
