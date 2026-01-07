import type { InterfaceOrgOption } from '../OrgSelector/interface';

/**
 * Form data structure for user registration
 */
export interface IRegistrationFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  orgId?: string;
}

/**
 * Props for the RegistrationForm component
 */
export interface IRegistrationFormProps {
  organizations: InterfaceOrgOption[];
  onSuccess?: () => void;
  onError?: (e: Error) => void;
  enableRecaptcha?: boolean;
}
