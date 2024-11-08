import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import 'module-alias/register';
import { employeeRoutes } from './modules/employee/employee-controller';
import { appEnv } from './env';
import { authenticationRoutes } from './modules/authentication/auth-controller';
// import { authenticate } from './middlewares/auth';
import { deviceRoutes } from './modules/hardware-system/hardware-controller';
import { recordsRoutes } from './modules/record/record-controller';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
  console.log('hello world');
  res.send('Hello, TypeScript Express!');
});

app.use('/api', authenticationRoutes);
// app.use('/employees', authenticate, employeeRoutes);   // Info: for authenticated users
app.use('/employees', employeeRoutes);
app.use('/devices', deviceRoutes);
app.use('/records', recordsRoutes);

app.listen(appEnv.APPLICATION_PORT, () => {
  console.log(`API Server running at http://${appEnv.APPLICATION_URL}:${appEnv.APPLICATION_PORT}`);
});
