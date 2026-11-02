import mongoose, { Document, Schema } from 'mongoose';

export type WorkshopType = 'pottery-making' | 'hand-building' | 'artist-tour';

export interface IWorkshop extends Document {
  title: string;
  type: WorkshopType;
  description: string;
  startsAt: Date;
  durationMinutes: number;
  capacity: number;
  bookedSeats: number;
  priceVnd: number;
  location: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
  isActive: boolean;
}

const workshopSchema = new Schema<IWorkshop>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    type: {
      type: String,
      required: true,
      enum: ['pottery-making', 'hand-building', 'artist-tour'],
    },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    startsAt: { type: Date, required: true, index: true },
    durationMinutes: { type: Number, required: true, min: 15, max: 720 },
    capacity: { type: Number, required: true, min: 1, max: 500 },
    bookedSeats: { type: Number, default: 0, min: 0 },
    priceVnd: { type: Number, required: true, min: 0 },
    location: {
      name: { type: String, required: true, trim: true, maxlength: 120 },
      address: { type: String, required: true, trim: true, maxlength: 300 },
      latitude: { type: Number, required: true, min: -90, max: 90 },
      longitude: { type: Number, required: true, min: -180, max: 180 },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model<IWorkshop>('Workshop', workshopSchema);
