/**
 * Interface for SidebarNavItem component props.
 *
 * @param to - Navigation target URL
 * @param icon - Icon component or element
 * @param label - Display label for the navigation item
 * @param testId - Test ID for testing purposes
 * @param hideDrawer - Whether the drawer is hidden/collapsed
 * @param onClick - (Optional) Click handler
 * @param useSimpleButton - (Optional) Use simple button style (for org drawers)
 * @param iconType - (Optional) Type of icon being passed. Use 'react-icon' for icons from react-icons library, 'svg' for SVG components. Defaults to 'svg' if not specified.
 * @param dataCy - (Optional) Cypress E2E test selector (data-cy attribute)
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
