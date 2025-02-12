import type { ViewType } from 'screens/OrganizationEvents/OrganizationEvents';
import {
  type InterfaceRecurrenceRuleState,
  type RecurringEventMutationType,
  type InterfaceRecurrenceRule,
} from 'utils/recurrenceUtils';

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

interface InterfaceEventListCard extends InterfaceEventListCardProps {
  refetchEvents?: () => void;
}

export interface InterfaceDeleteEventModalProps {
  eventListCardProps: InterfaceEventListCard;
  eventDeleteModalIsOpen: boolean;
  toggleDeleteModal: () => void;
  t: (key: string) => string;
  tCommon: (key: string) => string;
  recurringEventDeleteType: RecurringEventMutationType;
  setRecurringEventDeleteType: React.Dispatch<
    React.SetStateAction<RecurringEventMutationType>
  >;
  deleteEventHandler: () => Promise<void>;
}

export interface InterfacePreviewEventModalProps {
  eventListCardProps: InterfaceEventListCard;
  eventModalIsOpen: boolean;
  hideViewModal: () => void;
  toggleDeleteModal: () => void;
  t: (key: string) => string;
  tCommon: (key: string) => string;
  weekDayOccurenceInMonth?: number;
  popover: JSX.Element;
  isRegistered?: boolean;
  userId: string;
  eventStartDate: Date;
  eventEndDate: Date;
  setEventStartDate: React.Dispatch<React.SetStateAction<Date>>;
  setEventEndDate: React.Dispatch<React.SetStateAction<Date>>;
  alldaychecked: boolean;
  setAllDayChecked: React.Dispatch<React.SetStateAction<boolean>>;
  recurringchecked: boolean;
  setRecurringChecked: React.Dispatch<React.SetStateAction<boolean>>;
  publicchecked: boolean;
  setPublicChecked: React.Dispatch<React.SetStateAction<boolean>>;
  registrablechecked: boolean;
  setRegistrableChecked: React.Dispatch<React.SetStateAction<boolean>>;
  recurrenceRuleState: InterfaceRecurrenceRuleState;
  setRecurrenceRuleState: React.Dispatch<
    React.SetStateAction<InterfaceRecurrenceRuleState>
  >;
  recurrenceRuleText: string;
  formState: {
    title: string;
    eventdescrip: string;
    location: string;
    startTime: string;
    endTime: string;
  };
  setFormState: (state: {
    title: string;
    eventdescrip: string;
    location: string;
    startTime: string;
    endTime: string;
  }) => void;
  registerEventHandler: () => Promise<void>;
  handleEventUpdate: () => Promise<void>;
  openEventDashboard: () => void;
}

export interface InterfaceUpdateEventModalProps {
  eventListCardProps: InterfaceEventListCard;
  recurringEventUpdateModalIsOpen: boolean;
  toggleRecurringEventUpdateModal: () => void;
  t: (key: string) => string;
  tCommon: (key: string) => string;
  recurringEventUpdateType: RecurringEventMutationType;
  setRecurringEventUpdateType: React.Dispatch<
    React.SetStateAction<RecurringEventMutationType>
  >;
  recurringEventUpdateOptions: RecurringEventMutationType[];
  updateEventHandler: () => Promise<void>;
}
