/**
 * Interface for the parameters of resolveAvatarFile function.
 */
export interface InterfaceResolveAvatarFileParams {
  /** Whether a new avatar was uploaded */
  newAvatarUploaded: boolean;
  /** File object of the selected avatar if uploaded */
  selectedAvatar: File | null;
  /** URL of the existing avatar if no new file is uploaded */
  avatarURL: string;
}
/**
 * Interface representing the configuration for a phone input field.
 */
export interface InterfacePhoneFieldConfig {
  /** Unique identifier for the field */
  id: string;
  /** Test ID used for automated testing selectors */
  testId: string;
  /** Key used to map the field to data in the form or state */
  key: ContactInfoField;
}
/**
 * Interface representing the configuration for an address input field.
 */
export interface InterfaceAddressFieldConfig {
  /** Unique identifier for the field */
  id: string;
  /** Test ID used for automated testing selectors */
  testId: string;
  /** Key used to map the field to data in the form or state */
  key: ContactInfoField;
  /** Optional column size for layout/grid purposes */
  colSize?: number;
}
/** Props for the MemberDetail screen component. */
export type InterfaceMemberDetailProps = { id?: string };

/**
 * Union of all valid contact-info field names used in the ContactInfoCard.
 */
export type ContactInfoField =
  | 'mobilePhoneNumber'
  | 'workPhoneNumber'
  | 'homePhoneNumber'
  | 'addressLine1'
  | 'addressLine2'
  | 'postalCode'
  | 'city'
  | 'state'
  | 'countryCode';

/**
 * Props for the ContactInfoCard component.
 */
export interface InterfaceContactInfoCardProps {
  /** Form state containing field values */
  formState: Record<ContactInfoField, string | null>;
  /** Email address to display (read-only) */
  emailAddress?: string;
  /** Handler for field value changes */
  handleFieldChange: (fieldName: ContactInfoField, value: string) => void;
}
