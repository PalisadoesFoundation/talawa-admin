import type { InterfaceOrgOption } from '../OrgSelector/interface';
import type { IRegistrationSuccessResult } from '../../../hooks/auth/useRegistration';

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
  /** Called on successful signup with result so parent can handle session/redirect */
  onSuccess?: (result: IRegistrationSuccessResult) => void;
  onError?: (e: Error) => void;
  enableRecaptcha?: boolean;
}
