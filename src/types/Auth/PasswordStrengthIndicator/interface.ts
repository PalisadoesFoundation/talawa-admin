/**
 * Props for the PasswordStrengthIndicator component.
 *
 * @remarks
 * Displays a checklist of password requirements with real-time feedback.
 */
export interface InterfacePasswordStrengthIndicatorProps {
  /** Password string to validate against requirements */
  password: string;

  /** Controls component visibility - defaults to true */
  isVisible?: boolean;
}
