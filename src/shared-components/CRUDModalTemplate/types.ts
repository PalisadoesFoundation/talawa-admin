export interface CrudModalBaseProps {
  /** Controls modal visibility */
  open: boolean;

  /** Modal title */
  title: string;

  /** Close handler (Cancel / X / Esc) */
  onClose: () => void;

  /** Primary button text */
  primaryText?: string;

  /** Secondary button text */
  secondaryText?: string;

  /** Loading state */
  loading?: boolean;

  /** Error message */
  error?: string;
}

