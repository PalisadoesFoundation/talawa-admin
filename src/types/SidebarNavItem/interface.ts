/**
 * Interface for SidebarNavItem component props.
 */
export interface ISidebarNavItemProps {
  /* Navigation target URL */
  to: string;
  /* Icon component or element */
  icon: React.ReactNode;
  /* Display label for the navigation item */
  label: string;
  /* Test ID for testing purposes */
  testId: string;
  /* Whether the drawer is hidden/collapsed */
  hideDrawer: boolean;
  /* (Optional) Click handler */
  onClick?: () => void;
  /* (Optional) Use simple button style (for org drawers) */
  useSimpleButton?: boolean;
  /* (Optional) Type of icon being passed. Use 'react-icon' for icons from react-icons library, 'svg' for SVG components. Defaults to 'svg' if not specified. */
  iconType?: 'react-icon' | 'svg';
  /* (Optional) Cypress E2E test selector (data-cy attribute) */
  dataCy?: string;
}
