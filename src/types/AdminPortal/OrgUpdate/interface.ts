export interface InterfaceOrgUpdateProps {
  orgId: string;
}

export interface InterfaceOrganization {
  id: string;
  name: string;
  description: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  avatarURL: string | null;
  isUserRegistrationRequired: boolean | null;
}
