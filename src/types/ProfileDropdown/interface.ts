/**
 * ProfileDropdown component interface definition
 * This file defines the TypeScript interface for the ProfileDropdown component props.
 * It ensures type safety and provides clear documentation for the expected props.
 */
export interface InterfaceProfileDropdownProps {
  /**
   * Optional prop to specify the portal type for navigation purposes.
   * Acceptable values are 'admin' or 'user'. This prop is used to determine
   * @defaultValue 'admin' the navigation path when the user clicks on the profile or logout options.
   */
  portal?: 'admin' | 'user';
}
