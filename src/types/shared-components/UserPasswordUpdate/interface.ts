/**
 * Interface for UserPasswordUpdate component props
 */
export interface InterfaceUserPasswordUpdateProps {
  /**
   * The ID of the user to update.
   * Required for admin usage (when requirePreviousPassword is false).
   */
  userId?: string;

  /**
   * Whether to require the previous password.
   * - true: for users updating their own password (default).
   * - false: for admins resetting a user's password.
   */
  requirePreviousPassword?: boolean;

  /**
   * Callback to close the modal or cancel the operation.
   */
  onCancel: () => void;

  /**
   * Callback fired after successful update.
   */
  onSuccess?: () => void;
}
