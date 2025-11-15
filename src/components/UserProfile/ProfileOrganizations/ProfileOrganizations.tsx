/**
 * ProfileOrganizations Component
 *
 * Displays the organizations that the user is a member of or administers.
 * This is one of the tab contents for the profile view.
 *
 * @component
 * @param {InterfaceProfileOrganizationsProps} props - The props for the component.
 * @param {InterfaceUserData} props.user - The user data.
 * @param {boolean} props.isOwnProfile - Whether this is the current user's own profile.
 *
 * @returns {JSX.Element} The rendered ProfileOrganizations component.
 */
import React from 'react';
import { Business } from '@mui/icons-material';
import { InterfaceUserData } from '../types';

interface InterfaceProfileOrganizationsProps {
  user: InterfaceUserData;
  isOwnProfile: boolean;
}

const ProfileOrganizations: React.FC<
  InterfaceProfileOrganizationsProps
> = () => {
  // TODO: Implement real GraphQL query when backend is ready
  // No backend API exists yet for fetching user organizations list
  // This will need to be implemented when the backend endpoint becomes available

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <Business
        style={{
          fontSize: '64px',
          color: '#6c757d',
          marginBottom: '20px',
          opacity: 0.5,
        }}
      />
      <h5
        style={{
          color: '#495057',
          fontWeight: '600',
          marginBottom: '12px',
          fontSize: '20px',
        }}
      >
        User Organizations
      </h5>
      <p
        style={{
          color: '#6c757d',
          fontSize: '14px',
          maxWidth: '500px',
          lineHeight: '1.6',
          margin: '0',
        }}
      >
        This feature is currently under development. The backend API for
        fetching user organizations does not exist yet and will be implemented
        in a future update.
      </p>
    </div>
  );
};

export default ProfileOrganizations;
