import { Request, Response } from 'express';
import { signUpService } from './helper/sign-up';
import { signInService } from './helper/sign-in';


export async function signIn(req: Request, res: Response) {
  try {
    await signInService(req, res);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

export async function signUp(req: Request, res: Response) {
  try {
    await signUpService(req, res);
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
