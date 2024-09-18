import { Request, Response } from 'express';
import { prismaClient } from '../../prismaClient';
import { Employee } from '@prisma/client';
import { dataValidation } from '../../utils/validations';
import bcrypt from 'bcrypt';

export async function employeeCreate(req: Request, res: Response) {
  try {
    const body: Employee = req.body;
    // Validate input using Zod
    const parsedInput = dataValidation.safeParse(body);
    if (!parsedInput.success) {
      // Return a formatted error response if validation fails
      const errors = parsedInput.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({ errors });
    }

    const hashedPassword = await bcrypt.hash(parsedInput.data.password, 10);

    // Use parsed input
    const employees = await prismaClient.employee.create({
      data: {
        ...parsedInput.data,
        password: hashedPassword,
      },
    });

    return res.status(200).json(employees);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

export async function employeeList(req: Request, res: Response) {
  console.log(req.user);

  try {
    // filter
    const filteredValue = req.body;
    if (filteredValue) {
      const filteredList = await prismaClient.employee.findMany({
        where: {
          team: filteredValue.team,
        },
      });
      return res.status(200).json(filteredList);
    }

    // search
    const searchTerm: string | undefined = typeof req.query.searchTerm === 'string' ? req.query.searchTerm : undefined;
    if (typeof searchTerm === 'string') {
      const searchedList = await prismaClient.employee.findMany({
        orderBy: { created_at: 'desc' },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          phone_no: true,
          team: true,
          status: true,
        },
        where: {
          OR: [
            {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        },
      });
      return res.status(200).json(searchedList);
    } else {
      // Handle the case when searchTerm is not a string
      console.log('Search term is not a string');
    }
    const employee = await prismaClient.employee.findMany();
    return res.status(200).json(employee);
  } catch (err: any) {
    console.log(err);
    return res.json({ message: err.message });
  }
}

export async function employeeGetById(req: Request, res: Response) {
  try {
    const employeeId: string = req.body.id;
    const employee = await prismaClient.employee.findFirst({ where: { id: employeeId } });
    return res.status(200).json(employee);
  } catch (err: any) {
    console.log(err);
    return res.json({ message: err.message });
  }
}

export async function employeeUpdate(req: Request, res: Response) {
  try {
    const body: Employee = req.body;
    const updatedEmployee = await prismaClient.employee.update({
      where: {
        id: body.id,
      },
      data: {
        email: body.email,
        phone_no: body.phone_no,
        name: body.name,
        team: body.team,
        status: body.status,
      },
    });
    return res.status(200).json(updatedEmployee);
  } catch (err: any) {
    console.log(err);
    return res.json({ message: err.message });
  }
}

export async function employeeDeleteById(req: Request, res: Response) {
  try {
    const employeeId: string = req.body.id;
    const deletedEmployee = await prismaClient.employee.delete({ where: { id: employeeId } });
    return res.status(200).json(deletedEmployee);
  } catch (err: any) {
    console.log(err);
    return res.json({ message: err.message });
  }
}
