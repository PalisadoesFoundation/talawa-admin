/**
 * Props for the EventsAttendedByUser component.
 * @param userDetails - Object containing user information and events attended
 * @param t - Translation function for internationalization
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
