/**
 * ProfileHeader Component
 *
 * This component renders a header section for the user profile settings page.
 * It displays a title and a profile dropdown menu, providing a clean and
 * responsive layout.
 *
 * @component
 * @param {InterfaceProfileHeaderProps} props - The props for the ProfileHeader component.
 * @param {string} props.title - The title to be displayed in the header.
 *
 * @returns {JSX.Element} A JSX element representing the profile header.
 *
 * @example
 * // Example usage of ProfileHeader
 * <ProfileHeader title="User Profile" />
 *
 * @remarks
 * - The component uses Bootstrap classes for layout and styling.
 * - The `ProfileDropdown` component is included for user-specific actions.
 *
 */
import type { FC } from 'react';
// import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';
import React from 'react';

interface InterfaceProfileHeaderProps {
  title: string;
}

const ProfileHeader: FC<InterfaceProfileHeaderProps> = ({
  title,
}: InterfaceProfileHeaderProps): JSX.Element => (
  <div
    className="d-flex justify-content-between align-items-center mb-4"
    data-testid="profile-header"
  >
    <div style={{ flex: 1 }}>
      <h1 data-testid="profile-header-title">{title}</h1>
    </div>
    {/* <ProfileDropdown /> */}
  </div>
);

export default ProfileHeader;
