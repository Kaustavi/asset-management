import { Teams } from '@prisma/client';
import { z } from 'zod';

export const dataValidation = z.object({
  name: z.string().min(5, 'Name should be at least 5 characters long').trim(),
  password: z.string().min(5, 'Password should be at least 5 characters long').trim(),
  email: z.string().email().trim(),
  phone_no: z.string().min(10, 'Phone number should be at least 10 digits long').regex(/^\d+$/, 'Phone number must contain only digits').trim(),
  team: z.enum([Teams.BACKEND, Teams.DESIGN, Teams.FRONTEND, Teams.MARKETING, Teams.QA]).default(Teams.FRONTEND),
  status: z.boolean(),
});

export const signInDataValidation = z.object({
  password: z.string().min(5, 'Password should be at least 5 characters long').trim(),
  email: z.string().email().trim(),
});
