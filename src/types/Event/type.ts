import type { ActionItem } from '../AdminPortal/actionItem';
import type { Organization } from 'types/AdminPortal/Organization/type';
import type { CheckInStatus } from '../shared-components/CheckIn/type';

export type User = {
  id: string;
  name: string;
  emailAddress: string;
  avatarURL?: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
  natalSex?: string;
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
  recurrence?: string; //Optional
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
  recurrence?: string; //Optional
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
  id: string;
  hasAccepted: boolean;
  hoursVolunteered: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  event?: Event; //Optional
  creator?: User; //Optional
  updater?: User; //Optional
};

export type EventVolunteerInput = {
  eventId: string;
  userId: string;
  groupId?: string; //Optional for compatibility
};

export type UpdateEventVolunteerInput = {
  assignments?: string[]; //Optional
  hasAccepted?: boolean; //Optional
  isPublic?: boolean; //Optional
};

export const EventVolunteerResponseEnum = {
  NO: 'NO',
  YES: 'YES',
} as const;

export type EventVolunteerResponse =
  (typeof EventVolunteerResponseEnum)[keyof typeof EventVolunteerResponseEnum];

export const EventOrderByInputEnum = {
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
  recurrence_ASC: 'recurrence_ASC',
  recurrence_DESC: 'recurrence_DESC',
  startDate_ASC: 'startDate_ASC',
  startDate_DESC: 'startDate_DESC',
  startTime_ASC: 'startTime_ASC',
  startTime_DESC: 'startTime_DESC',
  title_ASC: 'title_ASC',
  title_DESC: 'title_DESC',
} as const;
export type EventOrderByInput =
  (typeof EventOrderByInputEnum)[keyof typeof EventOrderByInputEnum];

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
