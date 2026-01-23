/**
 * ProfileHeader Component
 *
 * This component renders a header section for the user profile settings page.
 * It displays the title for settings
 *
 * @remarks
 * - The component uses Bootstrap classes for layout and styling.
 * - Displays a clean header section with the provided title.
 *
 * @param props - The props for the UserSidebar component:
 * - `title`: The title to be displayed in the header.
 *
 * @returns A JSX element representing the profile header.
 *
 * @example
 * // Example usage of ProfileHeader
 * <ProfileHeader title="User Profile" />
 */
import type { FC } from 'react';
import React from 'react';

interface IProfileHeaderProps {
  title: string;
}

const ProfileHeader: FC<IProfileHeaderProps> = ({
  title,
}: IProfileHeaderProps): React.JSX.Element => (
  <div
    className="d-flex justify-content-between align-items-center mb-4"
    data-testid="profile-header"
  >
    <div className="flex-grow-1">
      <h1 data-testid="profile-header-title">{title}</h1>
    </div>
  </div>
);

export default ProfileHeader;
