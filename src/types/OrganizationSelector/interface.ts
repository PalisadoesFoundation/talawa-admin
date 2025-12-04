/**
 * Props for the OrganizationSelector component
 */
export interface InterfaceOrganizationSelectorProps {
  organizations: Array<{ label: string; id: string }>;
  value: string;
  onChange: (orgId: string) => void;
  disabled?: boolean;
  required?: boolean;
}
