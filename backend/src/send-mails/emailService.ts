import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
    service:"smtp.gmail.com",
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure:true,
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

});

export const sendEmail = async(to:string,subject:string,html:string):Promise<any> => {
    try {
        await transporter.sendMail({
            from: `"Your App <${process.env.EMAIL_USER}>`,
            to:to,
            subject:subject,
            html:html
        });
        await transporter.verify();
        console.log("SMTP ready");
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.log("Error Message: "+error)
    }
};

export const sendVerifyEmail = async(to:string,token:string) => {
    const verifylink = `https://save-a-bite.com/verify?token=${token}`;
    const html = `
        <h1>Email Verification</h1>
        <p>Click the link below to verify your email:</p>
        <a href="${verifylink}">Verify Email</a>
    `;

    await sendEmail(to,'Verification Email',html);
};

export const sendInvoiceEmail = async(to:string,orderId:number,amount:number) => {
        const html = `
        <h1>Invoice #${orderId}</h1>
        <p>Thank you for Ordering Through US</p>
        <p>Total Amount: $${amount.toFixed(2)}</p>
    `;

    await sendEmail(to, `Your Invoice #${orderId}`, html);
};