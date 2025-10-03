import type { Address } from './type';

export interface InterfaceUser {
  id: string;
  _id?: string;
  address?: Address;
  birthDate?: Date;
  createdAt: Date;
  email: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  image?: string;
  updatedAt?: Date;
  userType?: string;
  name?: string;
  avatarURL?: string;
}

export interface InterfaceUserAttendee {
  _id: string;
  userId: string;
  isRegistered: boolean;
  __typename: string;
  time: string;
}
