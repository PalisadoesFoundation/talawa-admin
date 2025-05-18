import type { Address } from './type';

export interface InterfaceUser {
  _id: string;
  address?: Address;
  birthDate?: Date;
  createdAt: Date;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  updatedAt?: Date;
  userType?: string;
}

export interface InterfaceUserAttendee {
  _id: string;
  userId: string;
  isRegistered: boolean;
  __typename: string;
  time: string;
}
