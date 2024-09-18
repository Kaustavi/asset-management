import Express from 'express';
import { signIn } from './auth-service';

const authenticationRoutes = Express.Router();
authenticationRoutes.post('/sign-in', signIn);

export { authenticationRoutes };
