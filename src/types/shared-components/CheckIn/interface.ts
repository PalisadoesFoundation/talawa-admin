export interface InterfaceUser {
  id: string;
  name: string;
  emailAddress: string;
}

export interface InterfaceAttendeeCheckIn {
  id: string;
  user: InterfaceUser;
  checkInTime: string | null;
  checkOutTime: string | null;
  isCheckedIn: boolean;
  isCheckedOut: boolean;
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
  onCheckInUpdate?: () => void;
}

export interface InterfaceTableCheckIn {
  id: string;
  name: string;
  userId: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  isCheckedIn: boolean;
  isCheckedOut: boolean;
  eventId: string;
  isRecurring?: boolean;
}

export interface InterfaceTableData {
  userName: string;
  id: string;
  checkInData: InterfaceTableCheckIn;
}

/**
 * Props for TableRow component.
 * @remarks Used to render check-in status and actions for event attendees.
 */
export interface InterfaceTableRowProps {
  /** The check-in data for the attendee row */
  data: InterfaceTableCheckIn;
  /** Callback to refresh the attendee list after mutations */
  refetch: () => void;
  /** Optional callback invoked after a successful check-in to notify parent components */
  onCheckInUpdate?: () => void;
}
