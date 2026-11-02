import api from './api';

export interface LocationReview {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface LocationReviewSummary {
  reviews: LocationReview[];
  averageRating: number;
  totalReviews: number;
}

export interface CreateLocationReview {
  name: string;
  rating: number;
  comment: string;
}

export const getLocationReviews = (locationId: string) =>
  api.get<LocationReviewSummary>(`/locations/${locationId}/reviews`);

export const createLocationReview = (
  locationId: string,
  review: CreateLocationReview,
) => api.post<LocationReview>(`/locations/${locationId}/reviews`, review);
