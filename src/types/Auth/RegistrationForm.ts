export interface IAuthUser {
  id: string;
  name: string;
  emailAddress: string;
  role: 'administrator' | 'user';
  avatarURL?: string;
  countryCode?: string;
}

export interface IAuthResponse {
  user: IAuthUser;
  authenticationToken: string;
}

export interface IOrganizationOption {
  label: string;
  id: string;
}

export interface IRegistrationFormProps {
  organizations: IOrganizationOption[];
  onSuccess: (data: IAuthResponse) => void;
  loading?: boolean;
}
