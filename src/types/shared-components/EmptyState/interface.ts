/**
 * Props interface for the EmptyState component.
 *
 * @interface InterfaceEmptyStateProps
 * @category Shared Components
 */
export interface InterfaceEmptyStateProps {
  /**
   * Primary message to display (i18n key or plain string).
   * @required
   */
  message: string;

  /**
   * Optional secondary description text.
   */
  description?: string;

  /**
   * Icon to display above the message.
   */
  icon?: string | React.ReactNode;

  /**
   * Action button configuration.
   */
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outlined';
  };

  /**
   * Custom CSS class name.
   */
  className?: string;

  /**
   * Test identifier.
   */
  dataTestId?: string;
}
