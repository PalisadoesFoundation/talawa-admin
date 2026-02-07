/**
 * Represents an organization option in the selector.
 */
export interface InterfaceOrgOption {
  /** Unique identifier for the organization */
  _id: string;

  /** Display name of the organization */
  name: string;
}

/**
 * Props for the OrgSelector component.
 *
 * @remarks
 * This component is designed for Phase 2 UI implementation.
 * Integration with validators will be handled in Phase 2b.
 */
export interface InterfaceOrgSelectorProps {
  /** Array of available organizations to select from */
  options: InterfaceOrgOption[];

  /** Currently selected organization ID */
  value?: string;

  /** Callback invoked when the selected organization changes */
  onChange: (orgId: string) => void;

  /** Error message to display - null or undefined means no error */
  error?: string | null;

  /** Test ID for testing purposes */
  testId?: string;

  /** Whether the selector is disabled */
  disabled?: boolean;

  /** Whether the field is required - shows asterisk if true */
  required?: boolean;

  /** Optional custom label text - defaults to "Organization" */
  label?: string;
}
