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
  key: string;
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
  key: string;
  /** Optional column size for layout/grid purposes */
  colSize?: number;
}
