/**
 * Props for AddOnSpotAttendee component.
 */
export interface InterfaceAddOnSpotAttendeeProps {
  show: boolean;
  handleClose: () => void;
  reloadMembers: () => void;
}

export interface InterfaceFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  gender: string;
}
