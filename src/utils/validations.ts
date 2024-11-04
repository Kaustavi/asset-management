import { HardwareTypes, Teams } from '@prisma/client';
import { z } from 'zod';

export const employeeDataValidation = z.object({
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
  confirm_password: z.string().min(5, 'Password should be at least 5 characters long').trim().optional(),
});

export const deviceDataValidation = z.object({
  name: z.string().min(5, 'Name should be at least 5 characters long').trim(),
  descriptions: z.string().min(50, 'Name should be at least 50 characters long').trim(),
  serial_num: z.string().min(15, 'Serial number should be at least 15 characters long').trim(),
  type: z.enum([HardwareTypes.MAC_MINI, HardwareTypes.IMAC, HardwareTypes.LAPTOP, HardwareTypes.MOBILE, HardwareTypes.MOBILE]).default(HardwareTypes.MAC_MINI),
  assignee_by_id: z.string().uuid().nullable(),
  assign_id: z.string().min(5, 'Assign ID should be at least 5 characters long').trim(),
});