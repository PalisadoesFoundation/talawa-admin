import type { ViewType } from 'screens/AdminPortal/OrganizationEvents/OrganizationEvents';
import type { Dispatch, SetStateAction } from 'react';
import type { InterfaceRecurrenceRule } from 'utils/recurrenceUtils/recurrenceTypes';

import type { User, Feedback } from 'types/Event/type';

export enum UserRole {
  ADMINISTRATOR = 'ADMINISTRATOR',
  REGULAR = 'REGULAR',
}

export const FilterPeriod = {
  ThisMonth: 'This Month',
  ThisYear: 'This Year',
  All: 'All',
} as const;

export interface IMember {
  createdAt: string;
  name: string;
  emailAddress: `${string}@${string}.${string}`;
  natalSex: string;
  eventsAttended?: {
    id: string;
  }[];
  birthDate: Date;
  role: string;
  id: string;
  tagsAssignedWith: {
    edges: {
      cursor: string;
      node: {
        name: string;
      };
    }[];
  };
}

export interface IEvent {
  userRole?: string;
  key?: string;
  id: string;
  location: string;
  name: string;
  description: string;
  startAt: string;
  endAt: string;
  startTime?: string | null;
  endTime?: string | null;
  allDay: boolean;
  userId?: string;
  /**
   * Determines if the event is visible to the entire community.
   * Often referred to as "Community Visible" in the UI.
   */
  isPublic: boolean;
  isRegisterable: boolean;
  /**
   * Determines if the event is restricted to invited participants only.
   * When true, only invited users can see and access the event.
   */
  isInviteOnly: boolean;
  attendees: Partial<User>[];
  creator: Partial<User>;
  averageFeedbackScore?: number;
  feedback?: Feedback[];
  // Recurring event fields
  isRecurringEventTemplate?: boolean;
  baseEvent?: {
    id: string;
  } | null;
  sequenceNumber?: number | null;
  totalCount?: number | null;
  hasExceptions?: boolean;
  progressLabel?: string | null;

  recurrenceDescription?: string | null;
  recurrenceRule?: InterfaceRecurrenceRule | null;
}

