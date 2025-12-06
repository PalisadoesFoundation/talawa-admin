/**
 * Props for the LoginForm component
 */
export interface InterfaceLoginFormProps {
  role: 'admin' | 'user';
  isLoading: boolean;
  onSubmit: (
    email: string,
    password: string,
    recaptchaToken: string | null,
  ) => Promise<void>;
  initialEmail?: string;
  showRegisterLink?: boolean;
}
