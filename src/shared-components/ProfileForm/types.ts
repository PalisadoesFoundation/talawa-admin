/**
 * Interface definition for the Profile Form State.
 * This ensures consistency across ProfileForm and its subcomponents.
 */
export interface IProfileFormState {
  addressLine1: string;
  addressLine2: string;
  birthDate: string | null;
  emailAddress: string;
  city: string;
  avatar: File | null;
  avatarURL: string;
  countryCode: string;
  description: string;
  educationGrade: string;
  employmentStatus: string;
  homePhoneNumber: string;
  maritalStatus: string;
  mobilePhoneNumber: string;
  name: string;
  natalSex: string;
  naturalLanguageCode: string;
  password: string;
  postalCode: string;
  state: string;
  workPhoneNumber: string;
  [key: string]: unknown;
}
