/**
 * This file contains the type definitions for the UserProfile components.
 */

/**
 * Props for the EventsAttendedByUser component.
 *
 * @property userDetails - The details of the user.
 * @property userDetails.name - The full name of the user.
 * @property userDetails.emailAddress - The email address of the user.
 * @property userDetails.natalSex - The natal sex of the user.
 * @property userDetails.createdAt - The creation date of the user account.
 * @property userDetails.birthDate - The birth date of the user.
 * @property userDetails.educationGrade - The education grade of the user.
 * @property userDetails.employmentStatus - The employment status of the user.
 * @property userDetails.maritalStatus - The marital status of the user.
 * @property userDetails.addressLine1 - The first line of the address.
 * @property userDetails.addressLine2 - The second line of the address.
 * @property userDetails.state - The state where the user resides.
 * @property userDetails.countryCode - The country code of the user.
 * @property userDetails.avatarURL - The profile image URL of the user.
 * @property userDetails.city - The city where the user resides.
 * @property userDetails.description - Description or bio of the user.
 * @property userDetails.homePhoneNumber - The home phone number.
 * @property userDetails.mobilePhoneNumber - The mobile phone number.
 * @property userDetails.workPhoneNumber - The work phone number.
 * @property userDetails.naturalLanguageCode - The natural language code.
 * @property userDetails.postalCode - The postal code.
 * @property userDetails.eventsAttended - List of events the user has attended.
 * @property t - A translation function that accepts a key and returns the corresponding localized string.
 */
export interface InterfaceEventsAttendedByUserProps {
  userDetails: {
    name: string;
    emailAddress: string;
    natalSex: string;
    createdAt?: string;
    birthDate: string | null;
    educationGrade: string;
    employmentStatus: string;
    maritalStatus: string;
    addressLine1: string;
    addressLine2: string;
    state: string;
    countryCode: string;
    avatarURL: string;
    city: string;
    description: string;
    homePhoneNumber: string;
    mobilePhoneNumber: string;
    workPhoneNumber: string;
    naturalLanguageCode: string;
    postalCode: string;
    eventsAttended?: { id: string }[];
  };
  t: (key: string) => string;
}

/**
 * Props for the UserAddressFields component.
 *
 * @property t - A translation function that accepts a key and returns the corresponding localized string.
 * @property handleFieldChange - A function to handle changes to address fields.
 * @property userDetails - The address details of the user.
 * @property userDetails.addressLine1 - The first line of the address.
 * @property userDetails.addressLine2 - The second line of the address.
 * @property userDetails.state - The state of the address.
 * @property userDetails.countryCode - The country code of the address.
 * @property userDetails.city - The city of the address.
 * @property userDetails.postalCode - The postal code of the address.
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
