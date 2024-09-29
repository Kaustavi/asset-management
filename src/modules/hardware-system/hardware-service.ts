import { HardwareSystem, Prisma } from "@prisma/client";
import { prismaClient } from "../../prismaClient";
import { Request, Response } from "express";
import { deviceDataValidation } from "../../utils/validations";

export async function hardwareCreate(req: Request, res: Response) {
  try {
    const body: HardwareSystem = req.body;
    // Validate input using Zod
    const parsedInput = deviceDataValidation.safeParse(body);
    if (!parsedInput.success) {
      // Return a formatted error response if validation fails
      const errors = parsedInput.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      return res.status(400).json({ errors });
    }
    const device = await prismaClient.hardwareSystem.create({
      data: parsedInput.data as any as HardwareSystem,
    });
    return res.status(200).json(device);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

export async function hardwareList(req: Request, res: Response) {
  try {
    // filter
    const filteredValue = req.body;

    // search : need code refactor
    const searchTerm: string | undefined =
      typeof req.query.searchTerm === "string"
        ? req.query.searchTerm
        : undefined;
    const searchQuery: Prisma.HardwareSystemWhereInput = searchTerm
      ? {
          OR: [
            { name: { contains: searchTerm, mode: "insensitive" } }, // Case-insensitive search on name
          ],
        }
      : {};

    const whereQuery: Prisma.HardwareSystemWhereInput = {
      AND: [
        filteredValue, // Add any custom filters passed from the client
        searchQuery,
      ],
    };

    // pagination
    const page: number = parseInt(req.query.page as string) || 1;
    const pageSize: number = 10; // Number of records per page
    const skip = (page - 1) * pageSize; // Calculate how many records to skip
    const take = pageSize; // Number of records per page

    // Fetch paginated users
    const devices = await prismaClient.hardwareSystem.findMany({
      skip,
      take,
      orderBy: {
        created_at: "desc", // or another column like 'createdAt'
      },
      where: whereQuery,
    });

    // Fetch total number of users for calculating total pages
    const totalDevices = await prismaClient.hardwareSystem.count();

    return res.status(200).json({
      devices,
      totalPages: Math.ceil(totalDevices / pageSize),
      currentPage: page,
      totalEmployees: totalDevices,
    });
  } catch (err: any) {
    console.log(err);
    return res.json({ message: err.message });
  }
}

export async function hardwareGetById(req: Request, res: Response) {
  try {
    const { deviceId } = req.params;
    const device = await prismaClient.hardwareSystem.findFirst({
      where: { id: deviceId },
    });
    return res.status(200).json(device);
  } catch (err: any) {
    console.log(err);
    return res.json({ message: err.message });
  }
}

export async function hardwareUpdate(req: Request, res: Response) {
  try {
    const body: HardwareSystem = req.body;

    // Get prev data
    const hardware = await prismaClient.hardwareSystem.findFirst({
      where: { id: body.id },
    });

    if (hardware) {
      // Create a new record in record table
      await prismaClient.records.create({
        data: {
          assignee_by_id: hardware?.assignee_by_id,
          system_id: hardware?.id,
        },
      });
    }

    const updatedDevice = await prismaClient.hardwareSystem.update({
      where: {
        id: body.id,
      },
      data: body,
    });
    return res.status(200).json(updatedDevice);
  } catch (err: any) {
    console.log(err);
    return res.json({ message: err.message });
  }
}

export async function hardwareDeleteById(req: Request, res: Response) {
  try {
    const deviceId: string = req.body.id;

    // Check if the record exists
    const existingDevice = await prismaClient.hardwareSystem.findUnique({
      where: { id: deviceId },
    });

    if (!existingDevice) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Proceed to delete the record if it exists
    const deletedDevice = await prismaClient.hardwareSystem.delete({
      where: { id: deviceId },
    });

    res.json({ message: "Hardware system deleted successfully", deletedDevice });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
