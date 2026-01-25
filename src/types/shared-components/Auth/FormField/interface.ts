import type { ChangeEvent, FocusEvent } from 'react';

/**
 * Props for the FormField component.
 *
 * @remarks
 * Supports optional validator callbacks and aria-live behaviors for accessibility.
 */
export interface InterfaceFormFieldProps {
  /** Optional label text displayed above the input */
  label?: string;

  /** Name attribute for the input field (required for form handling) */
  name: string;

  /** Input type - defaults to 'text' */
  type?: 'text' | 'email' | 'password' | 'tel';

  /** Current input value */
  value: string;

  /** Change handler called when input value changes */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;

  /** Blur handler called when input loses focus */
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;

  /** Placeholder text for the input */
  placeholder?: string;

  /** Whether the field is required - shows asterisk if true */
  required?: boolean;

  /** Whether the input is disabled */
  disabled?: boolean;

  /** Test ID for testing purposes */
  testId?: string;

  /** Error message to display - null or undefined means no error */
  error?: string | null;

  /** Helper text to display below the input when no error */
  helperText?: string;

  /**
   * Whether to use aria-live for dynamic error announcements.
   * When true, error messages are announced to screen readers.
   * Defaults to true.
   */
  ariaLive?: boolean;
}
