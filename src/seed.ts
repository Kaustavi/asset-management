import { HardwareTypes, PrismaClient, Teams } from '@prisma/client';
import { faker } from '@faker-js/faker';
import _ from 'lodash';

const prisma = new PrismaClient();

async function main() {
  // _.range(0, 100).forEach(async () => {
  const employeeData = await prisma.employee.create({
    data: {
      email: faker.internet.email(),
      password: faker.internet.password(),
      phone_no: faker.phone.number(),
      name: faker.person.fullName(),
      team: Teams.FRONTEND,
      status: true,
      created_at: new Date(),
    },
  });
// });
  
  const hardwareData = await prisma.hardwareSystem.create({
    data: {
      name: faker.commerce.productName(),
      descriptions: faker.commerce.productDescription(),
      type: HardwareTypes.IMAC,
      serial_num: faker.string.alphanumeric(15),
      assignee_by_id: employeeData.id,
      assign_id: faker.string.alphanumeric(5),
      created_at: new Date(),
    },
  });

  // _.range(0, 50).forEach(async () => {
    await prisma.records.create({
      data: {
        assignee_by_id: employeeData.id,
        system_id: hardwareData.id,
        employee_name: employeeData.name,
        employee_email: employeeData.email,
      },
    });
  // });

  await prisma.$disconnect();
}
main();
