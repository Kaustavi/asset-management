import Express from 'express';
import { recordList } from './record-service';

const recordsRoutes = Express.Router();
recordsRoutes.get('/list', recordList);

export { recordsRoutes };