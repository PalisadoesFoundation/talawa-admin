/**
 * ProfileEvents Component
 *
 * Displays user's events (created, registered, admin for).
 * Currently shows an empty state as backend API is not yet implemented.
 *
 * @component
 * @param {ProfileEventsProps} props - The props for the component.
 * @param {UserData} props.user - The user data.
 * @param {boolean} props.isOwnProfile - Whether this is the current user's own profile.
 * @param {boolean} props.isEditing - Whether the profile is in edit mode.
 * @param {function} props.onSave - Function to save user data changes.
 *
 * @returns {JSX.Element} The rendered ProfileEvents component.
 */
import React from 'react';
import { Event } from '@mui/icons-material';
import { InterfaceUserData } from '../types';

interface InterfaceProfileEventsProps {
  user: InterfaceUserData;
  isOwnProfile: boolean;
  isEditing: boolean;
  onSave: (data: Partial<InterfaceUserData>) => Promise<void>;
}

const ProfileEvents: React.FC<InterfaceProfileEventsProps> = () => {
  // TODO: Implement real GraphQL query when backend is ready
  // No backend API exists yet for fetching user events list
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
      <Event
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
        User Events
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
        fetching user events does not exist yet and will be implemented in a
        future update.
      </p>
    </div>
  );
};

export default ProfileEvents;
