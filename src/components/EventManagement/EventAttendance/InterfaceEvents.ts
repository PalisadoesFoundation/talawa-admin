import React from 'react';

export interface InterfaceAttendanceStatisticsModalProps {
  show: boolean;
  handleClose: () => void;
  statistics: {
    totalMembers: number;
    membersAttended: number;
    attendanceRate: number;
  };
  memberData: InterfaceMember[];
}

export interface InterfaceMember {
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  eventsAttended?: {
    _id: string;
  }[];
  birthDate: Date;
  __typename: string;
  _id: string;
  tagsAssignedWith: {
    edges: {
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
