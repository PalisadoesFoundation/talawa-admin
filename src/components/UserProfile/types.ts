/**
 * Shared types for UserProfile components
 */

export interface InterfaceUserData {
  id: string;
  name: string;
  emailAddress: string;
  avatarURL?: string;
  description?: string;
  birthDate?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  countryCode?: string;
  postalCode?: string;
  mobilePhoneNumber?: string;
  homePhoneNumber?: string;
  workPhoneNumber?: string;
  educationGrade?: string;
  employmentStatus?: string;
  maritalStatus?: string;
  natalSex?: string;
  naturalLanguageCode?: string;
  createdAt: string;
  role?: string;
}
