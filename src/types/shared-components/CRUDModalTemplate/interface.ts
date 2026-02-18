/**
 * Type definitions for CRUD Modal Templates
 *
 * This file contains all TypeScript interfaces and types used across the
 * CRUD modal template system. These types ensure consistency and type safety
 * when creating, editing, viewing, and deleting entities.
 */

import type { ReactNode, FormEvent } from 'react';

/**
 * Size variants for modals
 */
export type ModalSize = 'sm' | 'lg' | 'xl';

/**
 * Base props shared by all CRUD modal templates
 *
 * These properties are common across all modal types and provide
 * the fundamental functionality for opening, closing, and displaying modals.
 */
export interface InterfaceCrudModalBaseProps {
  /**
   * Controls whether the modal is visible (defaults to false)
   */
  open?: boolean;

  /**
   * Modal title displayed in the header
   */
  title: string;

  /**
   * Callback function invoked when the modal is closed
   * Triggered by close button, backdrop click, or Escape key
   */
  onClose: () => void;

  /**
   * Text for the primary action button
   *
   */
  primaryText?: string;

  /**
   * Text for the secondary action button
   *
   */
  secondaryText?: string;

  /**
   * Indicates whether an async operation is in progress
   * When true, displays a loading spinner and disables action buttons
   *
   */
  loading?: boolean;

  /**
   * Error message to display in the modal body
   * When provided, shows an Alert component with the error
   */
  error?: string;

  /**
   * Modal size variant
   *
   */
  size?: ModalSize;

  /**
   * Additional CSS class name for the modal
   */
  className?: string;

  /**
   * Whether to center the modal vertically on the page
   *
   */
  centered?: boolean;

  /**
   * Test ID for the modal container (useful for testing)
   */
  'data-testid'?: string;
}

/**
 * Props for the base CRUDModalTemplate component
 *
 * This is the foundation component that all specialized modal templates build upon.
 */
export interface InterfaceCRUDModalTemplateProps extends InterfaceCrudModalBaseProps {
  /**
   * Content to render inside the modal body
   */
  children?: ReactNode;

  /**
   * Callback function for the primary action button
   * If not provided, the primary button will not be rendered
   */
  onPrimary?: () => void;

  /**
   * Variant style for the primary button
   *
   */
  primaryVariant?: 'primary' | 'danger' | 'success';

  /**
   * Whether to disable the primary button
   * Automatically disabled when loading is true
   *
   */
  primaryDisabled?: boolean;

  /**
   * Whether to hide the secondary (cancel) button
   *
   */
  hideSecondary?: boolean;

  /**
   * Custom footer content to replace the default action buttons
   * When provided, primaryText, secondaryText, and onPrimary are ignored
   */
  customFooter?: ReactNode;

  /**
   * Whether to show the modal footer at all
   *
   */
  showFooter?: boolean;
}

/**
 * Props for CreateModal template
 *
 * Specialized template for creating new entities with form submission.
 */
export interface InterfaceCreateModalProps extends InterfaceCrudModalBaseProps {
  /**
   * Form content to render inside the modal body
   */
  children: ReactNode;

  /**
   * Callback function invoked when the form is submitted
   * Should handle the creation logic and return a Promise
   */
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;

  /**
   * Whether the submit button should be disabled
   * Useful for form validation
   *
   */
  submitDisabled?: boolean;
}

/**
 * Props for EditModal template
 *
 * Specialized template for editing existing entities.
 * Parent component handles data fetching and passes pre-populated form fields as children.
 */
export interface InterfaceEditModalProps extends InterfaceCrudModalBaseProps {
  /**
   * Form content to render inside the modal body
   * Parent should pass form fields pre-populated with entity data
   */
  children: ReactNode;

  /**
   * Callback function invoked when the form is submitted
   * Should handle the update logic and return a Promise
   */
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;

  /**
   * Whether data is currently being loaded
   * Shows a loading state while fetching entity data
   */
  loadingData?: boolean;

  /**
   * Whether the submit button should be disabled
   * Useful for dirty form checking
   */
  submitDisabled?: boolean;
}

/**
 * Props for DeleteModal template
 *
 * Specialized template for delete confirmation dialogs.
 */
export interface InterfaceDeleteModalProps extends InterfaceCrudModalBaseProps {
  /**
   * Optional custom content to display in the modal body
   * If not provided, shows the confirmationMessage
   */
  children?: ReactNode;

  /**
   * Callback function invoked when deletion is confirmed
   * Should handle the delete logic and return a Promise
   */
  onDelete: () => void | Promise<void>;

  /**
   * Name of the entity being deleted (for display purposes)
   * When provided, will be shown in the confirmation message
   */
  entityName?: string;

  /**
   * Whether to show warning styling (danger variant)
   *
   */
  showWarning?: boolean;

  /**
   * Optional content to display for recurring event support
   * Allows users to choose between deleting series or single instance
   */
  recurringEventContent?: ReactNode;
}

/**
 * Props for ViewModal template
 *
 * Specialized template for read-only entity display.
 * Parent component handles data fetching and passes formatted content as children.
 */
export interface InterfaceViewModalProps extends InterfaceCrudModalBaseProps {
  /**
   * Content to display in the modal body
   * Parent should pass formatted data display as children
   */
  children: ReactNode;

  /**
   * Whether data is currently being loaded
   */
  loadingData?: boolean;

  /**
   * Optional custom action buttons to display in the footer
   * Useful for actions like "Edit" or "Delete" from the view modal
   */
  customActions?: ReactNode;
}

/**
 * Common form state for modals
 *
 * Helper type for managing form state in modal components
 */
export interface InterfaceModalFormState {
  /**
   * Whether the form has unsaved changes
   */
  isDirty?: boolean;

  /**
   * Whether the form is currently being submitted
   */
  isSubmitting?: boolean;

  /**
   * Form validation errors
   */
  errors?: Record<string, string>;
}

/**
 * Props for recurring event pattern support
 *
 * Common pattern for modals that handle recurring events
 */
export interface InterfaceRecurringEventProps {
  /**
   * Whether the event is recurring
   */
  isRecurring?: boolean;

  /**
   * Base event ID for recurring series
   */
  baseEventId?: string;

  /**
   * Current selection: apply to entire series or single instance
   */
  applyTo?: 'series' | 'instance';

  /**
   * Callback when applyTo selection changes
   */
  onApplyToChange?: (value: 'series' | 'instance') => void;
}

/**
 * Return type for useModalState hook
 */
export interface InterfaceUseModalStateReturn {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Opens the modal */
  open: () => void;
  /** Closes the modal */
  close: () => void;
  /** Toggles the modal open/close state */
  toggle: () => void;
}

/**
 * Return type for useFormModal hook
 */
export interface InterfaceUseFormModalReturn<
  T,
> extends InterfaceUseModalStateReturn {
  /** Form data being edited */
  formData: T | null;
  /** Sets the form data and opens the modal */
  openWithData: (data: T) => void;
  /** Resets form data and closes the modal */
  reset: () => void;
  /** Whether the form is currently submitting */
  isSubmitting: boolean;
  /** Sets the submitting state */
  setIsSubmitting: (value: boolean) => void;
}

/**
 * Return type for useMutationModal hook
 */
export interface InterfaceUseMutationModalReturn<
  TData,
  TResult = unknown,
  // i18n-ignore-next-line
> extends InterfaceUseFormModalReturn<TData> {
  /** Executes the mutation with current form data */
  execute: (data?: TData) => Promise<TResult | undefined>;
  /** Error from the last mutation attempt */
  error: Error | null;
  /** Clears the error state */
  clearError: () => void;
}
