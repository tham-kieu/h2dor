import mongoose, { Document, Schema } from 'mongoose';

export interface ILocationReview extends Document {
  locationId: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const locationReviewSchema = new Schema<ILocationReview>(
  {
    locationId: {
      type: String,
      required: true,
      enum: ['h2dor-ha-noi'],
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: Number.isInteger,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ILocationReview>('LocationReview', locationReviewSchema);
