/**
 * Props interface for the simple SearchBar component used by AdminSearchFilterBar.
 * This is a lightweight version compared to the comprehensive SearchBar.
 */
export interface InterfaceSimpleSearchBarProps {
  /** Placeholder text for the search input */
  placeholder?: string;
  /** Function to handle search input change */
  onSearch?: (searchTerm: string) => void;
  /** Optional function to handle input change (for automatic search) */
  onChange?: (searchTerm: string) => void;
  /** Optional custom class name for the search bar container */
  className?: string;
  /** Custom data-testid for the search input */
  inputTestId?: string;
  /** Custom data-testid for the search button */
  buttonTestId?: string;
  /** Accessible label for the search button */
  buttonAriaLabel?: string;
  /** Optional controlled value for the search input */
  value?: string;
}
