/**
 * Represents a single sorting option for the SortingButton dropdown.
 */
export interface InterfaceSortingOption {
  /** The label to display for the sorting option */
  label: string;
  /** The value associated with the sorting option */
  value: string | number;
}

/**
 * Props for the SortingButton component.
 */
export interface InterfaceSortingButtonProps {
  /** The title attribute for the Dropdown */
  title?: string;
  /** The list of sorting options to display in the Dropdown */
  sortingOptions: InterfaceSortingOption[];
  /** The currently selected sorting option */
  selectedOption?: string | number;
  /** Callback function to handle sorting option change */
  onSortChange: (value: string | number) => void;
  /** The prefix for data-testid attributes for testing */
  dataTestIdPrefix: string;
  /** The data-testid attribute for the Dropdown */
  dropdownTestId?: string;
  /** Custom class name for the Dropdown */
  className?: string;
  /** Optional prop for custom button label */
  buttonLabel?: string;
  /** Type to determine the icon to display: 'sort' or 'filter' */
  type?: 'sort' | 'filter';
  /** Accessible label for the dropdown button (screen readers) */
  ariaLabel?: string;
  /** Optional custom icon to display in the button */
  icon?: string | null;
}
