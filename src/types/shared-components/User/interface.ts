import type { Address } from './type';

export interface InterfaceUser {
  id: string;
  address?: Address;
  birthDate?: Date;
  createdAt: Date | string | null | undefined;
  email: string;
  firstName: string;
  lastName: string;
  gender?: string;
  image?: string;
  updatedAt?: Date;
  userType?: string;
  name?: string;
  avatarURL?: string;
}

export interface InterfaceUserAttendee {
  id: string;
  user: {
    id: string;
    name: string;
    emailAddress: string;
  };
  isRegistered: boolean;
  createdAt: string;
  time: string;
}
