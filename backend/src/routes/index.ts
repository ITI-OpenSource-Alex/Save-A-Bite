import { Router } from 'express';
import addressRoutes from './address.routes';
import orderRoutes from './order.routes';

const rootRouter = Router();

rootRouter.use('/addresses', addressRoutes);
rootRouter.use('/orders', orderRoutes);

export default rootRouter;
