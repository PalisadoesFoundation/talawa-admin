/**
 * Props for SearchingButton component.
 */
export interface InterfaceSearchingButtonProps {
  /** The title attribute for the Dropdown */
  title?: string;
  /** The text to display in the button */
  text?: string;
  /** The prefix for data-testid attributes for testing */
  dataTestIdPrefix: string;
  /** The data-testid attribute for the Dropdown */
  dropdownTestId?: string;
  /** Custom class name for the Dropdown */
  className?: string;
  /** Type to determine the icon to display: 'sort' or 'filter' */
  type?: 'sort' | 'filter';
}
