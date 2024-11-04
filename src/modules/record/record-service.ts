import { prismaClient } from "@src/prismaClient";
import { Request, Response } from "express";

export async function recordList(req: Request, res: Response) {
    // Create a new record in the database

    const newRecord = await prismaClient.records.findMany();

    console.log("Record lists:", newRecord);

    return res.status(200).json(newRecord);
}