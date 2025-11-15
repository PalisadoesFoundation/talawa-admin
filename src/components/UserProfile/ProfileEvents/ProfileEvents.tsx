/**
 * ProfileEvents Component
 *
 * Displays user's events attended using the CURRENT_USER query.
 *
 * @component
 * @param {InterfaceProfileEventsProps} props - The props for the component.
 * @param {InterfaceUserData} props.user - The user data.
 * @param {boolean} props.isOwnProfile - Whether this is the current user's own profile.
 * @param {boolean} props.isEditing - Whether the profile is in edit mode.
 * @param {function} props.onSave - Function to save user data changes.
 *
 * @returns {JSX.Element} The rendered ProfileEvents component.
 */
import React from 'react';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Event } from '@mui/icons-material';
import { Card, Spinner } from 'react-bootstrap';
import { CURRENT_USER } from 'GraphQl/Queries/Queries';
import EventsAttendedByMember from 'components/MemberActivity/EventsAttendedByMember';
import { InterfaceUserData } from '../types';
import styles from 'components/UserPortal/UserProfile/common.module.css';

interface InterfaceProfileEventsProps {
  user: InterfaceUserData;
  isOwnProfile: boolean;
  isEditing: boolean;
  onSave: (data: Partial<InterfaceUserData>) => Promise<void>;
}

const ProfileEvents: React.FC<InterfaceProfileEventsProps> = ({
  isOwnProfile,
}) => {
  const { t } = useTranslation('common');

  // Query current user's events - API exists and works!
  const { data, loading, error } = useQuery(CURRENT_USER, {
    skip: !isOwnProfile,
  });

  if (!isOwnProfile) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
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
        <h5 className="text-secondary" data-testid="events-unavailable-message">
          {t('profile.events.unavailable', {
            defaultValue: 'Events are not available in admin view',
          })}
        </h5>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '400px' }}
        aria-live="polite"
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{ minHeight: '400px' }}
      >
        <Event style={{ fontSize: '64px', color: '#dc3545', opacity: 0.5 }} />
        <p className="text-danger mt-3">Failed to load events</p>
      </div>
    );
  }

  const eventsAttended = data?.currentUser?.eventsAttended || [];

  if (eventsAttended.length === 0) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
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
        <h5 className="text-secondary">
          {t('profile.events.emptyTitle', {
            defaultValue: 'No Events Attended',
          })}
        </h5>
        <p className="text-muted" style={{ maxWidth: '500px' }}>
          {t('profile.events.emptyDesc', {
            defaultValue:
              "You haven't attended any events yet. Events you attend will appear here.",
          })}
        </p>
      </div>
    );
  }

  return (
    <Card className="border-0 rounded-4 mb-4">
      <Card.Body className={styles.cardBody}>
        <div className="mb-3">
          <h5 className="fw-semibold">
            {t('profile.events.header', { defaultValue: 'Events Attended' })}
          </h5>
          <p className="text-muted small mb-0">
            {eventsAttended.length}{' '}
            {eventsAttended.length === 1
              ? t('profile.events.singular', { defaultValue: 'event' })
              : t('profile.events.plural', { defaultValue: 'events' })}
          </p>
        </div>
        <div className={styles.scrollableCardBody}>
          {eventsAttended.map((event: { id: string }) => (
            <div key={event.id} data-testid="event-item">
              <EventsAttendedByMember eventsId={event.id} />
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProfileEvents;
