import { Request, Response } from 'express';
import { prismaClient } from '../../prismaClient';
import { Employee, Prisma } from '@prisma/client';
import { employeeDataValidation } from '../../utils/validations';
import bcrypt from 'bcrypt';

export async function employeeCreate(req: Request, res: Response) {
  try {
    const body: Employee = req.body;
    // Validate input using Zod
    const parsedInput = employeeDataValidation.safeParse(body);
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
  try {
    // filter
    const filteredValue = req.body;
    
    // search : need code refactor
    const searchTerm: string | undefined = typeof req.query.searchTerm === 'string' ? req.query.searchTerm : undefined;
    const searchQuery: Prisma.EmployeeWhereInput = searchTerm
    ? {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },  // Case-insensitive search on name
          { email: { contains: searchTerm, mode: 'insensitive' } }, // Case-insensitive search on email
        ],
      }
    : {};

    const whereQuery: Prisma.EmployeeWhereInput = {
      AND: [
        filteredValue, // Add any custom filters passed from the client
        searchQuery
      ],
    };
    
    // pagination
    const page: number = parseInt(req.query.page as string) || 1;
    const pageSize: number = 10; // Number of records per page
    const skip = (page - 1) * pageSize; // Calculate how many records to skip
    const take = pageSize; // Number of records per page
  
    // Fetch paginated users
    const employees = await prismaClient.employee.findMany({
      skip,
      take,
      orderBy: {
        created_at: 'desc', // or another column like 'createdAt'
      },
      where: whereQuery,
    });
  
    // Fetch total number of users for calculating total pages
    const totalUsers = await prismaClient.employee.count();

    return res.status(200).json({
      employees,
      totalPages: Math.ceil(totalUsers / pageSize),
      currentPage: page,
      totalEmployees: totalUsers,
    });


    // const employee = await prismaClient.employee.findMany();
    // return res.status(200).json(employee);
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
