import Express from 'express';
import { hardwareCreate, hardwareDeleteById, hardwareGetById, hardwareList, hardwareUpdate } from './hardware-service';

const deviceRoutes = Express.Router();
deviceRoutes.post('/create', hardwareCreate);
deviceRoutes.get('/list', hardwareList);
deviceRoutes.get('/:deviceId', hardwareGetById);
deviceRoutes.put('/update', hardwareUpdate);
deviceRoutes.delete('/delete', hardwareDeleteById);

export { deviceRoutes };