export interface IOrgList {
  id: string;
  members: {
    edges: {
      node: {
        id: string;
        name: string;
        emailAddress: string;
        role?: string;
      };
      cursor: string;
    }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

export interface IStatsModal {
  data: {
    event: {
      _id: string;
      averageFeedbackScore: number | null;
      feedback: Feedback[];
    };
  };
}

export interface ICalendarProps {
  eventData: IEvent[];
  refetchEvents?: () => void;
  orgData?: IOrgList;
  userRole?: string;
  userId?: string;
  viewType?: ViewType;
  onMonthChange?: (month: number, year: number) => void;
  currentMonth?: number;
  currentYear?: number;
}

export interface IEventHeaderProps {
  viewType: ViewType;
  handleChangeView: (item: string | null) => void;
  showInviteModal: () => void;
}

/**
 * Props for EventListCard component.
 *
 * `@remarks` Extends IEvent and adds optional refetchEvents callback.
 */
export interface IEventListCard extends IEvent {
  /** Optional callback to refresh the events list after modifications. */
  refetchEvents?: () => void;
}

export interface IDeleteEventModalProps {
  eventListCardProps: IEventListCard;
  eventDeleteModalIsOpen: boolean;
  toggleDeleteModal: () => void;
  t: (key: string, options?: Record<string, unknown>) => string;
  tCommon: (key: string) => string;
  deleteEventHandler: (
    deleteOption?: 'single' | 'following' | 'all',
  ) => Promise<void>;
}

export interface IPreviewEventModalProps {
  eventListCardProps: IEventListCard;
  eventModalIsOpen: boolean;
  hideViewModal: () => void;
  toggleDeleteModal: () => void;
  t: (key: string, options?: Record<string, unknown>) => string;
  tCommon: (key: string) => string;
  isRegistered?: boolean;
  userId: string;
  eventStartDate: Date;
  eventEndDate: Date;
  setEventStartDate: Dispatch<SetStateAction<Date>>;
  setEventEndDate: Dispatch<SetStateAction<Date>>;
  allDayChecked: boolean;
  setAllDayChecked: Dispatch<SetStateAction<boolean>>;
  publicChecked: boolean;
  setPublicChecked: Dispatch<SetStateAction<boolean>>;
  registerableChecked: boolean;
  setRegisterableChecked: Dispatch<SetStateAction<boolean>>;
  inviteOnlyChecked: boolean;
  setInviteOnlyChecked: Dispatch<SetStateAction<boolean>>;
  formState: {
    name: string;
    eventDescription: string;
    location: string;
    startTime: string;
    endTime: string;
  };
  setFormState: (state: {
    name: string;
    eventDescription: string;
    location: string;
    startTime: string;
    endTime: string;
  }) => void;
  registerEventHandler: () => Promise<void>;
  handleEventUpdate: () => Promise<void>;
  openEventDashboard: () => void;
  recurrence: InterfaceRecurrenceRule | null;
  setRecurrence: Dispatch<SetStateAction<InterfaceRecurrenceRule | null>>;
  customRecurrenceModalIsOpen: boolean;
  setCustomRecurrenceModalIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface IUpdateEventModalProps {
  eventListCardProps: IEventListCard;
  recurringEventUpdateModalIsOpen: boolean;
  toggleRecurringEventUpdateModal: () => void;
  t: (key: string, options?: Record<string, unknown>) => string;
  tCommon: (key: string) => string;
  updateEventHandler: () => Promise<void>;
}

export interface IAttendanceStatisticsModalProps {
  show: boolean;
  handleClose: () => void;
  statistics: {
    totalMembers: number;
    membersAttended: number;
    attendanceRate: number;
  };
  memberData: IMember[];
  t: (key: string, options?: Record<string, unknown>) => string;
}

export interface IEventsAttendedMemberModalProps {
  eventsAttended: Partial<IEvent>[];
  setShow: (show: boolean) => void;
  show: boolean;
  eventsPerPage?: number;
}

export interface IEventEdge {
  node: {
    id: string;
    name: string;
    description?: string | null;
    startAt: string;
    endAt: string;
    allDay: boolean;
    location?: string | null;
    /**
     * Determines if the event is visible to the entire community.
     * Often referred to as "Community Visible" in the UI.
     */
    isPublic: boolean;
    isRegisterable: boolean;
    /**
     * Determines if the event is restricted to invited participants only.
     * When true, only invited users, the creator, and admins can see and access the event.
     */
    isInviteOnly: boolean;
    // Recurring event fields
    isRecurringEventTemplate?: boolean;
    baseEvent?: {
      id: string;
      name: string;
    } | null;
    sequenceNumber?: number | null;
    totalCount?: number | null;
    hasExceptions?: boolean;
    progressLabel?: string | null;
    // New recurrence description fields
    recurrenceDescription?: string | null;
    recurrenceRule?: InterfaceRecurrenceRule | null;
    creator?: {
      id: string;
      name: string;
    };
    attendees?: {
      id: string;
      name: string;
    }[];
  };
  cursor: string;
}

/**
 * Input interface for creating events via CREATE_EVENT_MUTATION.
 * Used by both Admin Portal (CreateEventModal) and User Portal (Events).
 *
 * Note: The recurrence property type matches the return type of
 * formatRecurrenceForPayload from EventForm.tsx
 */
export interface ICreateEventInput {
  name: string;
  startAt: string;
  endAt: string;
  organizationId: string | undefined;
  allDay: boolean;
  /**
   * Determines if the event is visible to the entire community.
   * Often referred to as "Community Visible" in the UI.
   */
  isPublic: boolean;
  isRegisterable: boolean;
  isInviteOnly: boolean;
  description?: string;
  location?: string;
  recurrence?:
    | (Omit<InterfaceRecurrenceRule, 'endDate'> & {
        endDate?: string;
      })
    | null;
}

// Legacy interface exports for backward compatibility
export type InterfaceMember = IMember;
export type InterfaceEvent = IEvent;
export type InterfaceIOrgList = IOrgList;
export type InterfaceStatsModal = IStatsModal;
export type InterfaceCalendarProps = ICalendarProps;
export type InterfaceEventHeaderProps = IEventHeaderProps;
export type InterfaceDeleteEventModalProps = IDeleteEventModalProps;
export type InterfacePreviewEventModalProps = IPreviewEventModalProps;
export type InterfaceEventEdge = IEventEdge;
export type InterfaceUpdateEventModalProps = IUpdateEventModalProps;
export type InterfaceAttendanceStatisticsModalProps =
  IAttendanceStatisticsModalProps;
export type InterfaceEventsAttendedMemberModalProps =
  IEventsAttendedMemberModalProps;
