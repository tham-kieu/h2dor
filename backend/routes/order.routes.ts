import express from 'express';
import OrderController from '../controllers/order.controller';
import { protect, admin } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, OrderController.create);
router.get('/my-orders', protect, OrderController.myOrders);
router.get('/stats', protect, admin, OrderController.stats);

router.get('/:id', protect, OrderController.getById);
router.put('/:id/cancel', protect, OrderController.cancel);
router.put('/:id/status', protect, admin, OrderController.updateStatus);

export default router;