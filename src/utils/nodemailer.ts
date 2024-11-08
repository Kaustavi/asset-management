import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT), // or 465 for SSL
  secure: false, 
  auth: {
    user: process.env.SMTP_EMAIL_USER, // Your email
    pass: process.env.SMTP_EMAIL_PASSWORD, // Your email password or app-specific password
  },
} as nodemailer.TransportOptions);
