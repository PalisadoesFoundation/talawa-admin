export interface InterfaceUser {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface InterfaceAttendeeCheckIn {
  _id: string;
  user: InterfaceUser;
  checkIn: null | {
    _id: string;
    time: string;
<<<<<<< HEAD
=======
    allotedRoom: string;
    allotedSeat: string;
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  };
}

export interface InterfaceAttendeeQueryResponse {
  event: {
    _id: string;
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
    _id: string;
    time: string;
<<<<<<< HEAD
=======
    allotedRoom: string;
    allotedSeat: string;
>>>>>>> a320d35e91b2a3d10a9143384969dba0973c37f1
  };
  eventId: string;
}

export interface InterfaceTableData {
  userName: string;
  id: string;
  checkInData: InterfaceTableCheckIn;
}
