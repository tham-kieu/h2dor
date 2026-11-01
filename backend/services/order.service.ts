import Order from '../models/Order';

class OrderService {
  async createOrder(userId: string, data: any) {
    const finalPrice =
      data.totalPrice + data.shippingPrice - (data.discountAmount || 0);

    const order = await Order.create({
      user: userId,
      ...data,
      finalPrice: finalPrice < 0 ? 0 : finalPrice,
    });

    return order;
  }

  async getOrderById(id: string) {
    return Order.findById(id)
      .populate('user', 'name email')
      .populate('orderItems.product');
  }

  async getMyOrders(userId: string) {
    return Order.find({ user: userId }).sort({ createdAt: -1 });
  }

  async cancelOrder(id: string, reason?: string) {
    return Order.findByIdAndUpdate(
      id,
      {
        orderStatus: 'cancelled',
        cancelReason: reason,
        cancelledAt: new Date(),
      },
      { new: true }
    );
  }

  async updateStatus(id: string, status: string) {
    return Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    );
  }

  async getStats() {
    return Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
          revenue: { $sum: '$finalPrice' },
        },
      },
    ]);
  }
}

export default new OrderService();