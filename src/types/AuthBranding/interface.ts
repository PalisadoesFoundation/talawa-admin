/**
 * Props for the AuthBranding component
 */
export interface InterfaceAuthBrandingProps {
  communityData?: {
    logoURL: string;
    name: string;
    websiteURL: string;
    [key: string]: string | undefined;
  } | null;
}
