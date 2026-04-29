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
      from: `"LastBite" <${process.env.EMAIL_USER}>`,
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
          <h2 style="color: #4CAF50;">Verify Your Email - LastBite</h2>
          <p>Thank you for registering! Click the button below to verify your email address:</p>
          <a href="${verifyLink}" 
             style="display:inline-block;background:#4CAF50;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;margin:16px 0;">
            Verify Email
          </a>
          <p style="color:#888;font-size:13px;">This link will expire in 24 hours. If you did not request this, please ignore this email.</p>
        </div>
    `;
  await sendEmail(to, "Verify Your Email - LastBite", html);
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
          <h2 style="color: #4CAF50;">${titleMap[purpose]} - LastBite</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#333;margin:20px 0;">${otp}</div>
          <p style="color:#888;font-size:13px;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
        </div>
    `;
  await sendEmail(to, `${titleMap[purpose]} - LastBite`, html);
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

export const sendVendorApprovalEmail = async (to: string, storeName: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #10b981; border-radius: 20px; background-color: #f0fdf4;">
      <h2 style="color: #059669;">Congratulations! 🎉</h2>
      <p style="font-size: 16px; color: #374151;">Your application for <strong>${storeName}</strong> has been approved!</p>
      <p style="color: #4b5563;">You now have access to your Vendor Dashboard. Please log in to your account first.</p>
      <a href="${process.env.FRONTEND_URL}/login" 
         style="display:inline-block;background:#10b981;color:white;padding:12px 30px;border-radius:12px;text-decoration:none;margin:20px 0;font-weight:bold;">
        Login to Access Dashboard
      </a>
      <hr style="border: none; border-top: 1px solid #d1fae5; margin: 20px 0;">
      <p style="color: #6b7280; font-size: 12px;">Welcome to the LastBite family!</p>
    </div>
  `;
  await sendEmail(to, `Application Approved: ${storeName} is now live!`, html);
};

export const sendVendorRejectionEmail = async (to: string, storeName: string, reason: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ef4444; border-radius: 20px; background-color: #fef2f2;">
      <h2 style="color: #dc2626;">Application Update</h2>
      <p style="font-size: 16px; color: #374151;">We reviewed your application for <strong>${storeName}</strong>.</p>
      <div style="background: white; padding: 15px; border-radius: 12px; border-left: 4px solid #ef4444; margin: 20px 0;">
        <p style="margin: 0; color: #b91c1c; font-weight: bold;">Reason for rejection:</p>
        <p style="margin: 5px 0 0 0; color: #4b5563;">${reason}</p>
      </div>
      <p style="color: #4b5563;">If you believe this was a mistake or would like to apply again after addressing the reason above, please feel free to do so.</p>
      <hr style="border: none; border-top: 1px solid #fee2e2; margin: 20px 0;">
      <p style="color: #6b7280; font-size: 12px;">Best regards,<br>The LastBite Team</p>
    </div>
  `;
  await sendEmail(to, `Update on your vendor application for ${storeName}`, html);
};
