/**
 * Props for the RegistrationForm component
 */
export interface InterfaceRegistrationFormProps {
  role: 'admin' | 'user';
  isLoading: boolean;
  onSubmit: (
    userData: IRegistrationData,
    recaptchaToken: string | null,
  ) => Promise<boolean>;
  showLoginLink?: boolean;
  organizations: Array<{ label: string; id: string }>;
}

export interface IRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  organizationId?: string;
}
