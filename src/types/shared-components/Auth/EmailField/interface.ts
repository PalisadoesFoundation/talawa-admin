import type { ChangeEvent } from 'react';

/**
 * Props for the EmailField component.
 *
 * @remarks
 * A specialized field for email input that composes FormField with email-specific defaults.
 * Supports optional validator callbacks via the error prop, which accepts string or null.
 */
export interface InterfaceEmailFieldProps {
  /** Optional label text displayed above the input - defaults to "Email" */
  label?: string;

  /** Name attribute for the input field - defaults to "email" */
  name?: string;

  /** Current email input value */
  value: string;

  /** Change handler called when input value changes */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;

  /** Placeholder text for the input - defaults to "name\@example.com" */
  placeholder?: string;

  /** Error message to display - null or undefined means no error */
  error?: string | null;

  /** Test ID for testing purposes */
  testId?: string;
}
