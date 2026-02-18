/**
 * Defines the props for the AddOnSpotAttendee component.
 */
export interface InterfaceAddOnSpotAttendeeProps {
  show: boolean;
  handleClose: () => void;
  reloadMembers: () => void;
}

/**
 * Defines the structure for form data.
 */
export interface InterfaceFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  gender: string;
}
