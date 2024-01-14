import React from 'react';
import Button from 'react-bootstrap/Button';
import { useHistory } from 'react-router-dom';
import { ReactComponent as AngleRightIcon } from 'assets/svgs/angleRight.svg';
import { ReactComponent as LogoutIcon } from 'assets/svgs/logout.svg';
import { ReactComponent as TalawaLogo } from 'assets/svgs/talawa.svg';
import styles from './LeftDrawerEvent.module.css';
import IconComponent from 'components/IconComponent/IconComponent';
import { EventRegistrantsWrapper } from 'components/EventRegistrantsModal/EventRegistrantsWrapper';
import { CheckInWrapper } from 'components/CheckIn/CheckInWrapper';
import { EventStatsWrapper } from 'components/EventStats/EventStatsWrapper';
import { REVOKE_REFRESH_TOKEN } from 'GraphQl/Mutations/mutations';
import { useMutation } from '@apollo/client';

export interface InterfaceLeftDrawerProps {
  event: {
    _id: string;
    title: string;
    description: string;
    organization: {
      _id: string;
    };
  };
  hideDrawer: boolean | null;
  setHideDrawer: React.Dispatch<React.SetStateAction<boolean | null>>;
  setShowAddEventProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const leftDrawerEvent = ({
  event,
  hideDrawer,
  setShowAddEventProjectModal,
}: InterfaceLeftDrawerProps): JSX.Element => {
  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN);
  const userType = localStorage.getItem('UserType');
  const firstName = localStorage.getItem('FirstName');
  const lastName = localStorage.getItem('LastName');
  const userImage = localStorage.getItem('UserImage');
  const userId = localStorage.getItem('id');

  const history = useHistory();
  const logout = (): void => {
    revokeRefreshToken();
    localStorage.clear();
    history.push('/');
  };

  return (
    <>
      <div
        className={`${styles.leftDrawer} ${
          hideDrawer === null
            ? styles.hideElemByDefault
            : hideDrawer
            ? styles.inactiveDrawer
            : styles.activeDrawer
        }`}
        data-testid="leftDrawerContainer"
      >
        {/* Branding Section */}
        <div className={styles.brandingContainer}>
          <TalawaLogo className={styles.talawaLogo} />
          <span className={styles.talawaText}>Talawa Admin Portal</span>
        </div>

        {/* Event Detail Section */}
        <div className={styles.organizationContainer}>
          <button className={styles.profileContainer} data-testid="OrgBtn">
            <div className={styles.imageContainer}>
              <img
                src={`https://api.dicebear.com/5.x/initials/svg?seed=${event.title
                  .split(' ')
                  .join('%20')}`}
                alt="Dummy Event Picture"
              />
            </div>
            <div className={styles.profileText}>
              <span className={styles.primaryText}>
                {event.title && event.title.length > 20
                  ? event.title.substring(0, 20) + '...'
                  : event.title}
              </span>
              <span className={styles.secondaryText}>
                {event.description && event.description.length > 30
                  ? event.description.substring(0, 30) + '...'
                  : event.description}
              </span>
            </div>
          </button>
        </div>

        {/* Options List */}
        <div className={styles.optionList}>
          <h5 className={styles.titleHeader}>Event Options</h5>
          <Button
            variant="light"
            className="text-secondary"
            aria-label="addEventProject"
            onClick={(): void => {
              setShowAddEventProjectModal(true);
            }}
          >
            <div className={styles.iconWrapper}>
              <IconComponent
                name="Add Event Project"
                fill="var(--bs-secondary)"
              />
            </div>
            Add an Event Project
          </Button>
          <EventRegistrantsWrapper
            key={`${event?._id || 'loading'}Registrants`}
            eventId={event._id}
            orgId={event.organization._id}
          />
          <CheckInWrapper
            eventId={event._id}
            key={`${event?._id || 'loading'}CheckIn`}
          />
          <EventStatsWrapper
            eventId={event._id}
            key={`${event?._id || 'loading'}Stats`}
          />
          <Button
            variant="light"
            data-testid="allEventsBtn"
            className="text-secondary"
            aria-label="allEvents"
            onClick={(): void => {
              history.push(`/orgevents/id=${event.organization._id}`);
            }}
          >
            <div className={styles.iconWrapper}>
              <IconComponent name="Events" fill="var(--bs-secondary)" />
            </div>
            All Events
          </Button>
        </div>

        {/* Profile Section & Logout Btn */}
        <div style={{ marginTop: 'auto' }}>
          <button
            className={styles.profileContainer}
            data-testid="profileBtn"
            onClick={(): void => {
              history.push(`/member/id=${userId}`);
            }}
          >
            <div className={styles.imageContainer}>
              {userImage && userImage !== 'null' ? (
                <img src={userImage} alt={`Profile Picture`} />
              ) : (
                <img
                  src={`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`}
                  alt={`Dummy User Picture`}
                />
              )}
            </div>
            <div className={styles.profileText}>
              <span className={styles.primaryText}>
                {firstName} {lastName}
              </span>
              <span className={styles.secondaryText}>
                {`${userType}`.toLowerCase()}
              </span>
            </div>
            <AngleRightIcon fill={'var(--bs-secondary)'} />
          </button>
          <Button
            variant="light"
            className={`mt-4 d-flex justify-content-start px-0 w-100 ${styles.logout}`}
            onClick={(): void => logout()}
            data-testid="logoutBtn"
          >
            <div className={styles.imageContainer}>
              <LogoutIcon fill={'var(--bs-secondary)'} />
            </div>
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default leftDrawerEvent;
