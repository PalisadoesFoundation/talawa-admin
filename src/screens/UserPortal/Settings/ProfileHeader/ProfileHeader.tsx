import React from 'react';
import ProfileDropdown from 'components/ProfileDropdown/ProfileDropdown';

interface InterfaceProfileHeaderProps {
  title: string;
}

const ProfileHeader: React.FC<InterfaceProfileHeaderProps> = ({ title }) => (
  <div className="d-flex justify-content-between align-items-center mb-4">
    <div style={{ flex: 1 }}>
      <h1>{title}</h1>
    </div>
    <ProfileDropdown />
  </div>
);

export default ProfileHeader;
