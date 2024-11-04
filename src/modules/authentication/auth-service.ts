import { prismaClient } from '../../prismaClient';
import { Request, Response } from 'express';
import { signInDataValidation } from '../../utils/validations';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import crypto from 'crypto';
import { appEnv } from '../../env';
import nodemailer from 'nodemailer';

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT), // or 465 for SSL
  secure: false, 
  auth: {
    user: process.env.SMTP_EMAIL_USER, // Your email
    pass: process.env.SMTP_EMAIL_PASSWORD, // Your email password or app-specific password
  },
} as nodemailer.TransportOptions);

export async function signIn(req: Request, res: Response) {
  try {
    const requestBody = req.body;
    const parsedInput = signInDataValidation.safeParse(requestBody);
    if (!parsedInput.success) {
      const errors = parsedInput.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({ errors });
    }
    const employee = await prismaClient.employee.findUnique({
      where: { email: parsedInput.data.email },
    });

    if (!employee) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Verify password
    const validPassword = await bcrypt.compare(parsedInput.data.password, employee.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign({ userId: employee.id }, appEnv.JWT_SECRET, {
      expiresIn: '1h',
    });

    await prismaClient.employee.update({
      where: { id: employee.id },
      data: { access_token: token },
    });

    res.status(200).json({ token });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

export async function signUp(req: Request, res: Response) {
  try {
    const requestBody = req.body;
    const parsedInput = signInDataValidation.safeParse(requestBody);
    if (!parsedInput.success) {
      const errors = parsedInput.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({ errors });
    }
    const hashedPassword = await bcrypt.hash(parsedInput.data.password, 10);

    // Check if the email already exists
    const existingEmployee = await prismaClient.employee.findUnique({
      where: { email: parsedInput.data.email },
    });

    if (existingEmployee) {
        return res.status(400).json({ message: 'Email already in use' });
    }
    const newEmployee = await prismaClient.employee.create({
      data: {
        email: parsedInput.data.email,
        password: hashedPassword,
        phone_no: '',
        name: '',
        team: 'FRONTEND',
        status: false,
      },
    });
    // Send email to the new employee
    await transporter.sendMail({
      from: 'kaustavi@trial-351ndgwe1yrgzqx8.mlsender.net', // Your email
      to: newEmployee.email, // Receiver email
      subject: 'Welcome to Our Service!',
      text: 'Thank you for signing up! We’re excited to have you on board.',
      html: `<p>Thank you for signing up, <strong>${newEmployee.email}</strong>! We’re excited to have you on board.</p>`,
    });

    return res.status(200).json({ message: 'Employee created successfully' });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}
// export async function forgetPassword(req: Request, res: Response) {
//   const { email } = req.body;
//   const user = await prismaClient.employee.findUnique({ where: { email } });
//   if (!user) return res.status(404).json({ message: 'User not found.' });

//   const resetToken = crypto.randomBytes(32).toString('hex');
//   const resetTokenExpiry = new Date(Date.now() + 3600000); // 1-hour expiry

//   await prismaClient.employee.update({
//     where: { email },
//     data: {
//       resetPasswordToken: resetToken,
//       resetPasswordExpiry: resetTokenExpiry,
//     },
//   });

//   const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
//   await transporter.sendMail({
//     to: email,
//     subject: 'Password Reset',
//     html: `<p>Click the link to reset your password: <a href="${resetUrl}">Reset Password</a></p>`,
//   });

//   res.json({ message: 'Password reset email sent.' });
// }
