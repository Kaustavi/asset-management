import { prismaClient } from "@src/prismaClient";

export async function recordList() {
    // Create a new record in the database

    const newRecord = await prismaClient.records.findMany();

    console.log("Created new record:", newRecord);
}