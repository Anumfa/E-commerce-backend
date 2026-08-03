import express from 'express';
import { createOrder, getOrders, updateOrderStatus } from '../Controllers/orderController.js';

const router = express.Router();

router.post('/create', createOrder);
router.get('/all', getOrders);
router.put('/status/:id', updateOrderStatus);

export default router;
