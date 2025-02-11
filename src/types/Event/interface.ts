import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils';
import type { ViewType } from 'screens/OrganizationEvents/OrganizationEvents';

export const Role = {
  USER: 'USER',
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
} as const;

export interface InterfaceEventListCardProps {
  userRole?: string;
  key?: string;
  _id: string;
  location: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string | null;
  endTime: string | null;
  allDay: boolean;
  recurring: boolean;
  recurrenceRule: InterfaceRecurrenceRule | null;
  isRecurringEventException: boolean;
  isPublic: boolean;
  isRegisterable: boolean;
  attendees?: {
    _id: string;
  }[];
  creator?: {
    firstName: string;
    lastName: string;
    _id: string;
  };
}

export interface InterfaceIOrgList {
  admins: { _id: string }[];
}

export interface InterfaceCalendarProps {
  eventData: InterfaceEventListCardProps[];
  refetchEvents?: () => void;
  orgData?: InterfaceIOrgList;
  userRole?: string;
  userId?: string;
  viewType?: ViewType;
}

export interface InterfaceEventHeaderProps {
  viewType: ViewType;
  handleChangeView: (item: string | null) => void;
  showInviteModal: () => void;
}
