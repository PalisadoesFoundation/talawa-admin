import { TFunction } from 'i18next';
import { IEvent } from 'types/Event/interface';
// REMOVED: import { languages } from 'utils/languages';

/**
 * Interface representing the state of the Profile Form.
 */
export interface IProfileFormState {
  // Index signature to allow dynamic access
  [key: string]: string | File | null | undefined;

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
}

/**
 * Interface for User Data returned from GraphQL
 */
export interface IUserData {
  user?: {
    role?: string;
    [key: string]: unknown;
  };
}

/**
 * Props for the ContactInfoCard component
 */
export interface IContactInfoCardProps {
  formState: IProfileFormState;
  email: string;
  t: TFunction;
  tCommon: TFunction;
  handleFieldChange: (fieldName: string, value: string) => void;
}

/**
 * Props for the MemberActivitySection component
 */
export interface IMemberActivitySectionProps {
  events?: IEvent[];
  onViewAll: () => void;
}

/**
 * Props for the PersonalDetailsCard component
 */
export interface IPersonalDetailsCardProps {
  formState: IProfileFormState;
  userData: IUserData;
  t: TFunction;
  tCommon: TFunction;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  selectedAvatar: File | null;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFieldChange: (fieldName: string, value: string) => void;
}

// REMOVED: getLanguageName function
