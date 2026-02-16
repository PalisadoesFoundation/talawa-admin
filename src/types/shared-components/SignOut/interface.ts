/**
 * SignOut component interface definition
 * This file defines the TypeScript interface for the SignOut component props.
 * It ensures type safety and provides clear documentation for the expected props.
 */
export interface InterfaceSignOutProps {
  /**
   * Optional prop to conditionally render the button text.
   * When `true`, the drawer is hidden and the button text is not displayed.
   * @defaultValue false
   */
  hideDrawer?: boolean;
}
