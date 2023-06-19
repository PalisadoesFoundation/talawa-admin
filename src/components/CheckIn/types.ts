export interface UserInterface {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface AttendeeCheckInInterface {
  _id: string;
  user: UserInterface;
  checkIn: null | {
    _id: string;
    time: string;
    allotedRoom: string;
    allotedSeat: string;
  };
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
  checkIn: null | {
    _id: string;
    time: string;
    allotedRoom: string;
    allotedSeat: string;
  };
  eventId: string;
}

export interface TableDataInterface {
  userName: string;
  id: string;
  checkInData: TableCheckInInterface;
}
