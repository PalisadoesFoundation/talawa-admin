export interface UserInterface {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface AttendeeCheckInInterface {
  _id: string;
  user: UserInterface;
  checkedIn: boolean;
}

export interface AttendeeQueryResponseInterface {
  event: {
    _id: string;
    attendeesCheckInStatus: AttendeeCheckInInterface[];
  };
}

export interface ModalPropInterface {
  show: boolean;
  eventId: string;
  handleClose: () => void;
}

export interface TableCheckInInterface {
  id: string;
  userId: string;
  checkedIn: boolean;
  eventId: string;
}

export interface TableDataInterface {
  userName: string;
  id: string;
  checkInData: TableCheckInInterface;
}
