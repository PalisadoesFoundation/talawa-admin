export interface InterfaceUser {
  id: string;
  name: string;
  emailAddress: string;
}

export interface InterfaceAttendeeCheckIn {
  id: string;
  user: InterfaceUser;
  checkIn: null | {
    id: string;
    time: string;
    feedbackSubmitted: boolean;
  };
}

export interface InterfaceAttendeeQueryResponse {
  event: {
    id: string;
    attendeesCheckInStatus: InterfaceAttendeeCheckIn[];
  };
}

export interface InterfaceModalProp {
  show: boolean;
  eventId: string;
  handleClose: () => void;
}

export interface InterfaceTableCheckIn {
  id: string;
  name: string;
  userId: string;
  checkIn: null | {
    id: string;
    time: string;
    feedbackSubmitted: boolean;
  };
  eventId: string;
  isRecurring?: boolean;
}

export interface InterfaceTableData {
  userName: string;
  id: string;
  checkInData: InterfaceTableCheckIn;
}
