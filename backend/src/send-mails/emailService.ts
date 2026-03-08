import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false },
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<any> => {
  try {
    await transporter.sendMail({
      from: `"Save A Bite" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.log("Email Error: " + error);
    throw error;
  }
};

export const sendVerifyEmail = async (to: string, token: string) => {
  const verifyLink = `${process.env.APP_URL || "http://localhost:3000"}/api/auth/verify-email?token=${token}`;
  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #4CAF50;">Verify Your Email - Save A Bite</h2>
          <p>Thank you for registering! Click the button below to verify your email address:</p>
          <a href="${verifyLink}" 
             style="display:inline-block;background:#4CAF50;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0;">
            Verify Email
          </a>
          <p style="color:#888;font-size:13px;">This link will expire in 24 hours. If you did not request this, please ignore this email.</p>
        </div>
    `;
  await sendEmail(to, "Verify Your Email - Save A Bite", html);
};

export const sendOtpEmail = async (
  to: string,
  otp: string,
  purpose: "reset-password" | "change-email"
) => {
  const titleMap = {
    "reset-password": "Reset Your Password",
    "change-email": "Change Your Email",
  };
  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #4CAF50;">${titleMap[purpose]} - Save A Bite</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#333;margin:20px 0;">${otp}</div>
          <p style="color:#888;font-size:13px;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        </div>
    `;
  await sendEmail(to, `${titleMap[purpose]} - Save A Bite`, html);
};

export const sendInvoiceEmail = async (to: string, orderId: string, amount: number) => {
  const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
          <h1>Invoice #${orderId}</h1>
          <p>Thank you for Ordering Through Us</p>
          <p>Total Amount: $${amount.toFixed(2)}</p>
        </div>
    `;
  await sendEmail(to, `Your Invoice #${orderId}`, html);
};
