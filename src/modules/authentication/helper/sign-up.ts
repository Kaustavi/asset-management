import { signInDataValidation } from '@src/utils/validations';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prismaClient } from '@src/prismaClient';
import { transportMailer } from '@src/middlewares/mailer';

export async function signUpService(req: Request, res: Response) {
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
    transportMailer(newEmployee);

    return res.status(200).json({ message: 'Employee created successfully' });
} 