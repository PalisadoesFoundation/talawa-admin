import type { InterfaceOrgOption } from '../OrgSelector/interface';
export interface IRegistrationFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  orgId?: string;
}
export interface IRegistrationFormProps {
  organizations: InterfaceOrgOption[];
  onSuccess?: () => void;
  onError?: (e: Error) => void;
  enableRecaptcha?: boolean;
}
