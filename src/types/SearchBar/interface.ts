import type React from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { SearchBarTrigger } from './type';

/**
 * Metadata describing the action that triggered a search.
 */
/**
 * Metadata about how a search was triggered.
 */
export interface InterfaceSearchMeta {
  /** The trigger source for the search (button click, enter key, etc.) */
  trigger: SearchBarTrigger;
  /** The original DOM event that triggered the search, if available */
  event?: KeyboardEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>;
}

/**
 * Methods exposed by the {@link SearchBar} ref.
 */
export interface InterfaceSearchBarRef {
  /** Programmatically focus the search input */
  focus: () => void;
  /** Programmatically blur the search input */
  blur: () => void;
  /** Clear the search input value and trigger onChange */
  clear: () => void;
}

/**
 * Strongly typed props for the shared {@link SearchBar} component.
 */
export interface InterfaceSearchBarProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'size'
  > {
  /** Placeholder text for the search input. */
  placeholder?: string;
  /** Controlled input value. */
  value?: string;
  /** Initial value when used in uncontrolled mode. */
  defaultValue?: string;
  /** Callback invoked when the user submits a search via button, Enter, or clear. */
  onSearch?: (value: string) => void;
  /** Callback fired whenever the input value changes. */
  onChange?: (value: string) => void;
  /** Callback fired after the clear button is pressed. */
  onClear?: () => void;
  /** Additional class applied to the container. */
  className?: string;
  /** Additional class applied to the input element. */
  inputClassName?: string;
  /** Additional class applied to the search button. */
  buttonClassName?: string;
  /** Input test id override. */
  inputTestId?: string;
  /** Button test id override. */
  buttonTestId?: string;
  /** Accessible label for the search button. */
  buttonAriaLabel: string;
  /** Clear button test id override. */
  clearButtonTestId?: string;
}
