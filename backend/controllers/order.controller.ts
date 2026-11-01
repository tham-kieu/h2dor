import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import OrderService from '../services/order.service';
import mongoose from 'mongoose';

class OrderController {
  async create(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!._id;
      const order = await OrderService.createOrder(userId, req.body);

      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async getById(req: AuthRequest, res: Response) {
    try {
      const id = req.params.id as string;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
      }

      const order = await OrderService.getOrderById(id);

      if (!order) {
        return res.status(404).json({ message: 'Not found' });
      }

      if (
        order.user._id.toString() !== req.user?._id &&
        req.user?.role !== 'admin'
      ) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      res.json({ success: true, data: order });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async myOrders(req: AuthRequest, res: Response) {
    try {
      const orders = await OrderService.getMyOrders(req.user!._id);

      res.json({
        success: true,
        count: orders.length,
        data: orders,
      });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async cancel(req: AuthRequest, res: Response) {
    try {
      const order = await OrderService.cancelOrder(
        req.params.id as string,
        req.body.cancelReason
      );

      res.json({ success: true, data: order });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async updateStatus(req: AuthRequest, res: Response) {
    try {
      const order = await OrderService.updateStatus(
        req.params.id as string,
        req.body.status
      );

      res.json({ success: true, data: order });
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  }

  async stats(req: AuthRequest, res: Response) {
    try {
      const stats = await OrderService.getStats();

      res.json({ success: true, data: stats });
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new OrderController();