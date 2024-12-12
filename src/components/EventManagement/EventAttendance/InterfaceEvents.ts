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

export interface InterfaceMember {
  createdAt: string;
  time: string;
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
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  recurring: boolean;
  recurrenceRule: {
    recurrenceStartDate: string;
    recurrenceEndDate?: string | null;
    frequency: string;
    weekDays: string[];
    interval: number;
    count?: number;
    weekDayOccurenceInMonth?: number;
  };
  isRecurringEventException: boolean;
  isPublic: boolean;
  isRegisterable: boolean;
  attendees: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    birthDate: string;
  }[];
  __typename: string;
}

export interface InterfaceRecurringEvent {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  frequency: InterfaceEvent['recurrenceRule']['frequency'];
  interval: InterfaceEvent['recurrenceRule']['interval'];
  attendees: {
    _id: string;
    gender: 'MALE' | 'FEMALE' | 'OTHER' | 'PREFER_NOT_TO_SAY';
  }[];
  isPublic: boolean;
  isRegisterable: boolean;
}
