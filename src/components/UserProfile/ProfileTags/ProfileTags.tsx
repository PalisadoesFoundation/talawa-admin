/**
 * ProfileTags Component
 *
 * Displays the tags associated with the user. This tab is only visible to administrators.
 * This is one of the tab contents for the profile view.
 *
 * @component
 * @param {ProfileTagsProps} props - The props for the component.
 * @param {UserData} props.user - The user data.
 * @param {boolean} props.isOwnProfile - Whether this is the current user's own profile.
 *
 * @returns {JSX.Element} The rendered ProfileTags component.
 */
import React from 'react';
import { InterfaceUserData } from '../types';

interface InterfaceProfileTagsProps {
  user: InterfaceUserData;
  isOwnProfile: boolean;
}

const ProfileTags: React.FC<InterfaceProfileTagsProps> = () => {
  // TODO: Implement GraphQL query to fetch user tags when backend support is available
  // Currently, there is no backend API to fetch tags assigned to a specific user

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        minHeight: '400px',
        padding: '40px',
        textAlign: 'center',
      }}
    >
      <div
        className="mb-4"
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <i
          className="fas fa-tags"
          style={{
            fontSize: '48px',
            color: '#6c757d',
          }}
        ></i>
      </div>
      <h3
        style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#495057',
          marginBottom: '12px',
        }}
      >
        User Tags
      </h3>
      <p
        style={{
          fontSize: '16px',
          color: '#6c757d',
          maxWidth: '500px',
          marginBottom: '8px',
        }}
      >
        This feature is currently under development.
      </p>
      <p
        style={{
          fontSize: '14px',
          color: '#868e96',
          maxWidth: '500px',
        }}
      >
        Once available, you will be able to view and manage tags assigned to
        this user.
      </p>
    </div>
  );
};

export default ProfileTags;
