/**
 * Props for the AddMember component (organization people "Add Members" dropdown and modals).
 * Used to pass styling class names from the parent screen so styles stay decoupled from test IDs.
 */
export interface InterfaceAddMemberProps {
  /** Optional class for the Add Members header wrapper (e.g. PageHeader root). */
  rootClassName?: string;
  /** Optional class for the Add Members dropdown container. */
  containerClassName?: string;
  /** Optional class for the Add Members dropdown toggle button. */
  toggleClassName?: string;
}
