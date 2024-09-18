import Express from 'express';
import { employeeCreate, employeeDeleteById, employeeGetById, employeeList, employeeUpdate } from './employee-service';

const employeeRoutes = Express.Router();
employeeRoutes.post('/create', employeeCreate);
employeeRoutes.get('/list', employeeList);
employeeRoutes.get('/:id', employeeGetById);
employeeRoutes.put('/update', employeeUpdate);
employeeRoutes.delete('/delete', employeeDeleteById);

export { employeeRoutes };
