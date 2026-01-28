/**
 * Interface for SidebarNavItem component props.
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
