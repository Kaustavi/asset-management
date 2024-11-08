import { prismaClient } from '@src/prismaClient';
import { signInDataValidation } from '@src/utils/validations';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { appEnv } from '@src/env';

export async function signInService(req: Request, res: Response) {
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
} 
