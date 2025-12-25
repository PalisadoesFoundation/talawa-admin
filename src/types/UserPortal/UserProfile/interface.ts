/**
 * Props for the EventsAttendedByUser component.
 * @property userDetails - Object containing user information and events attended
 * @property t - Translation function for internationalization
 */
export interface InterfaceEventsAttendedByUserProps {
  userDetails: {
    firstName: string;
    lastName: string;
    createdAt: string;
    gender: string;
    email: string;
    phoneNumber: string;
    birthDate: string;
    grade: string;
    empStatus: string;
    maritalStatus: string;
    address: string;
    state: string;
    country: string;
    image: string;
    eventsAttended: { _id: string }[];
  };
  t: (key: string) => string;
}

/**
 * Props for the UserAddressFields component.
 * @property t - Translation function for internationalization
 * @property handleFieldChange - Callback function to handle address field changes
 * @property userDetails - Object containing user address information
 */
export interface InterfaceUserAddressFieldsProps {
  t: (key: string) => string;
  handleFieldChange: (field: string, value: string) => void;
  userDetails: {
    addressLine1: string;
    addressLine2: string;
    state: string;
    countryCode: string;
    city: string;
    postalCode: string;
  };
}
