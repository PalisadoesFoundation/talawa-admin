/**
 * Props for SortingButton component.
 */
export interface InterfaceSortingOption {
  /** The label to display for the sorting option */
  label: string;
  /** The value associated with the sorting option */
  value: string | number;
}

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
  icon?: string | null;
}
