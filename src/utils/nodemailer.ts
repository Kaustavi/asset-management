import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Dynamically use email from env
    // pass: process.env.EMAIL_PASSWORD, // Dynamically use password from env
  },
});
