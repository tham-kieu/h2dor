import api from './api';

export type WorkshopType = 'pottery-making' | 'hand-building' | 'artist-tour';

export interface Workshop {
  _id: string;
  title: string;
  type: WorkshopType;
  description: string;
  startsAt: string;
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
}

export interface WorkshopBookingInput {
  customerName: string;
  email: string;
  phone: string;
  seats: number;
}

export interface WorkshopBookingConfirmation {
  bookingId: string;
  confirmationCode: string;
  workshopTitle: string;
  startsAt: string;
  seats: number;
  cancellationDeadline: string;
}

export type CreateWorkshopInput = Omit<Workshop, '_id' | 'bookedSeats'> & {
  bookedSeats?: number;
};

export const getWorkshops = () => api.get<Workshop[]>('/workshops');

export const createWorkshop = (workshop: CreateWorkshopInput) =>
  api.post<Workshop>('/workshops', workshop);

export const bookWorkshop = (id: string, booking: WorkshopBookingInput) =>
  api.post<WorkshopBookingConfirmation>(`/workshops/${id}/bookings`, booking);

export const cancelWorkshopBooking = (confirmationCode: string) =>
  api.post<{ message: string }>('/workshops/bookings/cancel', { confirmationCode });
