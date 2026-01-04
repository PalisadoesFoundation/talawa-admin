/**
 * Interface for SidebarNavItem component props.
 *
 * @interface ISidebarNavItemProps
 * @property {string} to - Navigation target URL
 * @property {React.ReactNode} icon - Icon component or element
 * @property {string} label - Display label for the navigation item
 * @property {string} testId - Test ID for testing purposes
 * @property {boolean} hideDrawer - Whether the drawer is hidden/collapsed
 * @property {() => void} [onClick] - Optional click handler
 * @property {boolean} [useSimpleButton] - Use simple button style (for org drawers)
 * @property {'react-icon' | 'svg'} [iconType] - Type of icon being passed. Use 'react-icon' for icons from react-icons library, 'svg' for SVG components. Defaults to 'svg' if not specified.
 * @property {string} [dataCy] - Cypress E2E test selector (data-cy attribute)
 */
export interface ISidebarNavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  testId: string;
  hideDrawer: boolean;
  onClick?: () => void;
  useSimpleButton?: boolean;
  iconType?: 'react-icon' | 'svg';
  dataCy?: string;
}
