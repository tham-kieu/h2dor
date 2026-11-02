import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkshopBooking extends Document {
  workshop: mongoose.Types.ObjectId;
  customerName: string;
  email: string;
  phone: string;
  seats: number;
  confirmationCodeHash: string;
  status: 'booked' | 'cancelled';
}

const workshopBookingSchema = new Schema<IWorkshopBooking>(
  {
    workshop: {
      type: Schema.Types.ObjectId,
      ref: 'Workshop',
      required: true,
      index: true,
    },
    customerName: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    seats: { type: Number, required: true, min: 1, max: 10 },
    confirmationCodeHash: { type: String, required: true, unique: true, select: false },
    status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
  },
  { timestamps: true },
);

export default mongoose.model<IWorkshopBooking>('WorkshopBooking', workshopBookingSchema);
