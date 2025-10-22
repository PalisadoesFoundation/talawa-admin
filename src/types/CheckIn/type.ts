import type { Event } from '../Event/type';
import type { User } from '../User/type';

export type CheckIn = {
  _id: string;
  allotedRoom?: string; // Optional
  allotedSeat?: string; // Optional
  createdAt: Date;
  event: Event;
  feedbackSubmitted: boolean;
  time: Date;
  updatedAt: Date;
  user: User;
};

type CheckInInput = {
  allotedRoom?: string; // Optional
  allotedSeat?: string; // Optional
  eventId: string;
  userId: string;
};

export type CheckInStatus = {
  _id: string;
  checkIn?: CheckIn; // Optional
  user: User;
};
