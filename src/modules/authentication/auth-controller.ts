import Express from 'express';
import { signIn, signUp } from './auth-service';

const authenticationRoutes = Express.Router();
authenticationRoutes.post('/sign-in', signIn);
authenticationRoutes.post('/sign-up', signUp);

export { authenticationRoutes };
