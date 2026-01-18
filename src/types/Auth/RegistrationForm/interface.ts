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
 * Sign-up response data structure from GraphQL
 */
export interface InterfaceSignUpData {
  signUp: {
    user: {
      id: string;
    };
    authenticationToken: string;
  };
}

/**
 * Props for the RegistrationForm component
 */
export interface IRegistrationFormProps {
  organizations: InterfaceOrgOption[];
  onSuccess?: (signUpData: InterfaceSignUpData) => void;
  onError?: (e: Error) => void;
  enableRecaptcha?: boolean;
}
