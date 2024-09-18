-- CreateEnum
CREATE TYPE "HardwareTypes" AS ENUM ('MOBILE', 'WATCH', 'IMAC', 'MAC_MINI', 'LAPTOP');

-- CreateEnum
CREATE TYPE "Teams" AS ENUM ('FRONTEND', 'BACKEND', 'QA', 'MARKETING', 'DESIGN');

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone_no" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "team" "Teams" NOT NULL,
    "status" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HardwareSystem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "descriptions" TEXT NOT NULL,
    "type" "HardwareTypes" NOT NULL,
    "serial_num" TEXT NOT NULL,
    "assign_id" TEXT NOT NULL,
    "assignee_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "HardwareSystem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Records" (
    "id" TEXT NOT NULL,
    "assignee_by_id" TEXT NOT NULL,
    "system_id" TEXT NOT NULL,

    CONSTRAINT "Records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HardwareSystem_serial_num_key" ON "HardwareSystem"("serial_num");

-- CreateIndex
CREATE UNIQUE INDEX "HardwareSystem_assign_id_key" ON "HardwareSystem"("assign_id");

-- CreateIndex
CREATE UNIQUE INDEX "Records_assignee_by_id_key" ON "Records"("assignee_by_id");

-- CreateIndex
CREATE UNIQUE INDEX "Records_system_id_key" ON "Records"("system_id");

-- AddForeignKey
ALTER TABLE "HardwareSystem" ADD CONSTRAINT "HardwareSystem_assignee_by_id_fkey" FOREIGN KEY ("assignee_by_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Records" ADD CONSTRAINT "Records_assignee_by_id_fkey" FOREIGN KEY ("assignee_by_id") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Records" ADD CONSTRAINT "Records_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "HardwareSystem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
