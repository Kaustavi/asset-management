import { prismaClient } from '../../prismaClient';
import { Request, Response } from 'express';
import { signInDataValidation } from '../../utils/validations';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// import crypto from 'crypto';
import { appEnv } from '../../env';
// import { transporter } from '../../utils/nodemailer';

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

    res.status(200).json({ token });
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
