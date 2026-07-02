import express from 'express';
import { getConfig, createPaymentIntent } from '../Controllers/paymentController.js';

const router = express.Router();

router.get('/config', getConfig);
router.post('/create-payment-intent', createPaymentIntent);

export default router;
