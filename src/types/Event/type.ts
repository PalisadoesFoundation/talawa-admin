import type { ActionItem } from '../actionItem';
import type { Organization } from 'types/Organization/type';
import type { CheckInStatus } from '../CheckIn/type';
import type { Address } from '../User/type';

export type User = {
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
};

export type Event = {
  _id: string;
  actionItems: ActionItem[]; //Optional + nullable
  admins?: User[]; //Optional + non-nullable
  allDay: boolean;
  attendees: User[]; //Optional + nullable
  attendeesCheckInStatus: CheckInStatus[];
  averageFeedbackScore?: number; //Optional
  createdAt: Date;
  creator: User; //Optional
  description: string;
  endDate?: Date; //Optional
  endTime?: string; //Optional
  feedback: Feedback[];
  isPublic: boolean;
  isRegisterable: boolean;
  latitude?: number; //Optional
  location?: string; //Optional
  longitude?: number; //Optional
  organization?: Organization; //Optional
  recurrance?: string; //Optional
  recurring: boolean;
  startDate: Date;
  startTime: string; //Optional
  status: string;
  title: string;
  updatedAt: Date;
};

export type Feedback = {
  _id: string;
  createdAt: Date;
  event?: Event;
  rating: number;
  review: string | null; // Optional
  updatedAt: Date;
};

export type FeedbackInput = {
  eventId: string;
  rating: number;
  review?: string; // Optional
};

export type EventInput = {
  allDay: boolean;
  description: string;
  endDate?: Date; //Optional
  endTime?: string; //Optional
  isPublic: boolean;
  isRegisterable: boolean;
  latitude?: number; //Optional
  location?: string; //Optional
  longitude?: number; //Optional
  organizationId: string;
  recurrance?: string; //Optional
  recurring: boolean;
  startDate: Date;
  startTime?: string; //Optional
  title: string;
};

export type EventAttendeeInput = {
  eventId: string;
  userId: string;
};

export type EventVolunteer = {
  _id: string;
  createdAt: Date;
  creator?: User; //Optional
  event?: Event; //Optional
  isAssigned?: boolean; //Optional
  isInvited?: boolean; //Optional
  response?: string; //Optional
  updatedAt: Date;
  user: User;
};

export type EventVolunteerInput = {
  eventId: string;
  userId: string;
};

export const EventVolunteerResponse = {
  NO: 'NO',
  YES: 'YES',
} as const;

// eslint-disable-next-line no-redeclare
export type EventVolunteerResponse =
  (typeof EventVolunteerResponse)[keyof typeof EventVolunteerResponse];

export const EventOrderByInput = {
  allDay_ASC: 'allDay_ASC',
  allDay_DESC: 'allDay_DESC',
  description_ASC: 'description_ASC',
  description_DESC: 'description_DESC',
  endDate_ASC: 'endDate_ASC',
  endDate_DESC: 'endDate_DESC',
  endTime_ASC: 'endTime_ASC',
  endTime_DESC: 'endTime_DESC',
  id_ASC: 'id_ASC',
  id_DESC: 'id_DESC',
  location_ASC: 'location_ASC',
  location_DESC: 'location_DESC',
  recurrance_ASC: 'recurrance_ASC',
  recurrance_DESC: 'recurrance_DESC',
  startDate_ASC: 'startDate_ASC',
  startDate_DESC: 'startDate_DESC',
  startTime_ASC: 'startTime_ASC',
  startTime_DESC: 'startTime_DESC',
  title_ASC: 'title_ASC',
  title_DESC: 'title_DESC',
} as const;
// eslint-disable-next-line no-redeclare
export type EventOrderByInput =
  (typeof EventOrderByInput)[keyof typeof EventOrderByInput];

export type EventWhereInput = {
  description?: string; //Optional
  description_contains?: string; //Optional
  description_in?: string[]; //non-nullable
  description_not?: string; //Optional
  description_not_in?: string[]; //non-nullable
  description_starts_with?: string;

  id?: string; //Optional
  id_contains?: string; //Optional
  id_in?: string[]; //non-nullable
  id_not?: string; //Optional
  id_not_in?: string[]; //non-nullable
  id_starts_with?: string; //Optional

  location?: string; //Optional
  location_contains?: string; //Optional
  location_in?: string[]; //non-nullable
  location_not?: string; //Optional
  location_not_in?: string[]; //non-nullable
  location_starts_with?: string; //Optional

  organization_id?: string; //Optional

  title?: string; //Optional
  title_contains?: string; //Optional
  title_in?: string[]; //non-nullable
  title_not?: string; //Optional
  title_not_in?: string[]; //non-nullable
  title_starts_with?: string; //Optional
};
