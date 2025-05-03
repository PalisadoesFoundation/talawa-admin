import type { ViewType } from 'screens/OrganizationEvents/OrganizationEvents';

import type { User, Feedback } from 'types/Event/type';

export const Role = {
  USER: 'USER',
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
};

export enum UserRole {
  ADMINISTRATOR = 'ADMINISTRATOR',
  REGULAR = 'REGULAR',
}

export const FilterPeriod = {
  ThisMonth: 'This Month',
  ThisYear: 'This Year',
  All: 'All',
} as const;

export interface InterfaceMember {
  createdAt: string;
  firstName: string;
  lastName: string;
  email: `${string}@${string}.${string}`;
  gender: string;
  eventsAttended?: {
    _id: string;
  }[];
  birthDate: Date;
  __typename: string;
  _id: string;
  tagsAssignedWith: {
    edges: {
      cursor: string;
      node: {
        name: string;
      };
    }[];
  };
}

export interface InterfaceEvent {
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
  userId?: string;
  isPublic: boolean;
  isRegisterable: boolean;
  attendees: Partial<User>[];
  creator: Partial<User>;
  averageFeedbackScore?: number;
  feedback?: Feedback[];
}

export interface InterfaceIOrgList {
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
export interface InterfaceStatsModal {
  data: {
    event: {
      _id: string;
      averageFeedbackScore: number | null;
      feedback: Feedback[];
    };
  };
}

export interface InterfaceCalendarProps {
  eventData: InterfaceEvent[];
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

interface InterfaceEventListCard extends InterfaceEvent {
  refetchEvents?: () => void;
}

export interface InterfaceDeleteEventModalProps {
  eventListCardProps: InterfaceEventListCard;
  eventDeleteModalIsOpen: boolean;
  toggleDeleteModal: () => void;
  t: (key: string) => string;
  tCommon: (key: string) => string;
  deleteEventHandler: () => Promise<void>;
}

export interface InterfacePreviewEventModalProps {
  eventListCardProps: InterfaceEventListCard;
  eventModalIsOpen: boolean;
  hideViewModal: () => void;
  toggleDeleteModal: () => void;
  t: (key: string) => string;
  tCommon: (key: string) => string;
  isRegistered?: boolean;
  userId: string;
  eventStartDate: Date;
  eventEndDate: Date;
  setEventStartDate: React.Dispatch<React.SetStateAction<Date>>;
  setEventEndDate: React.Dispatch<React.SetStateAction<Date>>;
  alldaychecked: boolean;
  setAllDayChecked: React.Dispatch<React.SetStateAction<boolean>>;
  publicchecked: boolean;
  setPublicChecked: React.Dispatch<React.SetStateAction<boolean>>;
  registrablechecked: boolean;
  setRegistrableChecked: React.Dispatch<React.SetStateAction<boolean>>;
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
  updateEventHandler: () => Promise<void>;
}

export interface InterfaceAttendanceStatisticsModalProps {
  show: boolean;
  handleClose: () => void;
  statistics: {
    totalMembers: number;
    membersAttended: number;
    attendanceRate: number;
  };
  memberData: InterfaceMember[];
  t: (key: string) => string;
}

export interface InterfaceEventsAttendedMemberModalProps {
  eventsAttended: Partial<InterfaceEvent>[];
  setShow: (show: boolean) => void;
  show: boolean;
  eventsPerPage?: number;
}
