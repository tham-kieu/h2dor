import mongoose, { Schema, Document, Model } from 'mongoose';

/* ---- Interfaces giữ nguyên ---- */
export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderItems: any[];
  shippingAddress: any;
  paymentMethod: 'cod' | 'banking' | 'momo';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingPrice: number;
  totalPrice: number;
  discountAmount: number;
  finalPrice: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [{ type: Object, required: true }],
    shippingAddress: { type: Object, required: true },

    paymentMethod: { type: String, enum: ['cod', 'banking', 'momo'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },

    shippingPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },

    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);