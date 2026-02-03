/**
 * Interface for a single dropdown option.
 */
export interface InterfaceDropDownOption {
  /**
   * The value of the option.
   */
  value: string;

  /**
   * The label of the option.
   */
  label: string;

  /**
   * Whether the option is disabled.
   */
  disabled?: boolean;
}

/**
 * Interface for dropdown component props.
 */
export interface InterfaceDropDownProps {
  /**
   * Custom styles for the parent container.
   */
  parentContainerStyle?: string;

  /**
   * Custom styles for the dropdown button.
   */
  btnStyle?: string;
}

/**
 * Interface for dropdown button component props.
 */
export interface InterfaceDropDownButtonProps extends InterfaceDropDownProps {
  /**
   * The id of the dropdown button.
   */
  id?: string;

  /**
   * The options to be displayed in the dropdown.
   */
  options: InterfaceDropDownOption[];

  /**
   * Direction the dropdown menu opens.
   */
  drop?: 'up' | 'down' | 'start' | 'end';

  /**
   * The currently selected value.
   */
  selectedValue?: string;

  /**
   * Callback function when an option is selected.
   */
  onSelect: (value: string) => void;

  /**
   * ARIA label for accessibility.
   */
  ariaLabel?: string;

  /**
   * Data test id prefix for testing purposes.
   */
  dataTestIdPrefix?: string;

  /**
   * The variant/style of the button.
   */
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'outline-primary'
    | 'outline-secondary'
    | 'outline-success'
    | 'outline-danger'
    | 'outline-warning'
    | 'outline-info'
    | 'outline-light'
    | 'outline-dark';

  /**
   * The label of the button.
   */
  buttonLabel?: string;

  /**
   * The icon to be displayed on the button.
   */
  icon?: React.ReactNode;

  /**
   * Whether the dropdown button is disabled.
   */
  disabled?: boolean;

  /**
   * Placeholder text when no option is selected.
   */
  placeholder?: string;
}
