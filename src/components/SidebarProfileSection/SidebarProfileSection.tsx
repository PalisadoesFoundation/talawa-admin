/**
 * SidebarProfileSection Component
 *
 * A shared component for rendering the user profile and sign-out section at the bottom of the sidebar.
 * Used across all sidebar variants (Admin and User Portal).
 *
 * @component
 * @param {ISidebarProfileSectionProps} props - The props for the component.
 * @param {boolean} props.hideDrawer - Whether the sidebar is collapsed.
 *
 * @returns {JSX.Element} The rendered SidebarProfileSection component.
 *
 * @example
 * ```tsx
 * <SidebarProfileSection hideDrawer={false} />
 * ```
 */

import React from 'react';
import ProfileCard from 'components/ProfileCard/ProfileCard';
import SignOut from 'components/SignOut/SignOut';
import styles from 'style/app-fixed.module.css';

export interface ISidebarProfileSectionProps {
  hideDrawer: boolean;
}

const SidebarProfileSection = ({
  hideDrawer,
}: ISidebarProfileSectionProps): JSX.Element => {
  return (
    <div
      className={styles.userSidebarOrgFooter}
      data-testid="sidebar-profile-section"
    >
      {!hideDrawer && <ProfileCard />}
      <SignOut hideDrawer={hideDrawer} />
    </div>
  );
};

export default SidebarProfileSection;
