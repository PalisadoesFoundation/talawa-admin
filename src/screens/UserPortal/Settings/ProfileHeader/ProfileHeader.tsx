import type { FC } from 'react';
import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';
import React from 'react';

/**
 * Props interface for the ProfileHeader component
 */
interface InterfaceProfileHeaderProps {
  /**
   * The title text to be displayed in the header
   */
  title: string;
}

/**
 * A header component that displays a title and profile dropdown menu
 *
 * This component creates a header section that includes:
 * - A title on the left side
 * - A profile dropdown menu on the right side
 *
 * The layout uses flexbox for proper alignment and spacing between
 * the title and the dropdown menu.
 *
 * @remarks
 * The component uses Bootstrap classes for layout and styling:
 * - d-flex for flexbox layout
 * - justify-content-between for spacing
 * - align-items-center for vertical alignment
 *
 * @example
 * Basic usage:
 * ```tsx
 * <ProfileHeader title="Settings" />
 * ```
 *
 * Usage with translated text:
 * ```tsx
 * <ProfileHeader title={t('settings')} />
 * ```
 */
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
    <ProfileDropdown />
  </div>
);

export default ProfileHeader;
