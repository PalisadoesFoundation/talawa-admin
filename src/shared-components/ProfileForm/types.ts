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
}

export interface IProfileContactInfoProps {
  formState: IProfileFormState;
  handleFieldChange: (
    fieldName: keyof IProfileFormState,
    value: string,
  ) => void;
  userEmail?: string;
}

export interface IProfilePersonalDetailsProps {
  formState: IProfileFormState;
  setFormState: React.Dispatch<React.SetStateAction<IProfileFormState>>;
  handleFieldChange: (
    fieldName: keyof IProfileFormState,
    value: string,
  ) => void;
  selectedAvatar: File | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userRole?: string;
}
