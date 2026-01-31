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

export interface ILoginFormProps {
  isAdmin: boolean;
  onSuccess: (data: IAuthResponse) => void;
  loading?: boolean;
}
