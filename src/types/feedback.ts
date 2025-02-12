import type { Event } from './Event/type';

export type Feedback = {
  _id: string;
  createdAt: Date;
  event: Event;
  rating: number;
  review?: string; // Optional
  updatedAt: Date;
};

export type FeedbackInput = {
  eventId: string;
  rating: number;
  review?: string; // Optional
};
