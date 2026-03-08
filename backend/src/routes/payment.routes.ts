import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { IsAuthenticatedMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/create-checkout-session', IsAuthenticatedMiddleware, paymentController.createCheckoutSession);

export default router;