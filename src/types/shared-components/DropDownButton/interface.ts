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
  label: React.ReactNode;

  /**
   * Whether the option is disabled.
   */
  disabled?: boolean;
}

/**
 * Interface for dropdown component props.
 *
 * Styling props:
 * - **Base (component/default layout):** `parentContainerStyle` and `btnStyle` are applied first
 *   (e.g. from SortingButton or Navbar defaults).
 * - **Consumer overrides:** `containerClassName` and `toggleClassName` are merged with the base
 *   so parent screens can add their own CSS module classes without replacing defaults.
 */
export interface InterfaceDropDownProps {
  /**
   * Base class(es) for the dropdown container. Applied first; often set by the wrapping component
   * (e.g. SortingButton, Navbar). Use this for default layout/theme.
   */
  parentContainerStyle?: string;

  /**
   * Base class(es) for the toggle button. Applied first; often set by the wrapping component.
   * Use this for default button layout/theme.
   */
  btnStyle?: string;

  /**
   * Custom class name for the dropdown menu.
   */
  menuClassName?: string;

  /**
   * Consumer override: extra class name(s) for the dropdown container, merged with
   * parentContainerStyle. Use from parent screens (e.g. CSS module classes) to style the
   * container without coupling to test IDs.
   */
  containerClassName?: string;

  /**
   * Consumer override: extra class name(s) for the toggle button, merged with btnStyle.
   * Use from parent screens (e.g. CSS module classes) to style the toggle without
   * coupling to test IDs.
   */
  toggleClassName?: string;
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

  /**
   * Whether the dropdown should be searchable.
   */
  searchable?: boolean;

  /**
   * Placeholder text for the search input.
   */
  searchPlaceholder?: string;

  /** Whether to show the caret icon on the dropdown button.
   * @defaultValue true
   */
  showCaret?: boolean;
}

/**
 * Interface for SearchToggle component props.
 */
export interface InterfaceSearchToggleProps {
  onClick: (e: React.MouseEvent) => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputClick: (e: React.MouseEvent) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  dataTestIdPrefix: string;
  className?: string;
}
