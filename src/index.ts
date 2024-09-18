import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();
import { employeeRoutes } from './modules/employee/employee-controller';
import { appEnv } from './env';
import { authenticationRoutes } from './modules/authentication/auth-controller';
import { authenticate } from './middlewares/auth';

const app = express();
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
  console.log('hello world');
  res.send('Hello, TypeScript Express!');
});

app.use('/api', authenticationRoutes);
app.use('/employees', authenticate, employeeRoutes);

app.listen(appEnv.APPLICATION_PORT, () => {
  console.log(`API Server running at http://${appEnv.APPLICATION_URL}:${appEnv.APPLICATION_PORT}`);
});
