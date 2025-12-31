import type React from 'react';
import type { ChangeEvent, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import type { SearchBarSize, SearchBarVariant, SearchBarTrigger } from './type';

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
  event?: KeyboardEvent<HTMLInputElement> | MouseEvent<HTMLButtonElement>; // i18n-ignore-line
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
export interface InterfaceSearchBarProps extends Omit<
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
  onSearch?: (value: string, metadata?: InterfaceSearchMeta) => void;
  /** Callback fired whenever the input value changes. */
  onChange?: (value: string, event?: ChangeEvent<HTMLInputElement>) => void;
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
  /** Clear button test id override. */
  clearButtonTestId?: string;
  /** Visual size of the component. */
  size?: SearchBarSize;
  /** Visual variant of the component. */
  variant?: SearchBarVariant;
  /** Toggle visibility of the trailing search button. Defaults to true. */
  showSearchButton?: boolean;
  /** Toggle visibility of the inline clear button. Defaults to true. */
  showClearButton?: boolean;
  /** Toggle the leading search icon visibility. Defaults to false. */
  showLeadingIcon?: boolean;
  /** Toggle the trailing search icon visibility. Defaults to false. */
  showTrailingIcon?: boolean;
  /** Optional label shown inside the search button. */
  buttonLabel?: string;
  /** Accessible label for the search button. */
  buttonAriaLabel?: string;
  /** Accessible label for the clear button. */
  clearButtonAriaLabel?: string;
  /** Renders a loading spinner inside the button when true. */
  isLoading?: boolean;
  /** Optional custom icon rendered inside the input field. */
  icon?: ReactNode;
}
